const Xe = require('../models/xeModel');

exports.createXe = async (req, res) => {
  try {
    const { bienSo, loaiXe, soGhe, trangThai, benXeId } = req.body;
    const xe = new Xe({ bienSo, loaiXe, soGhe, trangThai, benXeId });
    await xe.save();
    res.json({ success: true, data: xe });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAllXe = async (req, res) => {
  try {
    const list = await Xe.find().populate('benXeId', 'tenBen');
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getXeById = async (req, res) => {
  try {
    const xe = await Xe.findById(req.params.id).populate('benXeId', 'tenBen');
    if (!xe) return res.status(404).json({ success: false, message: 'Không tìm thấy xe' });
    res.json({ success: true, data: xe });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateXe = async (req, res) => {
  try {
    const { bienSo, loaiXe, soGhe, trangThai, benXeId } = req.body;
    const xe = await Xe.findByIdAndUpdate(
      req.params.id,
      { bienSo, loaiXe, soGhe, trangThai, benXeId },
      { new: true }
    );
    if (!xe) return res.status(404).json({ success: false, message: 'Không tìm thấy xe' });
    res.json({ success: true, data: xe });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteXe = async (req, res) => {
  try {
    const xe = await Xe.findByIdAndDelete(req.params.id);
    if (!xe) return res.status(404).json({ success: false, message: 'Không tìm thấy xe' });
    res.json({ success: true, message: 'Đã xóa xe' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
