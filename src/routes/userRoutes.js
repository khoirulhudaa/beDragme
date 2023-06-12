const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Mendapatkan daftar semua pengguna
router.get('/', userController.getAllUsers);

// Membuat pengguna baru
router.post('/signUp', userController.createUser);

// Membuat pengguna baru
router.post('/signIn', userController.loginUser);

module.exports = router;
