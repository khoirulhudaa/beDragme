const express = require('express');
const router = express.Router();
const { privacyPolicy, termsOfService } = require('../controllers/viewsController');

router.get('/privacyPolicy', privacyPolicy)

router.get('/termsOfService', termsOfService)

module.exports = router;