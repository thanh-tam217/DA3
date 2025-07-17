const express = require('express');
const router = express.Router();
const tinhThanhCtrl = require('../controllers/tinhthanhController');


router.post('/', tinhThanhCtrl.createTinhThanh);
router.get('/', tinhThanhCtrl.getAllTinhThanh);
router.delete('/:id', tinhThanhCtrl.deleteTinhThanh);

module.exports = router;

