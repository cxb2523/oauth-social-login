const express = require('express');
const passport = require('../config/passport');
const { authenticate } = require('../middleware/auth');
const { generateAccessToken, generateRefreshToken, refreshAccessToken } = require('../utils/jwt');
const User = require('../models/User');

const router = express.Router();

router.get('/github', passport.authenticate('github'));

router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/api/auth/failure' }),
  (req, res) => {
    const accessToken = generateAccessToken(req.user);
    const refreshToken = generateRefreshToken(req.user);

    res.redirect(
      `${process.env.CLIENT_URL}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  }
);

router.get('/google', passport.authenticate('google'));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/api/auth/failure' }),
  (req, res) => {
    const accessToken = generateAccessToken(req.user);
    const refreshToken = generateRefreshToken(req.user);

    res.redirect(
      `${process.env.CLIENT_URL}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  }
);

router.get('/failure', (req, res) => {
  res.redirect(`${process.env.CLIENT_URL}/auth/callback?error=authentication_failed`);
});

router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: '未提供刷新令牌' });
    }

    const result = await refreshAccessToken(refreshToken, User);

    res.json({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

router.get('/me', authenticate, (req, res) => {
  res.json({
    id: req.user._id,
    provider: req.user.provider,
    username: req.user.username,
    displayName: req.user.displayName,
    email: req.user.email,
    avatar: req.user.avatar,
    bio: req.user.bio,
    location: req.user.location,
    website: req.user.website,
    createdAt: req.user.createdAt,
  });
});

router.put('/profile', authenticate, async (req, res) => {
  try {
    const { displayName, bio, location, website } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    if (displayName !== undefined) user.displayName = displayName;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (website !== undefined) user.website = website;

    await user.save();

    res.json({
      id: user._id,
      provider: user.provider,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      location: user.location,
      website: user.website,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: '更新资料失败' });
  }
});

module.exports = router;
