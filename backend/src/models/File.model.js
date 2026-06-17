const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name:           { type: String, required: true, trim: true, maxlength: 255 },
  originalName:   { type: String, required: true },
  size:           { type: Number, required: true },
  mimeType:       { type: String, required: true, index: true },
  type:           { type: String, enum: ['image', 'video', 'pdf', 'document', 'other'], required: true, index: true },

  telegramFileId:   { type: String, required: true },
  telegramChatId:   { type: String, required: true },
  telegramMessageId:{ type: String, required: true },
  thumbnailFileId:  { type: String, default: null },

  folderId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null, index: true },
  owner:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

  isStarred:      { type: Boolean, default: false, index: true },
  isDeleted:      { type: Boolean, default: false, index: true },
  deletedAt:      { type: Date, default: null },

  // Public Share
  isPublic:       { type: Boolean, default: false, index: true },
  shareSlug:      { type: String, sparse: true, unique: true },

  // Encrypted Vault
  isEncrypted:    { type: Boolean, default: false },
  encryptionMetadata: {
    iv:           { type: String, default: null },
    salt:         { type: String, default: null },
  },

  width:          { type: Number, default: null },
  height:         { type: Number, default: null },
  duration:       { type: Number, default: null },
  capturedAt:     { type: Date, default: null },

  uploadDate:     { type: Date, default: Date.now, index: true },
}, { timestamps: true });

fileSchema.index({ owner: 1, folderId: 1, isDeleted: 1, uploadDate: -1 });
fileSchema.index({ owner: 1, type: 1, isDeleted: 1, uploadDate: -1 });
fileSchema.index({ owner: 1, isStarred: 1, isDeleted: 1 });
fileSchema.index({ owner: 1, name: 'text' });

module.exports = mongoose.model('File', fileSchema);
