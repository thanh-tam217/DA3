const mongoose = require('mongoose');

const chuyenXeSchema = new mongoose.Schema({
  xeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Xe', required: true },
  tuyenXeId: { type: mongoose.Schema.Types.ObjectId, ref: 'TuyenXe', required: true },
  benKhoiHanhId: { type: mongoose.Schema.Types.ObjectId, ref: 'BenXe', required: true },
  benDenId: { type: mongoose.Schema.Types.ObjectId, ref: 'BenXe', required: true },
  ngayXuatPhat: { type: Date, required: true },
  gioXuatPhat: { type: String, required: true },
  giaVe: { type: Number, required: true },
  taiXeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  trangThai: { type: String, default: 'Sẵn sàng' } // sapchay/dangchay/hoanthanh/huy
}, { timestamps: true });

module.exports = mongoose.model('ChuyenXe', chuyenXeSchema);
