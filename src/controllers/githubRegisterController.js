const passport = require('passport');
const UserGithub = require('../models/UserGithub');

const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

passport.use(
  new GitHubStrategy(
    {
      clientID: 'c9e48870affa4902708b',
      clientSecret: '6346d1641b21047d8a450d140e58ec68ac9ecf94',
      callbackURL: 'https://api-dragme.vercel.app/git/auth/register/callback',
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


// Register dengan GitHub
exports.registerWithGithub = passport.authenticate('github', { scope: ['user:email'] });

// Callback setelah register dengan GitHub berhasil
exports.registerWithGithubCallback = (req, res) => {
  // Tambahkan logika pembuatan pengguna baru di sini
  UserGithub.findOne({ email: req.user.email }, (err, user) => {
    if (err) {
      return res.json({ message: 'Internal server error', status: 500 });
    } else if (user) {
      return res.json({ message: 'User already exists', status: 409 });
    } else {
      const newUser = new User({
        username: req.user.username,
        email: req.user.email,
        // tambahkan properti lain yang dibutuhkan
      });

      newUser.save((err) => {
        if (err) {
          return res.json({ message: 'Internal server error', status: 500 });
        } else {
          // Register berhasil
          return res.json({ message: 'Register successful', status: 201 });
        }
      });
    }
  });
};