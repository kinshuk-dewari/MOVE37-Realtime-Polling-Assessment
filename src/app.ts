import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRouter from "./routes";

// loading teh enviromnet variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// mounting api routes under /api
app.use("/api", apiRouter);

export default app;
