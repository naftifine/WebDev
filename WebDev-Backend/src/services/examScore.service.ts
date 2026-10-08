import {
  ExamScoreModel,
  SubjectStatisticsModel,
} from "../database/models/ExamScore.js";
import { isCombination, type Combination } from "../subjects/Combination.js";

export async function findExamScoreBySbd(sbd: string) {
  return ExamScoreModel.findOne({ sbd }).lean();
}

export async function findSubjectStatistics() {
  return SubjectStatisticsModel.findById("2024").lean();
}

export function parseCombination(value: string): Combination | undefined {
  const normalizedValue = value.toLowerCase();
  return isCombination(normalizedValue) ? normalizedValue : undefined;
}

export async function findTopExamScores(
  combination: Combination,
  limit: number,
) {
  const sortField = `combinations.${combination}`;

  return ExamScoreModel.find({
    [sortField]: { $exists: true, $ne: null },
  })
    .select({ _id: 0, sbd: 1, combinations: 1 })
    .sort({ [sortField]: -1, sbd: 1 })
    .limit(limit)
    .lean();
}
