const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true, maxlength: 50 },
  email:       { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password:    { type: String, required: true, select: false },
  avatar:      { type: String, default: null },
  storageUsed: { type: Number, default: 0 },
  storageLimit:{ type: Number, default: 15 * 1024 * 1024 * 1024 }, // 15GB default
  role:        { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified:  { type: Boolean, default: false },
  lastLoginAt: { type: Date },
  
  // Telegram Inbox Pairing
  telegramUserId:    { type: String, default: null, sparse: true, unique: true },
  telegramLinkToken: { type: String, default: null, sparse: true },
  
  // Custom Telegram credentials
  telegramBotToken:  { type: String, default: null },
  telegramChatId:    { type: String, default: null },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
