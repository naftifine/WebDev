import express from "express";
import "dotenv/config";

import { connectDatabase } from "./database/connection.js";
import examScoreRoutes from "./routes/examScore.route.js";

import cors from "cors";

function required(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const env = {
  port: Number(process.env.PORT ?? 3000),
  mongoUri: required("MONGO_DB"),
  mongoDbName: process.env.MONGO_DB_NAME?.trim() || "webdev",
};

if (!Number.isInteger(env.port) || env.port < 1 || env.port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(examScoreRoutes);

async function startServer() {
  await connectDatabase(env.mongoUri, env.mongoDbName);
  app.listen(env.port, () => {
    console.log(`Server running at http://localhost:${env.port}`);
  });
}

startServer().catch((error: unknown) => {
  console.error("Failed to start server:", error);
  process.exitCode = 1;
});