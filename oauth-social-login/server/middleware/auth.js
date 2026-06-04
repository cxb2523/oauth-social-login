const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '未提供认证令牌' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: '无效或已过期的令牌' });
    }

    const user = await User.findById(decoded.id).select('-accessToken -refreshToken');
    if (!user) {
      return res.status(401).json({ message: '用户不存在' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: '认证失败' });
  }
};

module.exports = { authenticate };
