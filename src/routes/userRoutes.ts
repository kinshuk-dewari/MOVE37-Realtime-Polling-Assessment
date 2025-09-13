import { Router } from "express";
import { login, register } from "../controllers/userController";

const router = Router();

// endpoint for regesting a user
router.post("/register", register);

// endpoint for login
router.post("/login", login);

export default router;
