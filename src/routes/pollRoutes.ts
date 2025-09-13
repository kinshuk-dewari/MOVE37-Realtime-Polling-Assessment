import { Router } from "express";
import { createPoll, getPolls, getPollsById } from "../controllers/pollController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
router.post("/", authMiddleware, createPoll);
router.get("/", authMiddleware, getPolls);
router.get("/:id", authMiddleware, getPollsById);

export default router;
