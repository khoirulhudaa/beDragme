const express = require('express');
const router = express.Router();
const { handleCallback, signInWithGoogle } = require('../controllers/signinController');
const { handleCallbackSignup, signUpWithGoogle } = require('../controllers/signupController');
const passport = require('passport');

// Route for Google sign-in
router.get('/google1/signin', signInWithGoogle);

// Callback route for Google sign-in
router.get('/google1/signin/callback', passport.authenticate('google1'), handleCallback);

// Route for Google sign-up
router.get('/google2/signup', signUpWithGoogle);

// Callback route for Google sign-up
router.get('/google2/signup/callback', passport.authenticate('google2'), handleCallbackSignup);

module.exports = router;
