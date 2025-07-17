const BenXe = require('../models/benxeModel');

exports.createBenXe = async (req, res) => {
  try {
    const { tenBen, diaChi, sdt, tinhThanhId } = req.body;
    const benxe = new BenXe({ tenBen, diaChi, sdt, tinhThanhId });
    await benxe.save();
    res.json({ success: true, data: benxe });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAllBenXe = async (req, res) => {
  try {
    const list = await BenXe.find().populate('tinhThanhId', 'tenTinh');
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Lấy bến xe theo ID
exports.getBenXeById = async (req, res) => {
  try {
    const benxe = await BenXe.findById(req.params.id).populate('tinhThanhId', 'tenTinh');
    if (!benxe) return res.status(404).json({ success: false, message: 'Không tìm thấy bến xe' });
    res.json({ success: true, data: benxe });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Cập nhật bến xe
exports.updateBenXe = async (req, res) => {
  try {
    const { tenBen, diaChi, sdt, tinhThanhId } = req.body;
    const benxe = await BenXe.findByIdAndUpdate(
      req.params.id,
      { tenBen, diaChi, sdt, tinhThanhId },
      { new: true }
    );
    if (!benxe) return res.status(404).json({ success: false, message: 'Không tìm thấy bến xe' });
    res.json({ success: true, data: benxe });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Xoá bến xe
exports.deleteBenXe = async (req, res) => {
  try {
    const benxe = await BenXe.findByIdAndDelete(req.params.id);
    if (!benxe) return res.status(404).json({ success: false, message: 'Không tìm thấy bến xe' });
    res.json({ success: true, message: 'Đã xóa bến xe' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};