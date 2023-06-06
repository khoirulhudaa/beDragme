const passport = require('passport');
const User = require('../models/User');

// Google auth
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Replace with your own client ID and secret
const GOOGLE_CLIENT_ID = '642067740354-kj485jcofbkas0kctabggtj2l5hpds6i.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

// Configure Google OAuth strategy
passport.use(
  'google2',
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google2/signup/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // Here, you can create or authenticate the user in your database
      // For simplicity, we'll pass the profile data to the callback
      return done(null, profile);
    }
  )
);

// Callback function for successful authentication
const handleCallbackSignup = async (req, res) => {
  try {
    // Get user profile from Google
    const profile = req.user._json; 

    // Check if the user already exists
    let user = await User.findOne({ password: profile.sub });

    if (!user) {
      // Create a new user
      user = new User({
        username: profile.name,
        email: profile.email,
        password: profile.sub,
      }); 

      await user.save();
    }else {
      res.status(403).json({message: 'Pengguna sudah terdaftar'});
    }

    // Redirect to the home page or any other page after successful sign-up
    res.status(200).json({message: 'success daftar with google'});
  } catch (err) {
    // Handle error
    console.log(err);
    res.status(404).json({message: 'gagal daftar with google'});
  }
};

// Controller for Google sign-up
const signUpWithGoogle = passport.authenticate('google2', { scope: ['profile', 'email'] });

module.exports = {
  handleCallbackSignup,
  signUpWithGoogle
};