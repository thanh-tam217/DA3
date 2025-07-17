const express = require('express');
const router = express.Router();
const veCtrl = require('../controllers/veController');

router.post('/', veCtrl.createVe);
router.get('/', veCtrl.getAllVe);
router.get('/:id', veCtrl.getVeById);
router.put('/:id', veCtrl.updateVe);
router.delete('/:id', veCtrl.deleteVe);
router.get('/seat-status/:chuyenXeId', veCtrl.getSeatStatus);
router.get('/by-user/:userId', veCtrl.getVeByUser);


module.exports = router;
