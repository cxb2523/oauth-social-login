const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  provider: {
    type: String,
    required: true,
    enum: ['github', 'google'],
  },
  providerId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  displayName: String,
  email: {
    type: String,
    required: true,
  },
  avatar: String,
  bio: String,
  location: String,
  website: String,
  accessToken: String,
  refreshToken: String,
  tokenExpiresAt: Date,
}, {
  timestamps: true,
});

userSchema.index({ provider: 1, providerId: 1 }, { unique: true });
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
