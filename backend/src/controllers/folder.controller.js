const Folder = require('../models/Folder.model');
const File = require('../models/File.model');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const createFolder = asyncHandler(async (req, res) => {
  const { name, parentFolder } = req.body;

  let parentPath = "";
  if (parentFolder) {
    const parent = await Folder.findOne({ _id: parentFolder, owner: req.user._id, isDeleted: false });
    if (!parent) {
      throw new ApiError(404, "Parent folder not found");
    }
    parentPath = parent.path;
  }

  const folder = await Folder.create({
    name,
    parentFolder: parentFolder || null,
    owner: req.user._id,
    path: "PENDING_PATH",
  });

  folder.path = parentFolder ? `${parentPath}${folder._id}/` : `/${folder._id}/`;
  await folder.save();

  return res.status(201).json(
    new ApiResponse(201, folder, "Folder created successfully")
  );
});

const getFolderContents = asyncHandler(async (req, res) => {
  const folderId = req.params.id === 'root' ? null : req.params.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 40;
  const skip = (page - 1) * limit;

  // Verify folder ownership if not root
  if (folderId) {
    const folder = await Folder.findOne({ _id: folderId, owner: req.user._id, isDeleted: false });
    if (!folder) {
      throw new ApiError(404, "Folder not found");
    }
  }

  const folderQuery = { owner: req.user._id, parentFolder: folderId, isDeleted: false };
  const fileQuery = { owner: req.user._id, folderId, isDeleted: false };

  const [folders, files, totalFolders, totalFiles] = await Promise.all([
    Folder.find(folderQuery).sort({ name: 1 }).skip(skip).limit(limit),
    File.find(fileQuery).sort({ uploadDate: -1 }).skip(skip).limit(limit),
    Folder.countDocuments(folderQuery),
    File.countDocuments(fileQuery),
  ]);

  // Generate breadcrumbs if not root
  let breadcrumbs = [];
  if (folderId) {
    const folder = await Folder.findOne({ _id: folderId, owner: req.user._id });
    if (folder) {
      const parentIds = folder.path.split('/').filter(Boolean);
      const parentFolders = await Folder.find({ _id: { $in: parentIds }, owner: req.user._id });
      
      // Order breadcrumbs according to path sequence
      breadcrumbs = parentIds.map(id => {
        const f = parentFolders.find(p => p._id.toString() === id);
        return f ? { id: f._id, name: f.name } : null;
      }).filter(Boolean);
    }
  }

  return res.status(200).json(
    new ApiResponse(200, {
      folders,
      files,
      pagination: {
        page,
        limit,
        hasMoreFolders: totalFolders > skip + folders.length,
        hasMoreFiles: totalFiles > skip + files.length,
      },
      breadcrumbs,
    }, "Contents retrieved successfully")
  );
});

const renameFolder = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const folder = await Folder.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id, isDeleted: false },
    { name },
    { new: true }
  );

  if (!folder) {
    throw new ApiError(404, "Folder not found");
  }

  return res.status(200).json(
    new ApiResponse(200, folder, "Folder renamed successfully")
  );
});

const moveFolder = asyncHandler(async (req, res) => {
  const { parentFolder } = req.body;
  const folder = await Folder.findOne({ _id: req.params.id, owner: req.user._id, isDeleted: false });

  if (!folder) {
    throw new ApiError(404, "Folder not found");
  }

  // Prevent moving into itself
  if (parentFolder && parentFolder === folder._id.toString()) {
    throw new ApiError(400, "Cannot move a folder inside itself");
  }

  let newParentPath = "";
  if (parentFolder) {
    const parent = await Folder.findOne({ _id: parentFolder, owner: req.user._id, isDeleted: false });
    if (!parent) {
      throw new ApiError(404, "Parent folder not found");
    }
    // Prevent moving into a descendant
    if (parent.path.startsWith(folder.path)) {
      throw new ApiError(400, "Cannot move a folder inside its own child");
    }
    newParentPath = parent.path;
  }

  const oldPath = folder.path;
  const newPath = parentFolder ? `${newParentPath}${folder._id}/` : `/${folder._id}/`;

  folder.parentFolder = parentFolder || null;
  folder.path = newPath;
  await folder.save();

  // Cascade update to all subfolders paths
  const subfolders = await Folder.find({ owner: req.user._id, path: new RegExp(`^${oldPath}`) });
  for (const sub of subfolders) {
    sub.path = sub.path.replace(oldPath, newPath);
    await sub.save();
  }

  return res.status(200).json(
    new ApiResponse(200, folder, "Folder moved successfully")
  );
});

const deleteFolder = asyncHandler(async (req, res) => {
  const folder = await Folder.findOne({ _id: req.params.id, owner: req.user._id, isDeleted: false });

  if (!folder) {
    throw new ApiError(404, "Folder not found");
  }

  const deletedAt = new Date();

  // Soft-delete the folder itself
  folder.isDeleted = true;
  folder.deletedAt = deletedAt;
  await folder.save();

  // Cascade soft-delete to all subfolders
  const pathRegex = new RegExp(`^${folder.path}`);
  await Folder.updateMany(
    { owner: req.user._id, path: pathRegex },
    { $set: { isDeleted: true, deletedAt } }
  );

  // Find all subfolders to get their IDs
  const subfolders = await Folder.find({ owner: req.user._id, path: pathRegex });
  const folderIds = [folder._id, ...subfolders.map(sf => sf._id)];

  // Soft-delete all files inside these folders
  await File.updateMany(
    { owner: req.user._id, folderId: { $in: folderIds } },
    { $set: { isDeleted: true, deletedAt } }
  );

  return res.status(200).json(
    new ApiResponse(200, null, "Folder soft-deleted successfully")
  );
});

module.exports = {
  createFolder,
  getFolderContents,
  renameFolder,
  moveFolder,
  deleteFolder,
};
