import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { broadcastPollUpdate } from "../websocket/socket";

const prisma = new PrismaClient();

export const castVote = async (req: Request, res: Response) => {
  try {
    const { pollId, optionId } = req.body;
    const userId = (req as any).user.id;

    // checking for empty field
    if (!pollId || !optionId) {
      return res.status(400).json({ error: "pollId and optionId required" });
    }

    // Ensure poll exists
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: { options: true },
    });
    if (!poll) return res.status(404).json({ error: "Poll not found" });

    // Ensure the option belongs to this poll
    const option = poll.options.find((o) => o.id === optionId);
    if (!option) {
      return res
        .status(400)
        .json({ error: "Option does not belong to this poll" });
    }

    // Record vote (will fail if duplicate due to Prisma constraint)
    const vote = await prisma.vote.create({
      data: {
        user: { connect: { id: userId } },
        pollOption: { connect: { id: optionId } },
      },
    });

    // Fetch updated results
    const pollWithCounts = await prisma.poll.findUnique({
      where: { id: pollId },
      include: { options: { include: { votes: true } } },
    });

    if (pollWithCounts) {
      const payload = {
        id: pollWithCounts.id,
        question: pollWithCounts.question,
        options: pollWithCounts.options.map((o) => ({
          id: o.id,
          text: o.text,
          voteCount: o.votes.length,
        })),
      };

      // broadcasting the polls tracking through websocket
      broadcastPollUpdate(pollWithCounts.id, payload);
    }

    res.status(201).json(vote);
  } catch (err: any) {
    if (err?.meta?.target) {
      return res
        .status(409)
        .json({ error: "User has already voted for this option" });
    }
    res.status(400).json({ error: err.message });
  }
};
