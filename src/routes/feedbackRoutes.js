const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Mendapatkan daftar semua pengguna
router.get('/', feedbackController.getFeedback);

// Membuat pengguna baru
router.post('/create', feedbackController.createFeedback);

module.exports = router;
    