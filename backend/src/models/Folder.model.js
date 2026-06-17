const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true, maxlength: 255 },
  parentFolder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null, index: true },
  owner:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  path:         { type: String, index: true },
  isStarred:    { type: Boolean, default: false },
  isDeleted:    { type: Boolean, default: false, index: true },
  deletedAt:    { type: Date, default: null },
}, { timestamps: true });

folderSchema.index({ owner: 1, parentFolder: 1, isDeleted: 1 });
folderSchema.index({ owner: 1, name: 'text' });

module.exports = mongoose.model('Folder', folderSchema);
