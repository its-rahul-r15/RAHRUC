const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');
const { initBotService } = require('./services/botService');

const PORT = env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      // Initialize Telegram Bot Inbox Listener 
      initBotService();
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });
