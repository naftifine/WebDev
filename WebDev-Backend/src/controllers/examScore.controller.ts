import type { Request, Response } from "express";

import {
  findExamScoreBySbd,
  findSubjectStatistics,
  findTopExamScores,
  parseCombination,
} from "../services/examScore.service.js";

type ExamScoreRequestBody = {
  sbd?: unknown;
};

type RankingsRequestBody = {
  combination?: unknown;
  limit?: unknown;
};

export async function getExamScoreBySbd(
  req: Request<{}, {}, ExamScoreRequestBody>,
  res: Response,
): Promise<void> {
  const sbdParam = req.body?.sbd;
  const sbd = typeof sbdParam === "string" ? sbdParam.trim() : "";

  if (!sbd) {
    res.status(400).json({ message: "SBD is required" });
    return;
  }

  const examScore = await findExamScoreBySbd(sbd);

  if (!examScore) {
    res.status(404).json({ message: "Exam score not found" });
    return;
  }

  res.json({ data: examScore });
}

export async function getSubjectStatistics(
  _req: Request,
  res: Response,
): Promise<void> {
  const statistics = await findSubjectStatistics();

  if (!statistics) {
    res.status(404).json({ message: "Subject statistics not found" });
    return;
  }

  res.json({ data: statistics });
}

export async function getTopExamScores(
  req: Request<{}, {}, RankingsRequestBody>,
  res: Response,
): Promise<void> {
  const combinationValue = req.body?.combination;
  const combination =
    typeof combinationValue === "string"
      ? parseCombination(combinationValue)
      : undefined;
  const limitParam = req.body?.limit;

  if (!combination) {
    res.status(400).json({
      message: "Combination must be either a00 or a01",
    });
    return;
  }

  const limit = limitParam === undefined ? 10 : Number(limitParam);
  if (!Number.isInteger(limit) || ![10, 100].includes(limit)) {
    res.status(400).json({ message: "Limit must be either 10 or 100" });
    return;
  }

  const scores = await findTopExamScores(combination, limit);

  res.json({
    data: scores,
    combination,
    limit,
  });
}
