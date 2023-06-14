const express = require('express');
const router = express.Router();
const githubLoginController = require('../controllers/githubLoginController')
const registerLoginController = require('../controllers/githubRegisterController')

// Login dengan GitHub
router.get('/login/github', githubLoginController.loginWithGithub);
router.get('/auth/login/callback', githubLoginController.loginWithGithubCallback);

// Register dengan GitHub
router.get('/register/github', registerLoginController.registerWithGithub);
router.get('/auth/register/callback', registerLoginController.registerWithGithubCallback);

module.exports = router;