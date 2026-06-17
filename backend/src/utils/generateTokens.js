const jwt = require('jsonwebtoken');
const env = require('../config/env');
const RefreshToken = require('../models/RefreshToken.model');

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const accessToken = jwt.sign(
      { _id: userId },
      env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { _id: userId },
      env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Save refresh token to database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await RefreshToken.create({
      user: userId,
      token: refreshToken,
      expiresAt,
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};

module.exports = generateAccessAndRefreshTokens;
