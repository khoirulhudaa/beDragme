const express = require('express');
const router = express.Router();
const { handleTransactionStatus, callback, pay } = require('../controllers/paymentController');

router.post('/handleTransactionStatus', handleTransactionStatus);
router.post('/callback', callback);
router.post('/', pay);

module.exports = router;