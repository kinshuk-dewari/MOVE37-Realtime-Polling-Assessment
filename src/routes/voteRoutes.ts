import { Router } from "express";
import { castVote } from "../controllers/voteController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
router.post("/", authMiddleware, castVote);

export default router;
