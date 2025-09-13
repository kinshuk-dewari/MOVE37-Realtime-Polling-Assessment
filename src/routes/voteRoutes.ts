import { Router } from "express";
import { castVote } from "../controllers/voteController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// endpoint for casting a vote
router.post("/", authMiddleware, castVote);

export default router;
