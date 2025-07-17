const Ve = require('../models/veModel');
const ChuyenXe = require('../models/chuyenxeModel');
const Xe = require('../models/xeModel');

exports.createVe = async (req, res) => {
  try {
    const { chuyenXeId, userId, soGhe, giaVe, trangThaiThanhToan, hinhThucThanhToan } = req.body;
    const ve = new Ve({
      chuyenXeId, userId, soGhe, giaVe, trangThaiThanhToan, hinhThucThanhToan
    });
    await ve.save();
    res.json({ success: true, data: ve });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAllVe = async (req, res) => {
  try {
    const list = await Ve.find()
      .populate('chuyenXeId')
      .populate('userId', 'name');
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// exports.getVeById = async (req, res) => {
//   try {
//     const ve = await Ve.findById(req.params.id)
//       .populate('chuyenXeId')
//       .populate('userId', 'name');
//     if (!ve) return res.status(404).json({ success: false, message: 'Không tìm thấy vé' });
//     res.json({ success: true, data: ve });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

exports.getVeById = async (req, res) => {
  try {
    const ve = await Ve.findById(req.params.id)
      .populate({
        path: 'chuyenXeId',
        populate: [
          { path: 'benKhoiHanhId', select: 'tenBen tinhThanhId', populate: { path: 'tinhThanhId', select: 'tenTinh' } },
          { path: 'benDenId', select: 'tenBen tinhThanhId', populate: { path: 'tinhThanhId', select: 'tenTinh' } },
          { path: 'xeId', select: 'bienSo loaiXe soGhe' }
        ]
      })
      .populate('userId', 'name phone');
    if (!ve) return res.status(404).json({ success: false, message: 'Không tìm thấy vé' });
    res.json({ success: true, data: ve });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


exports.updateVe = async (req, res) => {
  try {
    const { chuyenXeId, userId, soGhe, giaVe, trangThaiThanhToan, hinhThucThanhToan } = req.body;
    const ve = await Ve.findByIdAndUpdate(
      req.params.id,
      { chuyenXeId, userId, soGhe, giaVe, trangThaiThanhToan, hinhThucThanhToan },
      { new: true }
    );
    if (!ve) return res.status(404).json({ success: false, message: 'Không tìm thấy vé' });
    res.json({ success: true, data: ve });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteVe = async (req, res) => {
  try {
    const ve = await Ve.findByIdAndDelete(req.params.id);
    if (!ve) return res.status(404).json({ success: false, message: 'Không tìm thấy vé' });
    res.json({ success: true, message: 'Đã xóa vé' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// API: Lấy danh sách ghế đã đặt và tổng số ghế của chuyến xe
exports.getSeatStatus = async (req, res) => {
  try {
    const { chuyenXeId } = req.params;
    // Lấy chuyến xe
    const chuyenXe = await ChuyenXe.findById(chuyenXeId);
    if (!chuyenXe) return res.status(404).json({ success: false, message: "Không tìm thấy chuyến xe" });

    // Lấy xe tương ứng
    const xe = await Xe.findById(chuyenXe.xeId);
    if (!xe) return res.status(404).json({ success: false, message: "Không tìm thấy xe" });

    // Lấy danh sách số ghế đã đặt (và chưa bị huỷ)
    const veDaDat = await Ve.find({
      chuyenXeId,
      trangThaiThanhToan: { $ne: "canceled" }
    }, 'soGhe');

    const soGheDaDatArray = veDaDat.map(v => v.soGhe);

    res.json({
      success: true,
      tongSoGhe: xe.soGhe,
      gheDaDat: soGheDaDatArray,
      soGheConTrong: xe.soGhe - soGheDaDatArray.length
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


// Lấy tất cả vé đã đặt của một user (trừ vé đã huỷ)
exports.getVeByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const list = await Ve.find({
        userId,
        trangThaiThanhToan: { $ne: 'canceled' }
      })
      .populate({
        path: 'chuyenXeId',
        populate: [
          { path: 'benKhoiHanhId', populate: { path: 'tinhThanhId', select: 'tenTinh' } },
          { path: 'benDenId', populate: { path: 'tinhThanhId', select: 'tenTinh' } },
          { path: 'xeId' }
        ]
      })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
