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


// Cho phép lọc ?role=customer|staff|admin|driver
exports.getAllUser = async (req, res) => {
  try {
    const { role, q } = req.query;
    const cond = {};
    if (role) cond.role = role;
    if (q) cond.$or = [
      { name: new RegExp(q, 'i') },
      { email: new RegExp(q, 'i') },
      { phone: new RegExp(q, 'i') },
    ];
    const list = await User.find(cond).populate('benXeId', 'tenBen');
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Tạo user (hash password nếu có)
exports.createUser = async (req, res) => {
  try {
    const { name, phone, email, password, role, benXeId, position, licenseNumber } = req.body;
    const existed = await User.findOne({ email });
    if (existed) return res.status(400).json({ success: false, message: 'Email đã tồn tại' });

    const hashed = password ? await bcrypt.hash(password, 10) : undefined;
    const user = new User({
      name, phone, email, password: hashed, role, benXeId, position, licenseNumber
    });
    await user.save();
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Chỉ liệt kê nhân viên/ tài xế
exports.listStaff = async (req, res) => {
  try {
    const { q } = req.query;
    const cond = { role: { $in: ['staff', 'driver'] } };
    if (q) cond.$or = [
      { name: new RegExp(q, 'i') },
      { email: new RegExp(q, 'i') },
      { phone: new RegExp(q, 'i') },
    ];
    const list = await User.find(cond).populate('benXeId', 'tenBen');
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Tạo nhân viên (ép role = 'staff' nếu không truyền)
exports.createStaff = async (req, res) => {
  try {
    const { name, phone, email, password, benXeId, position, licenseNumber, role } = req.body;
    const existed = await User.findOne({ email });
    if (existed) return res.status(400).json({ success: false, message: 'Email đã tồn tại' });

    const hashed = password ? await bcrypt.hash(password, 10) : undefined;
    const user = new User({
      name, phone, email, password: hashed, role: role || 'staff', benXeId, position, licenseNumber
    });
    await user.save();
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Hash pass khi update nếu có gửi kèm
exports.updateUser = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const update = { ...rest };
    if (password) update.password = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'Không tìm thấy user' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};