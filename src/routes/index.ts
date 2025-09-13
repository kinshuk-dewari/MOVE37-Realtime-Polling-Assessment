import { Router } from "express";
import userRoutes from "./userRoutes";
import pollRoutes from "./pollRoutes";
import voteRoutes from "./voteRoutes";

const router = Router();

router.use("/auth", userRoutes);
router.use("/polls", pollRoutes);
router.use("/votes", voteRoutes);

export default router;
