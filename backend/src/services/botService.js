const bot = require('../config/telegram');
const User = require('../models/User.model');
const File = require('../models/File.model');
const Folder = require('../models/Folder.model');

function initBotService() {
  if (!bot) {
    console.warn("⚠️ Bot not initialized, skipping botService listener.");
    return;
  }

  // Enable polling to listen for users sending files/commands
  // Note: Since constructor was initialized with polling: false, we can activate polling manually
  bot.startPolling().catch(err => {
    console.error("Failed to start bot polling:", err.message);
  });

  console.log("🤖 Telegram Bot Polling Active");

  // Handle messages
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text || '';
    const userId = String(msg.from.id);

    // 1. Handle Account Link Token command
    if (text.startsWith('/start') || text.startsWith('/link')) {
      const parts = text.split(' ');
      const token = parts[1];

      if (!token) {
        return bot.sendMessage(chatId, "Welcome to TeleDrive! To link your account, use `/link <pairing_token>` or get the direct start link from your Settings page.");
      }

      try {
        const user = await User.findOne({ telegramLinkToken: token });
        if (!user) {
          return bot.sendMessage(chatId, "❌ Invalid or expired pairing token.");
        }

        user.telegramUserId = userId;
        user.telegramLinkToken = null;
        await user.save();

        return bot.sendMessage(chatId, `✅ Link Successful! Connected to account: ${user.email}`);
      } catch (err) {
        console.error(err);
        return bot.sendMessage(chatId, "❌ An error occurred during account linking.");
      }
    }

    // 2. Handle incoming files
    const fileObj = msg.document || msg.video || (msg.photo && msg.photo[msg.photo.length - 1]) || msg.audio;
    if (fileObj) {
      try {
        // Find linked user
        const user = await User.findOne({ telegramUserId: userId });
        if (!user) {
          return bot.sendMessage(chatId, "❌ Account not linked. Please get a pairing token from your Web App Settings and send: `/link <token>`");
        }

        // Get file specifications
        const fileId = fileObj.file_id;
        const originalName = fileObj.file_name || (msg.photo ? `Photo_${Date.now()}.jpg` : `File_${Date.now()}`);
        const size = fileObj.file_size || 0;
        let mimeType = msg.document ? fileObj.mime_type : 'application/octet-stream';
        if (msg.photo) mimeType = 'image/jpeg';
        if (msg.video) mimeType = fileObj.mime_type || 'video/mp4';

        // Quota check
        if (user.storageUsed + size > user.storageLimit) {
          return bot.sendMessage(chatId, "❌ Upload failed: You have exceeded your storage limit.");
        }

        // Find or create "Telegram Inbox" folder
        let inboxFolder = await Folder.findOne({
          name: "Telegram Inbox",
          owner: user._id,
          isDeleted: false,
        });

        if (!inboxFolder) {
          inboxFolder = await Folder.create({
            name: "Telegram Inbox",
            owner: user._id,
            parentFolder: null,
            path: "PENDING_PATH",
          });
          inboxFolder.path = `/${inboxFolder._id}/`;
          await inboxFolder.save();
        }

        // Categorize file
        let type = 'other';
        if (mimeType.startsWith('image/')) type = 'image';
        else if (mimeType.startsWith('video/')) type = 'video';
        else if (mimeType.includes('pdf')) type = 'pdf';
        else if (mimeType.includes('document') || mimeType.includes('text')) type = 'document';

        // Write directly to DB using the telegram server pointers!
        await File.create({
          name: originalName,
          originalName,
          size,
          mimeType,
          type,
          telegramFileId: fileId,
          telegramChatId: String(chatId),
          telegramMessageId: String(msg.message_id),
          folderId: inboxFolder._id,
          owner: user._id,
          capturedAt: new Date(),
        });

        // Update storage used
        user.storageUsed += size;
        await user.save();

        return bot.sendMessage(chatId, `✅ Saved! File has been cataloged under "Telegram Inbox" folder.`);
      } catch (err) {
        console.error("Bot direct save failed:", err.message);
        return bot.sendMessage(chatId, "❌ Failed to save file metadata.");
      }
    }
  });
}

module.exports = { initBotService };
