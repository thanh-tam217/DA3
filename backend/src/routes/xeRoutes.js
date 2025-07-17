const express = require('express');
const router = express.Router();
const xeCtrl = require('../controllers/xeController');

router.post('/', xeCtrl.createXe);
router.get('/', xeCtrl.getAllXe);
router.get('/:id', xeCtrl.getXeById);
router.put('/:id', xeCtrl.updateXe);
router.delete('/:id', xeCtrl.deleteXe);

module.exports = router;
