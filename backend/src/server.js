require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const tinhThanhRoutes = require('./routes/tinhthanhRoutes');
const benXeRoutes = require('./routes/benxeRoutes');
const tuyenXeRoutes = require('./routes/tuyenxeRoutes');
const xeRoutes = require('./routes/xeRoutes');
const chuyenXeRoutes = require('./routes/chuyenxeRoutes');
const veRoutes = require('./routes/veRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const statsRoutes = require('./routes/statsRoutes');


// In fingerprint secret khi khởi động
console.log('[VNPAY secret len]', (process.env.VNP_HASH_SECRET || '').trim().length);
console.log('[VNPAY secret sha256]',
  require('crypto').createHash('sha256').update((process.env.VNP_HASH_SECRET || '').trim(),'utf8').digest('hex')
);

// Endpoint chẩn đoán nhanh
app.get('/__vnp_diag', (req, res) => {
  const tmnCode   = (process.env.VNP_TMN_CODE || '').trim();
  const secretKey = (process.env.VNP_HASH_SECRET || '').trim();
  const vnpUrl    = (process.env.VNP_URL || '').trim();
  const returnUrl = (process.env.VNP_RETURN_URL || '').trim();
  const sha256 = require('crypto').createHash('sha256').update(secretKey,'utf8').digest('hex');
  res.json({ tmnCode, vnpUrl, returnUrl, secretLen: secretKey.length, secretSha256: sha256 });
});


app.use('/api/payment', paymentRoutes);
app.use('/api/stats', statsRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/tinhthanh', tinhThanhRoutes);
app.use('/api/benxe', benXeRoutes);
app.use('/api/tuyenxe', tuyenXeRoutes);
app.use('/api/xe', xeRoutes);
app.use('/api/chuyenxe', chuyenXeRoutes);
app.use('/api/ve', veRoutes);
app.use('/api/user', userRoutes);

// server.js
app.set('trust proxy', true);

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Kết nối MongoDB thành công!'))
.catch((err) => console.error('Lỗi kết nối MongoDB:', err));

// Test API mẫu
app.get('/api/ping', (req, res) => {
  res.json({ message: 'API đang hoạt động!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
