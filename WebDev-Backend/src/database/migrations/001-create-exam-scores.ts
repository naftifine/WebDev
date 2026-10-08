import type { Db } from "mongodb";

export const name = "001-create-exam-scores";

export async function up(db: Db) {
  const collections = await db.listCollections({ name: "exam_scores" }).toArray();

  if (collections.length === 0) {
    await db.createCollection("exam_scores");
  }

  await db.collection("exam_scores").createIndex({ sbd: 1 }, { unique: true });
  await db.collection("exam_scores").createIndex(
    { "combinations.a00": -1 },
    { name: "combinations_a00_desc" },
  );
  await db.collection("exam_scores").createIndex(
    { "combinations.a01": -1 },
    { name: "combinations_a01_desc" },
  );
}
