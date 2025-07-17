const mongoose = require('mongoose');

const veSchema = new mongoose.Schema({
  chuyenXeId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChuyenXe', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // soGhe: [{ type: Number, required: true }],
  soGhe: { type: Number, required: true },
  ngayDat: { type: Date, default: Date.now },
  giaVe: { type: Number, required: true },
  trangThaiThanhToan: { type: String, enum: ['unpaid', 'paid', 'canceled'], default: 'unpaid' },
  hinhThucThanhToan: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Ve', veSchema);
