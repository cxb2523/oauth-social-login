const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      provider: user.provider,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d' }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const refreshAccessToken = async (refreshToken, User) => {
  const decoded = verifyToken(refreshToken);
  if (!decoded) {
    throw new Error('Invalid refresh token');
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new Error('User not found');
  }

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user,
  };
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  refreshAccessToken,
};
