// controllers/statsController.js
const mongoose = require('mongoose');

async function routeStats(req, res) {
  try {
    const { from, to, granularity = 'month' } = req.query;

    const start = from ? new Date(from) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end   = to   ? new Date(to)   : new Date();
    end.setHours(23, 59, 59, 999);

    const dateFmt = granularity === 'week' ? '%G-%V' : '%Y-%m';

    const pipeline = [
      { $match: { trangThaiThanhToan: { $ne: 'canceled' }, ngayDat: { $gte: start, $lte: end } } },
      { $lookup: { from: 'chuyenxes', localField: 'chuyenXeId', foreignField: '_id', as: 'cx' } },
      { $unwind: '$cx' },
      { $lookup: { from: 'tuyenxes', localField: 'cx.tuyenXeId', foreignField: '_id', as: 'tuyen' } },
      { $unwind: '$tuyen' },
      { $lookup: { from: 'tinhthanhs', localField: 'tuyen.diemDiId', foreignField: '_id', as: 'ttDi' } },
      { $unwind: '$ttDi' },
      { $lookup: { from: 'tinhthanhs', localField: 'tuyen.diemDenId', foreignField: '_id', as: 'ttDen' } },
      { $unwind: '$ttDen' },
      {
        $addFields: {
          routeName: { $concat: ['$ttDi.tenTinh', ' → ', '$ttDen.tenTinh'] },
          bucket: { $dateToString: { format: dateFmt, date: '$ngayDat' } },
          seatCount: {
            $cond: [
              { $isArray: '$soGhe' }, { $size: '$soGhe' },
              { $cond: [ { $ifNull: ['$soGhe', false] }, 1, 0 ] }
            ]
          },
          amountSafe: { $ifNull: ['$giaVe', 0] }
        }
      },
      {
        $group: {
          _id: { route: '$routeName', bucket: '$bucket' },
          tickets: { $sum: 1 },
          seats: { $sum: '$seatCount' },
          revenue: { $sum: '$amountSafe' }
        }
      },
      { $project: { _id: 0, route: '$_id.route', bucket: '$_id.bucket', tickets: 1, seats: 1, revenue: 1 } },
      { $sort: { route: 1, bucket: 1 } }
    ];

    const result = await mongoose.connection.collection('ves').aggregate(pipeline).toArray();
    res.json({ success: true, data: result });
  } catch (e) {
    console.error('[routeStats] error:', e);
    res.status(500).json({ success: false, message: 'Stats error', error: String(e) });
  }
}

module.exports = { routeStats };
