const User = require('../models/userModel');

// ĐĂNG KÝ
exports.register = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Vui lòng nhập đủ thông tin' });
    const existed = await User.findOne({ email });
    if (existed) return res.status(400).json({ success: false, message: 'Email đã tồn tại' });
    const user = new User({ name, phone, email, password }); // Mặc định role: customer
    await user.save();
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ĐĂNG NHẬP
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'Email không tồn tại' });
    if (user.password !== password) return res.status(400).json({ success: false, message: 'Sai mật khẩu' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
