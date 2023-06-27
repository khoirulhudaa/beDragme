const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Mendapatkan daftar semua pengguna
router.get('/', userController.getAllUsers);

// Membuat pengguna baru
router.post('/signUp', userController.createUser);

// Membuat pengguna baru
router.post('/signIn', userController.loginUser);

// Mendapatkan data pengguna berdasarkan email
router.get('/:email', userController.getUserOne);

// Reset password
router.post('/forgotPassword', userController.forgotPassword);

// Confirm password
router.post('/updatePassword', userController.updatePassword);

// Add limitReact
router.post('/updateLimitReact:email', userController.updateLimitReact);

module.exports = router;
