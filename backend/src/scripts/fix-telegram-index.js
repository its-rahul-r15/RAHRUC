const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in environment variables.");
  process.exit(1);
}

async function fixTelegramIndex() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // 1. Unset telegramUserId and telegramLinkToken fields that are currently null
    console.log("Unsetting telegramUserId and telegramLinkToken fields where they are null...");
    const unsetResult = await usersCollection.updateMany(
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
    console.log(`Updated ${unsetResult.modifiedCount} documents.`);

    // 2. Drop the existing telegramUserId_1 index if it exists
    console.log("Checking indexes...");
    const indexes = await usersCollection.indexes();
    const indexNames = indexes.map(idx => idx.name);

    if (indexNames.includes('telegramUserId_1')) {
      console.log("Dropping existing telegramUserId_1 index...");
      await usersCollection.dropIndex('telegramUserId_1');
      console.log("Dropped index telegramUserId_1 successfully.");
    } else {
      console.log("Index telegramUserId_1 does not exist, skipping drop.");
    }

    console.log("Fix completed successfully!");
  } catch (error) {
    console.error("❌ Error during fix:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

fixTelegramIndex();
