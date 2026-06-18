const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Auto-cleanup for duplicate telegramUserId null keys
    try {
      const db = conn.connection.db;
      const usersCollection = db.collection('users');

      // Unset fields where they are null
      await usersCollection.updateMany(
        {
          $or: [
            { telegramUserId: null },
            { telegramLinkToken: null }
          ]
        },
        {
          $unset: {
            telegramUserId: "",
            telegramLinkToken: ""
          }
        }
      );

      // Drop index telegramUserId_1 if it exists so Mongoose can rebuild it with sparse constraint properly
      const indexes = await usersCollection.indexes();
      if (indexes.some(idx => idx.name === 'telegramUserId_1')) {
        await usersCollection.dropIndex('telegramUserId_1');
        console.log('Dropped index telegramUserId_1 for rebuild.');
      }
    } catch (dbErr) {
      console.warn('DB Index Cleanup Warning:', dbErr.message);
    }
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
