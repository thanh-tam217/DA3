const mongoose = require('mongoose');

const tuyenXeSchema = new mongoose.Schema({
  diemDiId: { type: mongoose.Schema.Types.ObjectId, ref: 'TinhThanh', required: true },
  diemDenId: { type: mongoose.Schema.Types.ObjectId, ref: 'TinhThanh', required: true },
  quangDuong: { type: Number },
  tgDiChuyen: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('TuyenXe', tuyenXeSchema);
