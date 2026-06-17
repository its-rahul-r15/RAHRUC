const File = require('../models/File.model');
const Folder = require('../models/Folder.model');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const searchItems = asyncHandler(async (req, res) => {
  const { q, type, dateFrom, dateTo, folderId } = req.query;
  const owner = req.user._id;

  const fileQuery = { owner, isDeleted: false };
  const folderQuery = { owner, isDeleted: false };

  if (q) {
    const textSearch = { $regex: q, $options: 'i' };
    fileQuery.name = textSearch;
    folderQuery.name = textSearch;
  }

  if (type) {
    fileQuery.type = type;
  }

  if (dateFrom || dateTo) {
    fileQuery.uploadDate = {};
    if (dateFrom) fileQuery.uploadDate.$gte = new Date(dateFrom);
    if (dateTo) fileQuery.uploadDate.$lte = new Date(dateTo);
  }

  if (folderId) {
    const fId = folderId === 'null' ? null : folderId;
    fileQuery.folderId = fId;
    folderQuery.parentFolder = fId;
  }

  const [files, folders] = await Promise.all([
    File.find(fileQuery).sort({ uploadDate: -1 }),
    Folder.find(folderQuery).sort({ name: 1 }),
  ]);

  return res.status(200).json(
    new ApiResponse(200, { files, folders }, "Search completed successfully")
  );
});

module.exports = {
  searchItems,
};
