const express = require('express');
const router = express.Router();
const { callback, pay, cancelOrder } = require('../controllers/paymentController');

router.post('/callback', callback);
router.post('/', pay);
router.get('/cancel/order/:order_id', cancelOrder);

module.exports = router;