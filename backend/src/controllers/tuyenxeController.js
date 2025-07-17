const TuyenXe = require('../models/tuyenxeModel');

exports.createTuyenXe = async (req, res) => {
  try {
    const { diemDiId, diemDenId, quangDuong, tgDiChuyen } = req.body;
    const tuyenxe = new TuyenXe({ diemDiId, diemDenId, quangDuong, tgDiChuyen });
    await tuyenxe.save();
    res.json({ success: true, data: tuyenxe });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAllTuyenXe = async (req, res) => {
  try {
    const list = await TuyenXe.find()
      .populate('diemDiId', 'tenTinh')
      .populate('diemDenId', 'tenTinh');
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


// Lấy tuyến xe theo ID
exports.getTuyenXeById = async (req, res) => {
  try {
    const tuyenxe = await TuyenXe.findById(req.params.id)
      .populate('diemDiId', 'tenTinh')
      .populate('diemDenId', 'tenTinh');
    if (!tuyenxe) return res.status(404).json({ success: false, message: 'Không tìm thấy tuyến xe' });
    res.json({ success: true, data: tuyenxe });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Cập nhật tuyến xe
exports.updateTuyenXe = async (req, res) => {
  try {
    const { diemDiId, diemDenId, quangDuong, tgDiChuyen } = req.body;
    const tuyenxe = await TuyenXe.findByIdAndUpdate(
      req.params.id,
      { diemDiId, diemDenId, quangDuong, tgDiChuyen },
      { new: true }
    );
    if (!tuyenxe) return res.status(404).json({ success: false, message: 'Không tìm thấy tuyến xe' });
    res.json({ success: true, data: tuyenxe });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Xóa tuyến xe
exports.deleteTuyenXe = async (req, res) => {
  try {
    const tuyenxe = await TuyenXe.findByIdAndDelete(req.params.id);
    if (!tuyenxe) return res.status(404).json({ success: false, message: 'Không tìm thấy tuyến xe' });
    res.json({ success: true, message: 'Đã xóa tuyến xe' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ...update, getById, delete (tương tự mẫu cũ, chỉ cần thêm trường diemDiId, diemDenId)
