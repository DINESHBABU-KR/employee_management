// backend/config/database.js

const mongoose = require("mongoose");
import Config from "./index";

// Simple function to connect to our MongoDB database

const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(Config.MONGODB_URI);

    console.log("database connected-->");
  } catch (error) {
    console.log("🚀 ~ connectDatabase ~ error:", error);
    process.exit(1);
  }
};

module.exports = connectDatabase;
