const mongoose = require("mongoose");

async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined in the environment");
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(uri);

  console.log(
    `Connected to MongoDB at ${uri.replace(/\/\/.*@/, "//<credentials>@")}`,
  );
}

module.exports = { connectToDatabase };
