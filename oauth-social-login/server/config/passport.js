const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          provider: 'github',
          providerId: profile.id,
        });

        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';

        if (!user) {
          user = new User({
            provider: 'github',
            providerId: profile.id,
            username: profile.username,
            displayName: profile.displayName || profile.username,
            email: email,
            avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
            bio: profile._json.bio || '',
            location: profile._json.location || '',
            website: profile._json.blog || '',
            accessToken,
            refreshToken,
          });
          await user.save();
        } else {
          user.accessToken = accessToken;
          if (refreshToken) user.refreshToken = refreshToken;
          await user.save();
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          provider: 'google',
          providerId: profile.id,
        });

        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';

        if (!user) {
          user = new User({
            provider: 'google',
            providerId: profile.id,
            username: profile.displayName.replace(/\s/g, '').toLowerCase(),
            displayName: profile.displayName,
            email: email,
            avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
            accessToken,
            refreshToken,
          });
          await user.save();
        } else {
          user.accessToken = accessToken;
          if (refreshToken) user.refreshToken = refreshToken;
          await user.save();
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

module.exports = passport;
