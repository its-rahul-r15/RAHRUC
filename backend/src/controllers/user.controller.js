const User = require('../models/User.model');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const updateProfile = asyncHandler(async (req, res) => {
  const { name, avatar, telegramBotToken, telegramChatId } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        name,
        avatar,
        telegramBotToken: telegramBotToken === '' ? null : telegramBotToken,
        telegramChatId: telegramChatId === '' ? null : telegramChatId,
      }
    },
    { new: true }
  ).select("-password");

  return res.status(200).json(
    new ApiResponse(200, user, "Profile updated successfully")
  );
});

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");
  
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save();

  return res.status(200).json(
    new ApiResponse(200, {}, "Password changed successfully")
  );
});

const getStorageStats = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("storageUsed storageLimit");
  return res.status(200).json(
    new ApiResponse(200, {
      used: user.storageUsed,
      limit: user.storageLimit,
      percentage: ((user.storageUsed / user.storageLimit) * 100).toFixed(2),
    }, "Storage stats retrieved")
  );
});

module.exports = {
  updateProfile,
  updatePassword,
  getStorageStats,
};
