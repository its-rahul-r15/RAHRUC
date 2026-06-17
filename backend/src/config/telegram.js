const TelegramBot = require('node-telegram-bot-api');
const env = require('./env');

let bot;
try {
  bot = new TelegramBot(env.TELEGRAM_BOT_TOKEN, {
    polling: false,
    request: {
      agentOptions: {
        keepAlive: true,
        family: 4,
      },
    },
  });
  console.log('Telegram Bot Client Initialized');
} catch (error) {
  console.error('Failed to initialize Telegram Bot Client:', error.message);
}

module.exports = bot;
