// const Ve = require('../models/veModel');
// const ChuyenXe = require('../models/chuyenxeModel');
// const Xe = require('../models/xeModel');

// exports.createVe = async (req, res) => {
//   try {
//     const { chuyenXeId, userId, soGhe, giaVe, trangThaiThanhToan, hinhThucThanhToan } = req.body;
//     const ve = new Ve({
//       chuyenXeId, userId, soGhe, giaVe, trangThaiThanhToan, hinhThucThanhToan
//     });
//     await ve.save();
//     res.json({ success: true, data: ve });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// exports.getAllVe = async (req, res) => {
//   try {
//     const list = await Ve.find()
//       .populate('chuyenXeId')
//       .populate('userId', 'name');
//     res.json({ success: true, data: list });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// // exports.getVeById = async (req, res) => {
// //   try {
// //     const ve = await Ve.findById(req.params.id)
// //       .populate('chuyenXeId')
// //       .populate('userId', 'name');
// //     if (!ve) return res.status(404).json({ success: false, message: 'Không tìm thấy vé' });
// //     res.json({ success: true, data: ve });
// //   } catch (err) {
// //     res.status(500).json({ success: false, error: err.message });
// //   }
// // };

// exports.getVeById = async (req, res) => {
//   try {
//     const ve = await Ve.findById(req.params.id)
//       .populate({
//         path: 'chuyenXeId',
//         populate: [
//           { path: 'benKhoiHanhId', select: 'tenBen tinhThanhId', populate: { path: 'tinhThanhId', select: 'tenTinh' } },
//           { path: 'benDenId', select: 'tenBen tinhThanhId', populate: { path: 'tinhThanhId', select: 'tenTinh' } },
//           { path: 'xeId', select: 'bienSo loaiXe soGhe' }
//         ]
//       })
//       .populate('userId', 'name phone');
//     if (!ve) return res.status(404).json({ success: false, message: 'Không tìm thấy vé' });
//     res.json({ success: true, data: ve });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };


// exports.updateVe = async (req, res) => {
//   try {
//     const { chuyenXeId, userId, soGhe, giaVe, trangThaiThanhToan, hinhThucThanhToan } = req.body;
//     const ve = await Ve.findByIdAndUpdate(
//       req.params.id,
//       { chuyenXeId, userId, soGhe, giaVe, trangThaiThanhToan, hinhThucThanhToan },
//       { new: true }
//     );
//     if (!ve) return res.status(404).json({ success: false, message: 'Không tìm thấy vé' });
//     res.json({ success: true, data: ve });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// exports.deleteVe = async (req, res) => {
//   try {
//     const ve = await Ve.findByIdAndDelete(req.params.id);
//     if (!ve) return res.status(404).json({ success: false, message: 'Không tìm thấy vé' });
//     res.json({ success: true, message: 'Đã xóa vé' });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// // API: Lấy danh sách ghế đã đặt và tổng số ghế của chuyến xe
// exports.getSeatStatus = async (req, res) => {
//   try {
//     const { chuyenXeId } = req.params;
//     // Lấy chuyến xe
//     const chuyenXe = await ChuyenXe.findById(chuyenXeId);
//     if (!chuyenXe) return res.status(404).json({ success: false, message: "Không tìm thấy chuyến xe" });

//     // Lấy xe tương ứng
//     const xe = await Xe.findById(chuyenXe.xeId);
//     if (!xe) return res.status(404).json({ success: false, message: "Không tìm thấy xe" });

//     // Lấy danh sách số ghế đã đặt (và chưa bị huỷ)
//     const veDaDat = await Ve.find({
//       chuyenXeId,
//       trangThaiThanhToan: { $ne: "canceled" }
//     }, 'soGhe');

//     const soGheDaDatArray = veDaDat.map(v => v.soGhe);

//     res.json({
//       success: true,
//       tongSoGhe: xe.soGhe,
//       gheDaDat: soGheDaDatArray,
//       soGheConTrong: xe.soGhe - soGheDaDatArray.length
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };


// // Lấy tất cả vé đã đặt của một user (trừ vé đã huỷ)
// exports.getVeByUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const list = await Ve.find({
//         userId,
//         trangThaiThanhToan: { $ne: 'canceled' }
//       })
//       .populate({
//         path: 'chuyenXeId',
//         populate: [
//           { path: 'benKhoiHanhId', populate: { path: 'tinhThanhId', select: 'tenTinh' } },
//           { path: 'benDenId', populate: { path: 'tinhThanhId', select: 'tenTinh' } },
//           { path: 'xeId' }
//         ]
//       })
//       .sort({ createdAt: -1 });
//     res.json({ success: true, data: list });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

const Ve = require('../models/veModel');
const ChuyenXe = require('../models/chuyenxeModel');
const Xe = require('../models/xeModel');

// Helper: chuẩn hoá ghế về mảng số & bỏ trùng
function normalizeSeats(input) {
  const arr = Array.isArray(input) ? input : [input];
  return [...new Set(arr.map(n => Number(n)).filter(n => Number.isInteger(n) && n > 0))];
}

exports.createVe = async (req, res) => {
  try {
    const { chuyenXeId, userId, soGhe, giaVe, trangThaiThanhToan, hinhThucThanhToan } = req.body;

    // soGhe as array
    const seats = normalizeSeats(soGhe);
    if (seats.length === 0) {
      return res.status(400).json({ success:false, message:'Thiếu danh sách ghế hợp lệ' });
    }

    // giaVe trong body đang là ĐƠN GIÁ 1 GHẾ => tính tổng
    const unitPrice = Number(giaVe || 0);
    if (!unitPrice) return res.status(400).json({ success:false, message:'Thiếu đơn giá' });
    const totalPrice = unitPrice * seats.length;

    const ve = new Ve({
      chuyenXeId, userId,
      soGhe: seats,
      giaVe: totalPrice,
      trangThaiThanhToan,
      hinhThucThanhToan
    });
    await ve.save();

    res.json({ success:true, data: ve });
  } catch (err) {
    res.status(500).json({ success:false, error: err.message });
  }
};

exports.getAllVe = async (req, res) => {
  try {
    const list = await Ve.find()
      .populate('chuyenXeId')
      .populate('userId','name');
    res.json({ success:true, data:list });
  } catch (err) {
    res.status(500).json({ success:false, error: err.message });
  }
};

exports.getVeById = async (req, res) => {
  try {
    const ve = await Ve.findById(req.params.id)
      .populate({
        path: 'chuyenXeId',
        populate: [
          { path: 'benKhoiHanhId', select:'tenBen tinhThanhId', populate:{ path:'tinhThanhId', select:'tenTinh' } },
          { path: 'benDenId',      select:'tenBen tinhThanhId', populate:{ path:'tinhThanhId', select:'tenTinh' } },
          { path: 'xeId',          select:'bienSo loaiXe soGhe' }
        ]
      })
      .populate('userId','name phone');
    if (!ve) return res.status(404).json({ success:false, message:'Không tìm thấy vé' });
    res.json({ success:true, data: ve });
  } catch (err) {
    res.status(500).json({ success:false, error: err.message });
  }
};

exports.updateVe = async (req, res) => {
  try {
    let { chuyenXeId, userId, soGhe, giaVe, trangThaiThanhToan, hinhThucThanhToan } = req.body;

    const update = {};
    if (chuyenXeId) update.chuyenXeId = chuyenXeId;
    if (userId)     update.userId     = userId;

    if (typeof soGhe !== 'undefined') {
      const seats = normalizeSeats(soGhe);
      if (seats.length === 0) {
        return res.status(400).json({ success:false, message:'Danh sách ghế không hợp lệ' });
      }
      update.soGhe = seats;
      // Nếu client gửi giaVe là ĐƠN GIÁ → tính lại tổng; nếu không gửi thì giữ nguyên tổng cũ
      if (typeof giaVe !== 'undefined') {
        const unitPrice = Number(giaVe || 0);
        if (!unitPrice) return res.status(400).json({ success:false, message:'Đơn giá không hợp lệ' });
        update.giaVe = unitPrice * seats.length;
      }
    } else if (typeof giaVe !== 'undefined') {
      // Không đổi số ghế, nhưng nếu client gửi TỔNG TIỀN mới
      update.giaVe = Number(giaVe);
    }

    if (typeof trangThaiThanhToan !== 'undefined') update.trangThaiThanhToan = trangThaiThanhToan;
    if (typeof hinhThucThanhToan !== 'undefined')  update.hinhThucThanhToan  = hinhThucThanhToan;

    const ve = await Ve.findByIdAndUpdate(req.params.id, update, { new:true });
    if (!ve) return res.status(404).json({ success:false, message:'Không tìm thấy vé' });

    res.json({ success:true, data: ve });
  } catch (err) {
    res.status(500).json({ success:false, error: err.message });
  }
};

exports.deleteVe = async (req, res) => {
  try {
    const ve = await Ve.findByIdAndDelete(req.params.id);
    if (!ve) return res.status(404).json({ success:false, message:'Không tìm thấy vé' });
    res.json({ success:true, message:'Đã xóa vé' });
  } catch (err) {
    res.status(500).json({ success:false, error: err.message });
  }
};

// Lấy trạng thái ghế của chuyến xe
exports.getSeatStatus = async (req, res) => {
  try {
    const { chuyenXeId } = req.params;

    const chuyenXe = await ChuyenXe.findById(chuyenXeId);
    if (!chuyenXe) return res.status(404).json({ success:false, message:'Không tìm thấy chuyến xe' });

    const xe = await Xe.findById(chuyenXe.xeId);
    if (!xe) return res.status(404).json({ success:false, message:'Không tìm thấy xe' });

    const veDaDat = await Ve.find(
      { chuyenXeId, trangThaiThanhToan: { $ne:'canceled' } },
      'soGhe'
    );

    // Flatten mảng ghế
    const gheDaDat = [];
    veDaDat.forEach(v => {
      const arr = Array.isArray(v.soGhe) ? v.soGhe : [v.soGhe];
      arr.forEach(n => gheDaDat.push(n));
    });

    res.json({
      success: true,
      tongSoGhe: xe.soGhe,
      gheDaDat,
      soGheConTrong: xe.soGhe - gheDaDat.length
    });
  } catch (err) {
    res.status(500).json({ success:false, error: err.message });
  }
};

exports.getVeByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const list = await Ve.find({
      userId,
      trangThaiThanhToan: { $ne:'canceled' }
    })
    .populate({
      path: 'chuyenXeId',
      populate: [
        { path:'benKhoiHanhId', populate:{ path:'tinhThanhId', select:'tenTinh' } },
        { path:'benDenId',      populate:{ path:'tinhThanhId', select:'tenTinh' } },
        { path:'xeId' }
      ]
    })
    .sort({ createdAt:-1 });

    res.json({ success:true, data:list });
  } catch (err) {
    res.status(500).json({ success:false, error: err.message });
  }
};
