const express = require('express');
const router = express.Router();
const tuyenXeCtrl = require('../controllers/tuyenxeController');

router.post('/', tuyenXeCtrl.createTuyenXe);
router.get('/', tuyenXeCtrl.getAllTuyenXe);
router.get('/:id', tuyenXeCtrl.getTuyenXeById);
router.put('/:id', tuyenXeCtrl.updateTuyenXe);
router.delete('/:id', tuyenXeCtrl.deleteTuyenXe);

module.exports = router;
