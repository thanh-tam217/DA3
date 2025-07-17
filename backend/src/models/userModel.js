const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'staff', 'admin', 'superadmin', 'driver'], default: 'customer' },
  benXeId: { type: mongoose.Schema.Types.ObjectId, ref: 'BenXe', default: null },
  position: String,
  licenseNumber: String
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
