const TinhThanh = require('../models/tinhthanhModel');

exports.createTinhThanh = async (req, res) => {
  try {
    const { tenTinh } = req.body;
    const existed = await TinhThanh.findOne({ tenTinh });
    if (existed) return res.status(400).json({ success: false, message: 'Tên tỉnh đã tồn tại' });
    const tt = new TinhThanh({ tenTinh });
    await tt.save();
    res.json({ success: true, data: tt });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAllTinhThanh = async (req, res) => {
  try {
    const list = await TinhThanh.find();
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteTinhThanh = async (req, res) => {
  try {
    const tt = await TinhThanh.findByIdAndDelete(req.params.id);
    if (!tt) return res.status(404).json({ success: false, message: 'Không tìm thấy tỉnh thành' });
    res.json({ success: true, message: 'Đã xóa tỉnh thành' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};