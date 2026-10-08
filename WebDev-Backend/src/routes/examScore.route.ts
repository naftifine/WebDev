import { Router } from "express";

import {
  getExamScoreBySbd,
  getSubjectStatistics,
  getTopExamScores,
} from "../controllers/examScore.controller.js";

const router = Router();

router.post("/exam-scores", getExamScoreBySbd);
router.get("/statistics/subjects", getSubjectStatistics);
router.post("/rankings", getTopExamScores);

export default router;
