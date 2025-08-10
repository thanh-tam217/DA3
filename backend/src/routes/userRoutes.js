const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');

router.post('/', userCtrl.createUser);
router.get('/', userCtrl.getAllUser);
router.get('/:id', userCtrl.getUserById);
router.put('/:id', userCtrl.updateUser);
router.delete('/:id', userCtrl.deleteUser);
// NHÂN VIÊN (list/create ép role)
router.get('/staff', userCtrl.listStaff);
router.post('/staff', userCtrl.createStaff);

module.exports = router;
