import { Response,Request } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middlewares/authMiddleware"; // import your type

const prisma = new PrismaClient();

// ✅ Use AuthRequest instead of Request
export const createPoll = async (req: AuthRequest, res: Response) => {
  try {
    const { question, options, isPublished } = req.body;
    const creatorId = req.user?.id; // ✅ now TS knows user exists

    if (!question || !creatorId || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: "question and options (>=2) required" });
    }

    const poll = await prisma.poll.create({
      data: {
        question,
        isPublished: !!isPublished,
        creator: { connect: { id: creatorId } },
        options: {
          create: options.map((opt: any) =>
            typeof opt === "string" ? { text: opt } : { text: opt.text }
          ),
        },
      },
      include: { options: true },
    });

    res.status(201).json(poll);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getPollsById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const poll = await prisma.poll.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        options: { include: { votes: { select: { id: true, userId: true } } } },
      },
    });

    if (!poll) return res.status(404).json({ error: "Poll not found" });

    const transformed = {
      ...poll,
      options: poll.options.map((opt) => ({
        id: opt.id,
        text: opt.text,
        voteCount: opt.votes.length,
      })),
    };

    res.json(transformed);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getPolls = async (_req: Request, res: Response) => {
  try {
    const polls = await prisma.poll.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        options: { include: { votes: true } },
        creator: { select: { id: true, name: true } },
      },
    });

    const transformed = polls.map((p) => ({
      id: p.id,
      question: p.question,
      isPublished: p.isPublished,
      createdAt: p.createdAt,
      creator: p.creator,
      options: p.options.map((o) => ({
        id: o.id,
        text: o.text,
        voteCount: o.votes.length,
      })),
    }));

    res.json(transformed);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
