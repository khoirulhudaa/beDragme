const express = require('express');
const router = express.Router();
const { callback, pay } = require('../controllers/paymentController');

router.post('/callback', callback);
router.post('/', pay);

module.exports = router;