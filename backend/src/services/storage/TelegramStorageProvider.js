const StorageProvider = require('./StorageProvider.interface');
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const Bottleneck = require('bottleneck');
const env = require('../../config/env');

class TelegramStorageProvider extends StorageProvider {
  constructor() {
    super();
    this.bot = new TelegramBot(env.TELEGRAM_BOT_TOKEN, {
      polling: false,
      request: {
        agentOptions: {
          keepAlive: true,
          family: 4,
        },
      },
    });
    this.chatId = env.TELEGRAM_CHAT_ID;
    this.limiter = new Bottleneck({
      minTime: 350,
      maxConcurrent: 3,
    });
  }

  async upload(buffer, filename, mimeType, customCredentials = {}) {
    return this.limiter.schedule(async () => {
      const sendMethod = this._resolveSendMethod(mimeType);
      
      const fileOptions = {
        filename: filename,
        contentType: mimeType,
      };

      let bot = this.bot;
      let chatId = this.chatId;

      if (customCredentials.botToken && customCredentials.chatId) {
        bot = new TelegramBot(customCredentials.botToken, {
          polling: false,
          request: {
            agentOptions: {
              keepAlive: true,
              family: 4,
            },
          },
        });
        chatId = customCredentials.chatId;
      }

      let result;
      if (sendMethod === 'sendPhoto') {
        result = await bot.sendPhoto(chatId, buffer, {}, fileOptions);
      } else if (sendMethod === 'sendVideo') {
        result = await bot.sendVideo(chatId, buffer, {}, fileOptions);
      } else {
        result = await bot.sendDocument(chatId, buffer, {}, fileOptions);
      }

      const fileObj = result.document || result.video || (result.photo && result.photo[result.photo.length - 1]) || result.audio;
      if (!fileObj) {
        throw new Error('Telegram API did not return a valid file object');
      }

      return {
        fileId: fileObj.file_id,
        chatId: String(result.chat.id),
        messageId: String(result.message_id),
      };
    });
  }

  async getDownloadStream(fileId, range, botToken) {
    let bot = this.bot;
    let token = env.TELEGRAM_BOT_TOKEN;

    if (botToken) {
      bot = new TelegramBot(botToken, {
        polling: false,
        request: {
          agentOptions: {
            keepAlive: true,
            family: 4,
          },
        },
      });
      token = botToken;
    }

    const file = await bot.getFile(fileId);
    const url = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
    const headers = range ? { Range: range } : {};
    
    const response = await axios.get(url, {
      responseType: 'stream',
      headers,
    });
    
    return response;
  }

  async delete(chatId, messageId, botToken) {
    return this.limiter.schedule(async () => {
      try {
        let bot = this.bot;
        if (botToken) {
          bot = new TelegramBot(botToken, {
            polling: false,
            request: {
              agentOptions: {
                keepAlive: true,
                family: 4,
              },
            },
          });
        }
        await bot.deleteMessage(chatId, Number(messageId));
        return true;
      } catch (error) {
        console.error(`Error deleting message ${messageId} from chat ${chatId}:`, error.message);
        return false;
      }
    });
  }

  _resolveSendMethod(mimeType) {
    // For cloud drive stability, we could send everything as document or resolve by type.
    // Let's stick to the spec.
    if (mimeType.startsWith('image/')) return 'sendPhoto';
    if (mimeType.startsWith('video/')) return 'sendVideo';
    return 'sendDocument';
  }
}

module.exports = TelegramStorageProvider;
