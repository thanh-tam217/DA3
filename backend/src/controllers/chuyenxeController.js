const ChuyenXe = require('../models/chuyenxeModel');
const TinhThanh = require('../models/tinhthanhModel');
const BenXe = require('../models/benxeModel');

exports.createChuyenXe = async (req, res) => {
  try {
    const {
      xeId, tuyenXeId, benKhoiHanhId, benDenId,
      ngayXuatPhat, gioXuatPhat, giaVe, taiXeId, trangThai
    } = req.body;
    const cx = new ChuyenXe({
      xeId, tuyenXeId, benKhoiHanhId, benDenId,
      ngayXuatPhat, gioXuatPhat, giaVe, taiXeId, trangThai
    });
    await cx.save();
    res.json({ success: true, data: cx });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAllChuyenXe = async (req, res) => {
  try {
    const list = await ChuyenXe.find()
      .populate('xeId', 'bienSo')
      .populate({
        path: 'tuyenXeId',
        populate: [
          { path: 'diemDiId', select: 'tenTinh' },
          { path: 'diemDenId', select: 'tenTinh' }
        ]
      })
      .populate('benKhoiHanhId', 'tenBen')
      .populate('benDenId', 'tenBen')
      .populate('taiXeId', 'name');
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


// exports.getChuyenXeById = async (req, res) => {
//   try {
//     const cx = await ChuyenXe.findById(req.params.id)
//       .populate('xeId', 'bienSo')
//       .populate('tuyenXeId')
//       .populate('benKhoiHanhId', 'tenBen')
//       .populate('benDenId', 'tenBen')
//       .populate('taiXeId', 'name');
//     if (!cx) return res.status(404).json({ success: false, message: 'Không tìm thấy chuyến xe' });
//     res.json({ success: true, data: cx });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };
// controllers/chuyenxeController.js



// exports.getChuyenXeById = async (req, res) => {
//   try {
//     const chuyenXe = await ChuyenXe.findById(req.params.id)
//       .populate('xeId'); // <-- thêm dòng này
      
//     if (!chuyenXe) return res.status(404).json({ success: false, message: "Không tìm thấy chuyến xe" });
//     res.json(chuyenXe);
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

exports.getChuyenXeById = async (req, res) => {
  try {
    const chuyenXe = await ChuyenXe.findById(req.params.id)
      .populate('xeId', 'bienSo loaiXe soGhe')
      .populate({
        path: 'tuyenXeId',
        populate: [
          { path: 'diemDiId', select: 'tenTinh' },
          { path: 'diemDenId', select: 'tenTinh' }
        ]
      })
      .populate('benKhoiHanhId', 'tenBen')
      .populate('benDenId', 'tenBen')
      .populate('taiXeId', 'name');
    if (!chuyenXe) return res.status(404).json({ success: false, message: "Không tìm thấy chuyến xe" });
    res.json({ success: true, data: chuyenXe });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};




exports.updateChuyenXe = async (req, res) => {
  try {
    const {
      xeId, tuyenXeId, benKhoiHanhId, benDenId,
      ngayXuatPhat, gioXuatPhat, giaVe, taiXeId, trangThai
    } = req.body;
    const cx = await ChuyenXe.findByIdAndUpdate(
      req.params.id,
      {
        xeId, tuyenXeId, benKhoiHanhId, benDenId,
        ngayXuatPhat, gioXuatPhat, giaVe, taiXeId, trangThai
      },
      { new: true }
    );
    if (!cx) return res.status(404).json({ success: false, message: 'Không tìm thấy chuyến xe' });
    res.json({ success: true, data: cx });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteChuyenXe = async (req, res) => {
  try {
    const cx = await ChuyenXe.findByIdAndDelete(req.params.id);
    if (!cx) return res.status(404).json({ success: false, message: 'Không tìm thấy chuyến xe' });
    res.json({ success: true, message: 'Đã xóa chuyến xe' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// controllers/chuyenxeController.js

exports.searchChuyenXe = async (req, res) => {
  try {
    const { diemDi, diemDen, ngayDi } = req.query;

    // 1. Tìm tỉnh thành đi & đến
    const tinhDi = await TinhThanh.findOne({ tenTinh: diemDi });
    const tinhDen = await TinhThanh.findOne({ tenTinh: diemDen });
    if (!tinhDi || !tinhDen) return res.json({ success: true, data: [] });

    // 2. Tìm các bến xe thuộc tỉnh đi & tỉnh đến
    const benDiList = await BenXe.find({ tinhThanhId: tinhDi._id });
    const benDenList = await BenXe.find({ tinhThanhId: tinhDen._id });

    const benDiIds = benDiList.map(bx => bx._id);
    const benDenIds = benDenList.map(bx => bx._id);

    // 3. Tìm chuyến xe
    const filter = {
      benKhoiHanhId: { $in: benDiIds },
      benDenId: { $in: benDenIds },
    };
    if (ngayDi) filter.ngayXuatPhat = ngayDi; // Nếu truyền ngày đi

    const chuyenxeList = await ChuyenXe.find(filter)
      .populate('benKhoiHanhId', 'tenBen')
      .populate('benDenId', 'tenBen')
      .populate('xeId', 'bienSo')
      .populate('taiXeId', 'hoTen');

    res.json({ success: true, data: chuyenxeList });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
