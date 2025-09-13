import { Router } from "express";
import { createPoll, getPolls, getPollsById } from "../controllers/pollController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// endpoint for creating a poll
router.post("/", authMiddleware, createPoll);

// endpoint for getting all the polls
router.get("/", authMiddleware, getPolls);

// endpoint for getting a poll by pollId
router.get("/:id", authMiddleware, getPollsById);

export default router;
