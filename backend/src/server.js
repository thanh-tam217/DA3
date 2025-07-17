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


app.use('/api/auth', authRoutes);
app.use('/api/tinhthanh', tinhThanhRoutes);
app.use('/api/benxe', benXeRoutes);
app.use('/api/tuyenxe', tuyenXeRoutes);
app.use('/api/xe', xeRoutes);
app.use('/api/chuyenxe', chuyenXeRoutes);
app.use('/api/ve', veRoutes);
app.use('/api/user', userRoutes);


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
