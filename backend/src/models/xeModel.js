const mongoose = require('mongoose');

const xeSchema = new mongoose.Schema({
  bienSo: { type: String, required: true, unique: true },
  loaiXe: { type: String, required: true },
  soGhe: { type: Number, required: true },
  trangThai: { type: String, default: 'Đang hoạt động' }, // hoatdong/nghi
  benXeId: { type: mongoose.Schema.Types.ObjectId, ref: 'BenXe', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Xe', xeSchema);

