
// const mongoose = require('mongoose');

// const veSchema = new mongoose.Schema({
//   chuyenXeId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChuyenXe', required: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   // soGhe: { type: Number, required: true },
//   soGhe: [{ type: Number, required: true }],

//   ngayDat: { type: Date, default: Date.now },
//   giaVe: { type: Number, required: true },

//   trangThaiThanhToan: { 
//     type: String, 
//     enum: ['unpaid', 'paid', 'canceled', 'counter', 'pending', 'failed'], // thêm 'failed'
//     default: 'unpaid' 
//   },
//   hinhThucThanhToan: { type: String },

//   // Đối soát VNPay
//   maThanhToan: { type: String, index: true },
//   vnp_TransactionNo: String,
//   vnp_BankCode: String,
//   vnp_PayDate: String
// }, { timestamps: true });

// module.exports = mongoose.model('Ve', veSchema);

const mongoose = require('mongoose');

const veSchema = new mongoose.Schema({
  chuyenXeId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChuyenXe', required: true },
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // cho phép nhiều ghế trong cùng 1 vé
  soGhe: {
    type: [Number],
    required: true,
    validate: v => Array.isArray(v) && v.length > 0
  },

  ngayDat: { type: Date, default: Date.now },

  // LƯU TỔNG TIỀN của vé
  giaVe: { type: Number, required: true },

  trangThaiThanhToan: {
    type: String,
    enum: ['unpaid','paid','canceled','counter','pending','failed'],
    default: 'unpaid'
  },
  hinhThucThanhToan: { type: String },

  // VNPay đối soát
  maThanhToan: { type: String, index: true },
  vnp_TransactionNo: String,
  vnp_BankCode: String,
  vnp_PayDate: String
}, { timestamps: true });

module.exports = mongoose.model('Ve', veSchema);
