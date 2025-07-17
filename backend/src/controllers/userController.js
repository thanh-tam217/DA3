const User = require('../models/userModel');

exports.createUser = async (req, res) => {
  try {
    const { name, phone, email, password, role, benXeId, position, licenseNumber } = req.body;
    const existed = await User.findOne({ email });
    if (existed) return res.status(400).json({ success: false, message: 'Email đã tồn tại' });
    const user = new User({ name, phone, email, password, role, benXeId, position, licenseNumber });
    await user.save();
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const list = await User.find().populate('benXeId', 'tenBen');
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('benXeId', 'tenBen');
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy user' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, phone, email, password, role, benXeId, position, licenseNumber } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, email, password, role, benXeId, position, licenseNumber },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy user' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy user' });
    res.json({ success: true, message: 'Đã xóa user' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
