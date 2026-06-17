const File = require('../models/File.model');
const Folder = require('../models/Folder.model');
const User = require('../models/User.model');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const storageProvider = require('../services/storage');

const getTrashContents = asyncHandler(async (req, res) => {
  const [folders, files] = await Promise.all([
    Folder.find({ owner: req.user._id, isDeleted: true }).sort({ deletedAt: -1 }),
    File.find({ owner: req.user._id, isDeleted: true }).sort({ deletedAt: -1 }),
  ]);

  return res.status(200).json(
    new ApiResponse(200, { folders, files }, "Trash contents retrieved")
  );
});

const restoreItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type } = req.query; // 'file' or 'folder'

  if (type === 'folder') {
    const folder = await Folder.findOne({ _id: id, owner: req.user._id, isDeleted: true });
    if (!folder) {
      throw new ApiError(404, "Folder not found in Trash");
    }

    folder.isDeleted = false;
    folder.deletedAt = null;
    await folder.save();

    // Restore children
    const pathRegex = new RegExp(`^${folder.path}`);
    await Folder.updateMany(
      { owner: req.user._id, path: pathRegex, isDeleted: true },
      { $set: { isDeleted: false, deletedAt: null } }
    );

    const subfolders = await Folder.find({ owner: req.user._id, path: pathRegex });
    const folderIds = [folder._id, ...subfolders.map(sf => sf._id)];

    await File.updateMany(
      { owner: req.user._id, folderId: { $in: folderIds }, isDeleted: true },
      { $set: { isDeleted: false, deletedAt: null } }
    );
  } else {
    const file = await File.findOne({ _id: id, owner: req.user._id, isDeleted: true });
    if (!file) {
      throw new ApiError(404, "File not found in Trash");
    }

    // Verify parent folder is not deleted (if it is, put it in root)
    if (file.folderId) {
      const parent = await Folder.findOne({ _id: file.folderId, owner: req.user._id });
      if (!parent || parent.isDeleted) {
        file.folderId = null;
      }
    }

    file.isDeleted = false;
    file.deletedAt = null;
    await file.save();
  }

  return res.status(200).json(
    new ApiResponse(200, null, "Item restored successfully")
  );
});

const deleteItemPermanently = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { type } = req.query; // 'file' or 'folder'
  const user = await User.findById(req.user._id);

  if (type === 'folder') {
    const folder = await Folder.findOne({ _id: id, owner: req.user._id, isDeleted: true });
    if (!folder) {
      throw new ApiError(404, "Folder not found");
    }

    const pathRegex = new RegExp(`^${folder.path}`);
    const subfolders = await Folder.find({ owner: req.user._id, path: pathRegex });
    const folderIds = [folder._id, ...subfolders.map(sf => sf._id)];

    // Find all files inside these folders to delete them from Telegram
    const files = await File.find({ owner: req.user._id, folderId: { $in: folderIds } });
    
    let totalSize = 0;
    for (const file of files) {
      totalSize += file.size;
      // Delete original and thumbnail from Telegram
      await storageProvider.delete(file.telegramChatId, file.telegramMessageId, user?.telegramBotToken);
      if (file.thumbnailFileId) {
        await storageProvider.delete(file.telegramChatId, file.telegramMessageId, user?.telegramBotToken); // normally deleted with same message or separate
      }
      await File.deleteOne({ _id: file._id });
    }

    // Delete folders
    await Folder.deleteMany({ _id: { $in: folderIds } });

    // Update storage used
    user.storageUsed = Math.max(0, user.storageUsed - totalSize);
    await user.save();
  } else {
    const file = await File.findOne({ _id: id, owner: req.user._id, isDeleted: true });
    if (!file) {
      throw new ApiError(404, "File not found");
    }

    // Delete from Telegram
    await storageProvider.delete(file.telegramChatId, file.telegramMessageId, user?.telegramBotToken);
    
    // Delete file record
    await File.deleteOne({ _id: file._id });

    // Update storage used
    user.storageUsed = Math.max(0, user.storageUsed - file.size);
    await user.save();
  }

  return res.status(200).json(
    new ApiResponse(200, null, "Item deleted permanently")
  );
});

const emptyTrash = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const files = await File.find({ owner: req.user._id, isDeleted: true });

  let totalSize = 0;
  for (const file of files) {
    totalSize += file.size;
    await storageProvider.delete(file.telegramChatId, file.telegramMessageId, user?.telegramBotToken);
    await File.deleteOne({ _id: file._id });
  }

  await Folder.deleteMany({ owner: req.user._id, isDeleted: true });

  user.storageUsed = Math.max(0, user.storageUsed - totalSize);
  await user.save();

  return res.status(200).json(
    new ApiResponse(200, null, "Trash emptied successfully")
  );
});

module.exports = {
  getTrashContents,
  restoreItem,
  deleteItemPermanently,
  emptyTrash,
};
