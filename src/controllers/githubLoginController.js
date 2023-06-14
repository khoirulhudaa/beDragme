const passport = require('passport');
const UserGithub = require('../models/UserGithub');

const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

passport.use(
  new GitHubStrategy(
    {
      clientID: '3a1031ce7836eb0d491d',
      clientSecret: 'aea8606cd60703e71a660307c80d012aa3b20cc8',
      callbackURL: 'https://api-dragme.vercel.app/git/auth/login/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      // Callback setelah autentikasi dengan GitHub berhasil
      // Lakukan proses autentikasi atau registrasi tambahan yang diperlukan
      const { username, emails } = profile;

      const user = {
        username: username,
        email: emails[0].value,
        // tambahkan properti lain yang dibutuhkan
      };

      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});


// Login dengan GitHub
exports.loginWithGithub = passport.authenticate('github');

// Callback setelah login dengan GitHub berhasil
exports.loginWithGithubCallback = (req, res) => {
  // Tambahkan logika pengecekan pengguna di sini
  UserGithub.findOne({ email: req.user.email }, (err, user) => {
    if (err) {
      return res.json({ message: 'Internal server error', status: 500 });
    } else if (!user) {
      return res.json({ message: 'User not found', status: 404 });
    } else {
      // Login berhasil
      return res.json({ message: 'Login successful', status: 201 });
    }
  });
};