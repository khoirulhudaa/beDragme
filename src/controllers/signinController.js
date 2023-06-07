const passport = require('passport');
const User = require('../models/User');

// Google auth
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Replace with your own client ID and secret
const GOOGLE_CLIENT_ID = '337965628676-3l4f1jg6v37irqph0a1v5toovpr8rkbj.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

// Configure Google OAuth strategy
passport.use(
  'google1',
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google1/signin/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // Here, you can create or authenticate the user in your database
      // For simplicity, we'll pass the profile data to the callback
      return done(null, profile);
    }
  )
);

// Callback function for successful authentication
const handleCallback = async (req, res) => {
  try {
    // Get user profile from Google
    const profile = req.user._json; 

    // Check if the user already exists
    let user = await User.findOne({ password: profile.sub });

    if (user) {
      res.status(200).json({message: 'Sukses login dengan google'});
    }else {
      res.status(404).json({message: 'Pengguna tidak ditemukan'});
    }
    
  } catch (err) {
    // Handle error
    console.log(err);
    res.status(404).json({message: 'Pengguna tidak ditemukan'});
  }
};

// Controller for Google sign-up
const signInWithGoogle = passport.authenticate('google1', { scope: ['profile', 'email'] });

module.exports = {
  handleCallback,
  signInWithGoogle
};