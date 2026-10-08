import { Schema, model } from "mongoose";

import { subjects } from "../../subjects/Subject.js";

export interface ExamCombinations {
  a00?: number;
  a01?: number;
}

export interface SubjectStatistics {
  level1: number;
  level2: number;
  level3: number;
  level4: number;
}

export interface ExamScore {
  sbd: string;
  math?: number;
  literature?: number;
  foreignLanguage?: number;
  physics?: number;
  chemistry?: number;
  biology?: number;
  history?: number;
  geography?: number;
  civics?: number;
  languageCode?: string;
  combinations?: ExamCombinations;
}

const examScoreSchema = new Schema<ExamScore>(
  {
    sbd: { type: String, required: true, unique: true, index: true },
    math: Number,
    literature: Number,
    foreignLanguage: Number,
    physics: Number,
    chemistry: Number,
    biology: Number,
    history: Number,
    geography: Number,
    civics: Number,
    languageCode: String,
    combinations: {
      a00: Number,
      a01: Number,
    },
  },
  {
    collection: "exam_scores",
    timestamps: true,
  },
);

export const ExamScoreModel = model<ExamScore>("ExamScore", examScoreSchema);

const levelStatisticsSchema = new Schema(
  {
    level1: { type: Number, default: 0 },
    level2: { type: Number, default: 0 },
    level3: { type: Number, default: 0 },
    level4: { type: Number, default: 0 },
  },
  { _id: false },
);

const subjectFields = Object.fromEntries(
  subjects.map((subject) => [
    subject,
    { type: levelStatisticsSchema, required: true },
  ]),
);

const subjectStatisticsSchema = new Schema(
  {
    _id: { type: String, required: true },
    ...subjectFields,
  },
  {
    collection: "subject_statistics",
    timestamps: true,
  },
);

export const SubjectStatisticsModel = model(
  "SubjectStatistics",
  subjectStatisticsSchema,
);
