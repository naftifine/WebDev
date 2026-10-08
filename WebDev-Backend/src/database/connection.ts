import mongoose from "mongoose";
import "dotenv/config";

export async function connectDatabase(
  mongoUri = process.env.MONGO_DB,
  mongoDbName = process.env.MONGO_DB_NAME?.trim() || "webdev",
) {
  if (!mongoUri?.trim()) {
    throw new Error("Missing required environment variable: MONGO_DB");
  }

  await mongoose.connect(mongoUri, {
    dbName: mongoDbName,
  });
  console.log(`MongoDB connected: ${mongoDbName}`);
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}
