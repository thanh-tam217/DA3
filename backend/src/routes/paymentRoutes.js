const express = require('express');
const crypto = require('crypto');
const qs = require('qs');
const router = express.Router();
const Ve = require('../models/veModel');

// sortObject theo đúng sample VNPay: encode key & value, space -> '+'
function sortObject(obj) {
  const sorted = {};
  const arr = [];
  for (const k in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      arr.push(encodeURIComponent(k));
    }
  }
  arr.sort();
  for (let i = 0; i < arr.length; i++) {
    const key = arr[i];
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, '+');
  }
  return sorted;
}

// Tạo URL thanh toán (khớp mẫu VNPay)
router.post('/create_payment_url', async (req, res) => {
  try {
    // IP chuẩn hoá
    let ipAddr =
      req.headers['x-forwarded-for'] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.connection?.socket?.remoteAddress ||
      '127.0.0.1';
    if (!ipAddr || ipAddr === '::1' || ipAddr.startsWith('::ffff:')) ipAddr = '127.0.0.1';

    const tmnCode   = (process.env.VNP_TMN_CODE || '').trim();
    const secretKey = (process.env.VNP_HASH_SECRET || '').trim();
    const vnpUrl    = (process.env.VNP_URL || '').trim();
    const returnUrl = (process.env.VNP_RETURN_URL || '').trim();

    const { veId, amount: amountBody, bankCode, language } = req.body;

    let amount = 0;
    let orderInfo = 'TT_DonHang';
    let ve = null;

    if (veId) {
      ve = await Ve.findById(veId);
      if (!ve) return res.status(404).json({ success: false, message: 'Không tìm thấy vé' });
      amount = Number(ve.giaVe) * 100; // VNPay yêu cầu *100
      orderInfo = `TT_${String(ve._id).replace(/[^a-zA-Z0-9]/g, '')}`;
    } else {
      amount = Number(amountBody) * 100;
    }

    const date = new Date();
    const pad = n => n.toString().padStart(2, '0');
    const createDate = `${date.getFullYear()}${pad(date.getMonth()+1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
    const orderId = `${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;

    const locale = language && String(language).trim() ? language : 'vn';

    let vnp_Params = {};
    vnp_Params['vnp_Version']   = '2.1.0';
    vnp_Params['vnp_Command']   = 'pay';
    vnp_Params['vnp_TmnCode']   = tmnCode;
    vnp_Params['vnp_Locale']    = locale;
    vnp_Params['vnp_CurrCode']  = 'VND';
    vnp_Params['vnp_TxnRef']    = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;               // không dấu, không space
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount']    = String(Math.round(amount));
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr']    = ipAddr;
    vnp_Params['vnp_CreateDate']= createDate;
    if (bankCode) vnp_Params['vnp_BankCode'] = bankCode;

    // sort + encode trước khi ký (đúng sample)
    vnp_Params = sortObject(vnp_Params);
    const signData = qs.stringify(vnp_Params, { encode: false });
    const signed = crypto.createHmac('sha512', secretKey)
      .update(Buffer.from(signData, 'utf-8'))
      .digest('hex');

    vnp_Params['vnp_SecureHash'] = signed;
    const payUrl = `${vnpUrl}?${qs.stringify(vnp_Params, { encode: false })}`;

    if (ve) {
      ve.maThanhToan = orderId;
      ve.hinhThucThanhToan = 'vnpay';
      ve.trangThaiThanhToan = 'pending';
      await ve.save();
    }

    console.log('[VNPAY signData]', signData);
    console.log('[VNPAY hash    ]', signed);
    console.log('[VNPAY URL     ]', payUrl);

    return res.json({ success: true, payUrl });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: 'Lỗi tạo URL thanh toán' });
  }
});

// Return: remove hash rồi verify (đúng sample)
// router.get('/vnpay_return', (req, res) => {
//   try {
//     let vnp_Params = { ...req.query };
//     const secureHash = vnp_Params['vnp_SecureHash'];
//     delete vnp_Params['vnp_SecureHash'];
//     delete vnp_Params['vnp_SecureHashType'];

//     vnp_Params = sortObject(vnp_Params);
//     const secretKey = (process.env.VNP_HASH_SECRET || '').trim();
//     const signData = qs.stringify(vnp_Params, { encode: false });
//     const signed = crypto.createHmac('sha512', secretKey)
//       .update(Buffer.from(signData, 'utf-8')).digest('hex');

//     const ok = secureHash === signed;
//     const code = ok ? vnp_Params['vnp_ResponseCode'] : '97';
//     const redirectTo = `http://localhost:5500/pages/quanlyve.html?result=${code}&valid=${ok ? 1 : 0}`;
//     return res.redirect(redirectTo);
//   } catch {
//     return res.redirect('http://localhost:5500/pages/quanlyve.html?result=99&valid=0');
//   }
// });

// routes/paymentRoutes.js  (chỉ phần /vnpay_return)
router.get('/vnpay_return', async (req, res) => {
  try {
    let vnp_Params = { ...req.query };
    const secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    // ký lại
    const signData = qs.stringify(sortObject(vnp_Params), { encode: false });
    const signed = crypto.createHmac('sha512', (process.env.VNP_HASH_SECRET || '').trim())
      .update(Buffer.from(signData, 'utf-8')).digest('hex');

    const ok = secureHash === signed;
    const code = vnp_Params['vnp_ResponseCode'];      // '00' nếu thành công
    const txnRef = vnp_Params['vnp_TxnRef'];          // CHÍNH LÀ orderId bạn đã lưu ở ve.maThanhToan

    // Nếu chữ ký hợp lệ, cập nhật vé (phòng khi IPN chưa về)
    if (ok) {
      const ve = await Ve.findOne({ maThanhToan: txnRef });
      if (ve && code === '00') {
        ve.trangThaiThanhToan = 'paid';
        ve.hinhThucThanhToan = 'vnpay';
        ve.ghiChuThanhToan = 'Thanh toán VNPay thành công';
        ve.vnp_TransactionNo = vnp_Params['vnp_TransactionNo'];
        ve.vnp_BankCode      = vnp_Params['vnp_BankCode'];
        ve.vnp_PayDate       = vnp_Params['vnp_PayDate'];
        await ve.save();
      }
    }

    const FE_URL = 'http://127.0.0.1:5500/frontend/src/pages/quanlyve.html';
    return res.redirect(`${FE_URL}?result=${code}&valid=${ok ? 1 : 0}`);
  } catch (e) {
    console.error(e);
    return res.redirect('http://127.0.0.1:5500/frontend/src/pages/quanlyve.html?result=99&valid=0');
  }
});



// IPN: remove hash rồi verify (đúng sample)
router.get('/vnpay_ipn', async (req, res) => {
  try {
    let vnp_Params = { ...req.query };
    const secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    const secretKey = (process.env.VNP_HASH_SECRET || '').trim();
    const signData = qs.stringify(vnp_Params, { encode: false });
    const signed = crypto.createHmac('sha512', secretKey)
      .update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash !== signed) {
      return res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
    }

    const orderId = vnp_Params['vnp_TxnRef'];
    const rspCode = vnp_Params['vnp_ResponseCode'];

    // TODO: kiểm tra amount/đơn hàng trong DB nếu cần
    const ve = await Ve.findOne({ maThanhToan: orderId });
    if (ve) {
      ve.trangThaiThanhToan = (rspCode === '00') ? 'paid' : 'failed';
      ve.vnp_TransactionNo = vnp_Params['vnp_TransactionNo'];
      ve.vnp_BankCode      = vnp_Params['vnp_BankCode'];
      ve.vnp_PayDate       = vnp_Params['vnp_PayDate'];
      await ve.save();
    }

    return res.status(200).json({ RspCode: '00', Message: 'Success' });
  } catch (e) {
    console.error(e);
    return res.status(200).json({ RspCode: '99', Message: 'Unknown error' });
  }
});

module.exports = router;
