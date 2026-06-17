const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

console.log("Token:", process.env.TELEGRAM_BOT_TOKEN);
console.log("Chat ID:", process.env.TELEGRAM_CHAT_ID);

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: false,
  request: {
    agentOptions: {
      keepAlive: true,
      family: 4,
    },
  },
});

async function test() {
  try {
    console.log("Attempting to send a test message...");
    const res = await bot.sendMessage(process.env.TELEGRAM_CHAT_ID, "Test message from TeleDrive setup");
    console.log("✅ Message sent successfully!");
    console.log("Result:", res);
  } catch (error) {
    console.error("❌ Failed to send message.");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    if (error.response) {
      console.error("Telegram Response Error Code:", error.response.statusCode);
      console.error("Telegram Response Body:", error.response.body);
    }
  }
}

test();
