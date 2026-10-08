import { connectDatabase, disconnectDatabase } from "./connection.js";
import { name, up } from "./migrations/001-create-exam-scores.js";
import mongoose from "mongoose";

async function migrate() {
  await connectDatabase();

  try {
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("MongoDB connection is not ready");
    }

    const migrationCollection = db.collection<{
      name: string;
      appliedAt: Date;
    }>("_migrations");

    const applied = await migrationCollection.findOne({ name });

    if (!applied) {
      await up(db);
      await migrationCollection.insertOne({ name, appliedAt: new Date() });
      console.log(`Applied migration: ${name}`);
    } else {
      console.log(`Migration already applied: ${name}`);
    }
  } finally {
    await disconnectDatabase();
  }
}

migrate().catch((error: unknown) => {
  console.error("Migration failed:", error);
  process.exitCode = 1;
});
