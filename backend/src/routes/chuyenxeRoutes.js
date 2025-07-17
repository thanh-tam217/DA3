const express = require('express');
const router = express.Router();
const chuyenXeCtrl = require('../controllers/chuyenxeController');


router.get('/search', chuyenXeCtrl.searchChuyenXe);
// Các route khác phía dưới:
router.get('/:id', chuyenXeCtrl.getChuyenXeById);


router.post('/', chuyenXeCtrl.createChuyenXe);
router.get('/', chuyenXeCtrl.getAllChuyenXe);
router.get('/:id', chuyenXeCtrl.getChuyenXeById);
router.put('/:id', chuyenXeCtrl.updateChuyenXe);
router.delete('/:id', chuyenXeCtrl.deleteChuyenXe);


module.exports = router;
