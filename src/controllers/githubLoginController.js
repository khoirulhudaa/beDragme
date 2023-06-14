const passport = require('passport');
const UserGithub = require('../models/UserGithub');
const GitHubStrategy = require('passport-github2').Strategy;

passport.use(
  new GitHubStrategy(
    {
      clientID: '3a1031ce7836eb0d491d',
      clientSecret: '7d1617c3fcc94a2f137360820fd4e51c9ab4a13b',
      callbackURL: 'https://api-dragme.vercel.app/git/auth/login/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      const { username, emails } = profile;
      const user = {
        username: username,
        email: emails[0].value
      };
      done(null, user);
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
  console.log(res.user);
  UserGithub.findOne({ email: req.user.email }, (err, user) => {
    if (err) {
      return res.json({ message: 'Internal server error', status: 500 });
    } else if (!user) {
      const newUser = new UserGithub({
        username: req.user.username,
        email: req.user.email
      });

      newUser.save((err) => {
        if (err) {
          return res.json({ message: 'Error creating user', status: 500 });
        }
        return res.json({ message: 'Login successful', status: 201 });
      });
    } else {
      return res.json({ message: 'Login successful', status: 201 });
    }
  });
};
