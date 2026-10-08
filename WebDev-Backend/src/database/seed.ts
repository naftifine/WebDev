import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import { resolve } from "node:path";

import { connectDatabase, disconnectDatabase } from "./connection.js";
import {
  ExamScoreModel,
  SubjectStatisticsModel,
  type ExamCombinations,
  type SubjectStatistics,
} from "./models/ExamScore.js";
import { subjects, type Subject } from "../subjects/Subject.js";

type SeedValue = string | number | ExamCombinations | undefined;

type Statistics = Record<Subject, SubjectStatistics>;

function createStatistics(): Statistics {
  return Object.fromEntries(
    subjects.map((subject) => [
      subject,
      { level1: 0, level2: 0, level3: 0, level4: 0 },
    ]),
  ) as Statistics;
}

function addToStatistics(statistics: Statistics, record: Record<string, SeedValue>) {
  for (const subject of subjects) {
    const score = record[subject];
    if (typeof score !== "number") continue;

    if (score < 4) {
      statistics[subject].level4 += 1;
    } else if (score < 6) {
      statistics[subject].level3 += 1;
    } else if (score < 8) {
      statistics[subject].level2 += 1;
    } else {
      statistics[subject].level1 += 1;
    }
  }
}

const csvPath = resolve(process.cwd(), "data", "diem_thi_thpt_2024.csv");
const fieldMap: Record<string, string> = {
  sbd: "sbd",
  toan: "math",
  ngu_van: "literature",
  ngoai_ngu: "foreignLanguage",
  vat_li: "physics",
  hoa_hoc: "chemistry",
  sinh_hoc: "biology",
  lich_su: "history",
  dia_li: "geography",
  gdcd: "civics",
  ma_ngoai_ngu: "languageCode",
};

function parseValue(field: string, value: string): string | number | undefined {
  if (!value) {
    return undefined;
  }

  return field === "sbd" || field === "languageCode"
    ? value
    : Number(value);
}

function calculateCombinations(
  record: Record<string, SeedValue>,
): ExamCombinations | undefined {
  const math = record.math;
  const physics = record.physics;
  const chemistry = record.chemistry;
  const foreignLanguage = record.foreignLanguage;

  const combinations: ExamCombinations = {};

  if (
    typeof math === "number" &&
    typeof physics === "number" &&
    typeof chemistry === "number"
  ) {
    combinations.a00 = math + physics + chemistry;
  }

  if (
    typeof math === "number" &&
    typeof physics === "number" &&
    typeof foreignLanguage === "number"
  ) {
    combinations.a01 = math + physics + foreignLanguage;
  }

  return Object.keys(combinations).length > 0 ? combinations : undefined;
}

async function seed() {
  await connectDatabase();

  try {
    const lines = createInterface({
      input: createReadStream(csvPath, { encoding: "utf8" }),
      crlfDelay: Infinity,
    });
    let headers: string[] | undefined;
    let operations: Array<{
      updateOne: {
        filter: { sbd: string };
        update: { $set: Record<string, SeedValue> };
        upsert: true;
      };
    }> = [];
    let total = 0;
    const statistics = createStatistics();

    for await (const line of lines) {
      if (!line.trim()) continue;
      if (!headers) {
        headers = line.split(",");
        continue;
      }

      const values = line.split(",");
      const record: Record<string, SeedValue> = {};
      headers.forEach((header, index) => {
        const field = fieldMap[header];
        if (field) record[field] = parseValue(field, values[index]?.trim() ?? "");
      });

      if (typeof record.sbd !== "string") continue;
      addToStatistics(statistics, record);
      const combinations = calculateCombinations(record);
      if (combinations) {
        record.combinations = combinations;
      }
      operations.push({
        updateOne: {
          filter: { sbd: record.sbd },
          update: { $set: record },
          upsert: true,
        },
      });

      if (operations.length === 10_000) {
        await ExamScoreModel.bulkWrite(operations, { ordered: false });
        total += operations.length;
        operations = [];
      }
    }

    if (operations.length > 0) {
      await ExamScoreModel.bulkWrite(operations, { ordered: false });
      total += operations.length;
    }

    await SubjectStatisticsModel.replaceOne(
      { _id: "2024" },
      { _id: "2024", ...statistics },
      { upsert: true },
    );

    console.log(`Seeded ${total} exam score records from ${csvPath}`);
  } finally {
    await disconnectDatabase();
  }
}

seed().catch((error: unknown) => {
  console.error("Seeding failed:", error);
  process.exitCode = 1;
});
