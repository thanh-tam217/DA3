const express = require('express');
const router = express.Router();
const benXeCtrl = require('../controllers/benxeController');

router.post('/', benXeCtrl.createBenXe);
router.get('/', benXeCtrl.getAllBenXe);
router.get('/:id', benXeCtrl.getBenXeById);
router.put('/:id', benXeCtrl.updateBenXe);
router.delete('/:id', benXeCtrl.deleteBenXe);

module.exports = router;
