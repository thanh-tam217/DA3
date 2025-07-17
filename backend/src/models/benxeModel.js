const mongoose = require('mongoose');

const benXeSchema = new mongoose.Schema({
  tenBen: { type: String, required: true },
  diaChi: { type: String, required: true },
  sdt: { type: String },
  tinhThanhId: { type: mongoose.Schema.Types.ObjectId, ref: 'TinhThanh', required: true }
}, { timestamps: true });

module.exports = mongoose.model('BenXe', benXeSchema);
