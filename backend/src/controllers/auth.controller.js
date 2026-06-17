const User = require('../models/User.model');
const RefreshToken = require('../models/RefreshToken.model');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const generateAccessAndRefreshTokens = require('../utils/generateTokens');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { sendOtpEmail } = require('../utils/emailService');

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    if (existedUser.isVerified) {
      throw new ApiError(409, "User with email already exists");
    } else {
      const otpCode = generateOtp();
      existedUser.name = name;
      existedUser.password = password; // pre-save hashes it
      existedUser.otpCode = otpCode;
      existedUser.otpExpiresAt = Date.now() + 10 * 60 * 1000;
      await existedUser.save();
      await sendOtpEmail(email, otpCode);
      return res.status(200).json(
        new ApiResponse(200, { email }, "Verification OTP sent to email")
      );
    }
  }

  const otpCode = generateOtp();
  const otpExpiresAt = Date.now() + 10 * 60 * 1000;

  await User.create({
    name,
    email,
    password,
    isVerified: false,
    otpCode,
    otpExpiresAt,
  });

  await sendOtpEmail(email, otpCode);

  return res.status(200).json(
    new ApiResponse(200, { email }, "Verification OTP sent to email. Please verify to complete signup.")
  );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const otpCode = generateOtp();
  user.otpCode = otpCode;
  user.otpExpiresAt = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendOtpEmail(email, otpCode);

  return res.status(200).json(
    new ApiResponse(200, { email }, "Verification OTP sent to email. Please verify to login.")
  );
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP code are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.otpCode !== otp || user.otpExpiresAt < Date.now()) {
    throw new ApiError(400, "Invalid or expired verification code");
  }

  user.otpCode = null;
  user.otpExpiresAt = null;
  user.isVerified = true;
  user.lastLoginAt = new Date();
  await user.save();

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const options = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  };

  const loggedInUser = await User.findById(user._id).select("-password");

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "Verification successful"
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

  if (refreshToken) {
    await RefreshToken.findOneAndDelete({ token: refreshToken });
  }

  const options = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, env.JWT_REFRESH_SECRET);
    
    const savedToken = await RefreshToken.findOne({ token: incomingRefreshToken });
    if (!savedToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    // Revoke old token
    await RefreshToken.deleteOne({ _id: savedToken._id });

    // Generate new tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const options = {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const crypto = require('crypto');

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, req.user, "Current user fetched successfully")
  );
});

const generateTelegramLinkToken = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const token = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 chars

  user.telegramLinkToken = token;
  await user.save();

  return res.status(200).json(
    new ApiResponse(200, { token }, "Pairing token generated successfully")
  );
});

module.exports = {
  register,
  login,
  verifyOtp,
  logout,
  refreshAccessToken,
  getCurrentUser,
  generateTelegramLinkToken,
};
