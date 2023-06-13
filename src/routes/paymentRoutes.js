const express = require('express');
const router = express.Router();
const { callback, pay, cancelOrder } = require('../controllers/paymentController');

router.post('/callback', callback);
router.post('/', pay);
router.post('/cancel/order', cancelOrder);

module.exports = router;