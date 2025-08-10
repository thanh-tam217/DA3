const express = require('express');
const router = express.Router();
const { routeStats } = require('../controllers/statsController');

// khớp với URL frontend đang gọi
router.get('/route-sales', routeStats);

// (tuỳ chọn) thêm alias cũ
router.get('/routes', routeStats);

module.exports = router;


