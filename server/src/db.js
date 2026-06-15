const mongoose = require("mongoose");

let connectionPromise = null;

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!connectionPromise) {
    mongoose.set("strictQuery", true);
    connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });
  }
  await connectionPromise;
  return mongoose.connection;
}

module.exports = { connectToDatabase };
