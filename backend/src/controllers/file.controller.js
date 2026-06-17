const crypto = require('crypto');
const File = require('../models/File.model');
const Folder = require('../models/Folder.model');
const User = require('../models/User.model');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const storageProvider = require('../services/storage');
const thumbnailService = require('../services/thumbnail.service');

const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }

  const { folderId, isEncrypted, iv, salt } = req.body;
  const { originalname, buffer, size, mimetype } = req.file;

  // Quota check
  const user = await User.findById(req.user._id);
  if (user.storageUsed + size > user.storageLimit) {
    throw new ApiError(400, "Storage limit exceeded");
  }

  // Validate folder if specified
  if (folderId && folderId !== 'null' && folderId !== '') {
    const folder = await Folder.findOne({ _id: folderId, owner: req.user._id, isDeleted: false });
    if (!folder) {
      throw new ApiError(404, "Target folder not found");
    }
  }

  // Categorize file
  let type = 'other';
  if (mimetype.startsWith('image/')) type = 'image';
  else if (mimetype.startsWith('video/')) type = 'video';
  else if (mimetype.includes('pdf')) type = 'pdf';
  else if (mimetype.includes('document') || mimetype.includes('text') || mimetype.includes('sheet')) type = 'document';

  const customCredentials = {
    botToken: user.telegramBotToken,
    chatId: user.telegramChatId
  };

  if (!customCredentials.botToken || !customCredentials.chatId) {
    throw new ApiError(400, "Please configure your Telegram Bot Token and Chat ID in Settings first.");
  }

  // Upload original to Telegram
  const tgResult = await storageProvider.upload(buffer, originalname, mimetype, customCredentials);

  // Generate and upload thumbnail if it's an image and not encrypted
  let thumbnailFileId = null;
  let width = null;
  let height = null;

  if (type === 'image' && isEncrypted !== 'true') {
    const thumbBuffer = await thumbnailService.generateImageThumbnail(buffer);
    if (thumbBuffer) {
      try {
        const thumbResult = await storageProvider.upload(thumbBuffer, `thumb_${originalname}`, mimetype, customCredentials);
        thumbnailFileId = thumbResult.fileId;
      } catch (err) {
        console.error("Failed to upload thumbnail to Telegram:", err.message);
      }
    }
    const meta = await thumbnailService.getMetadata(buffer);
    width = meta.width;
    height = meta.height;
  }

  // Create file record
  const file = await File.create({
    name: originalname,
    originalName: originalname,
    size,
    mimeType: mimetype,
    type,
    telegramFileId: tgResult.fileId,
    telegramChatId: tgResult.chatId,
    telegramMessageId: tgResult.messageId,
    thumbnailFileId,
    folderId: (folderId && folderId !== 'null' && folderId !== '') ? folderId : null,
    owner: req.user._id,
    isEncrypted: isEncrypted === 'true',
    encryptionMetadata: isEncrypted === 'true' ? { iv, salt } : undefined,
    width,
    height,
    capturedAt: new Date(),
  });

  // Update user storage usage
  user.storageUsed += size;
  await user.save();

  return res.status(201).json(
    new ApiResponse(201, file, "File uploaded successfully")
  );
});

const getFiles = asyncHandler(async (req, res) => {
  const { folderId, type, page = 1, limit = 40, isStarred } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const query = { owner: req.user._id, isDeleted: false };
  if (folderId) {
    query.folderId = folderId === 'null' ? null : folderId;
  }
  if (type) {
    query.type = type;
  }
  if (isStarred === 'true') {
    query.isStarred = true;
  }

  const files = await File.find(query)
    .sort({ uploadDate: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await File.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(200, {
      items: files,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: total > skip + files.length,
      }
    }, "Files fetched successfully")
  );
});

const getFileMetadata = asyncHandler(async (req, res) => {
  const file = await File.findOne({ _id: req.params.id, owner: req.user._id, isDeleted: false });
  if (!file) {
    throw new ApiError(404, "File not found");
  }
  return res.status(200).json(
    new ApiResponse(200, file, "File metadata fetched")
  );
});

const streamFile = asyncHandler(async (req, res) => {
  const file = await File.findOne({ _id: req.params.id, owner: req.user._id, isDeleted: false });
  if (!file) {
    throw new ApiError(404, "File not found");
  }

  const user = await User.findById(req.user._id);
  if (!user || !user.telegramBotToken) {
    throw new ApiError(400, "Please configure your Telegram Bot Token in Settings first.");
  }

  const range = req.headers.range;
  const responseStream = await storageProvider.getDownloadStream(file.telegramFileId, range, user.telegramBotToken);

  // Set appropriate headers
  res.set({
    'Content-Type': file.mimeType,
    'Content-Length': responseStream.headers['content-length'],
    'Accept-Ranges': 'bytes',
    'Content-Disposition': `inline; filename="${encodeURIComponent(file.name)}"`,
  });

  if (responseStream.headers['content-range']) {
    res.status(206);
    res.set('Content-Range', responseStream.headers['content-range']);
  }

  responseStream.data.pipe(res);
});

const streamThumbnail = asyncHandler(async (req, res) => {
  const file = await File.findOne({ _id: req.params.id, owner: req.user._id, isDeleted: false });
  if (!file) {
    throw new ApiError(404, "File not found");
  }

  if (!file.thumbnailFileId) {
    throw new ApiError(404, "Thumbnail not available");
  }

  const user = await User.findById(req.user._id);
  if (!user || !user.telegramBotToken) {
    throw new ApiError(400, "Please configure your Telegram Bot Token in Settings first.");
  }

  const responseStream = await storageProvider.getDownloadStream(file.thumbnailFileId, undefined, user.telegramBotToken);
  res.set({
    'Content-Type': 'image/jpeg',
    'Cache-Control': 'public, max-age=86400',
  });
  responseStream.data.pipe(res);
});

const renameFile = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const file = await File.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id, isDeleted: false },
    { name },
    { new: true }
  );

  if (!file) {
    throw new ApiError(404, "File not found");
  }

  return res.status(200).json(
    new ApiResponse(200, file, "File renamed successfully")
  );
});

const moveFile = asyncHandler(async (req, res) => {
  const { folderId } = req.body;

  if (folderId && folderId !== 'null') {
    const folder = await Folder.findOne({ _id: folderId, owner: req.user._id, isDeleted: false });
    if (!folder) {
      throw new ApiError(404, "Target folder not found");
    }
  }

  const file = await File.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id, isDeleted: false },
    { folderId: (folderId && folderId !== 'null') ? folderId : null },
    { new: true }
  );

  if (!file) {
    throw new ApiError(404, "File not found");
  }

  return res.status(200).json(
    new ApiResponse(200, file, "File moved successfully")
  );
});

const toggleStar = asyncHandler(async (req, res) => {
  const file = await File.findOne({ _id: req.params.id, owner: req.user._id, isDeleted: false });
  if (!file) {
    throw new ApiError(404, "File not found");
  }

  file.isStarred = !file.isStarred;
  await file.save();

  return res.status(200).json(
    new ApiResponse(200, file, `File ${file.isStarred ? 'starred' : 'unstarred'} successfully`)
  );
});

const deleteFile = asyncHandler(async (req, res) => {
  const file = await File.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id, isDeleted: false },
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );

  if (!file) {
    throw new ApiError(404, "File not found");
  }

  return res.status(200).json(
    new ApiResponse(200, null, "File moved to Trash")
  );
});

const toggleShare = asyncHandler(async (req, res) => {
  const file = await File.findOne({ _id: req.params.id, owner: req.user._id, isDeleted: false });
  if (!file) {
    throw new ApiError(404, "File not found");
  }

  file.isPublic = !file.isPublic;
  if (file.isPublic) {
    file.shareSlug = crypto.randomBytes(16).toString('hex');
  } else {
    file.shareSlug = undefined;
  }
  await file.save();

  return res.status(200).json(
    new ApiResponse(200, file, `File public sharing ${file.isPublic ? 'enabled' : 'disabled'}`)
  );
});

const getPublicFileMetadata = asyncHandler(async (req, res) => {
  const file = await File.findOne({ shareSlug: req.params.slug, isDeleted: false, isPublic: true });
  if (!file) {
    throw new ApiError(404, "File not found or not publicly shared");
  }
  return res.status(200).json(
    new ApiResponse(200, {
      name: file.name,
      size: file.size,
      mimeType: file.mimeType,
      type: file.type,
      isEncrypted: file.isEncrypted,
      encryptionMetadata: file.encryptionMetadata,
      shareSlug: file.shareSlug,
      uploadDate: file.uploadDate,
    }, "Public file metadata fetched")
  );
});

const streamPublicFile = asyncHandler(async (req, res) => {
  const file = await File.findOne({ shareSlug: req.params.slug, isDeleted: false, isPublic: true });
  if (!file) {
    throw new ApiError(404, "File not found or not publicly shared");
  }

  const range = req.headers.range;
  const responseStream = await storageProvider.getDownloadStream(file.telegramFileId, range);

  res.set({
    'Content-Type': file.mimeType,
    'Content-Length': responseStream.headers['content-length'],
    'Accept-Ranges': 'bytes',
    'Content-Disposition': `inline; filename="${encodeURIComponent(file.name)}"`,
  });

  if (responseStream.headers['content-range']) {
    res.status(206);
    res.set('Content-Range', responseStream.headers['content-range']);
  }

  responseStream.data.pipe(res);
});

module.exports = {
  uploadFile,
  getFiles,
  getFileMetadata,
  streamFile,
  streamThumbnail,
  renameFile,
  moveFile,
  toggleStar,
  deleteFile,
  toggleShare,
  getPublicFileMetadata,
  streamPublicFile,
};
