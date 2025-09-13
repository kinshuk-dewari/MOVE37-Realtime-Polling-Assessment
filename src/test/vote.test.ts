jest.setTimeout(15000);
import request from "supertest";
import app from "../app";
import { getAuthToken } from "./setup";

describe("Vote API (protected + multi-case)", () => {
  let token: string;
  let pollId: number;
  let optionId: number;

  beforeAll(async () => {
    const auth = await getAuthToken();
    token = auth.token;

    // create a poll and capture an option id
    const pollRes = await request(app)
      .post("/api/polls")
      .set("Authorization", `Bearer ${token}`)
      .send({
        question: "Best backend framework?",
        options: ["Express", "Django", "Spring"],
      });

    expect(pollRes.status).toBe(201);
    pollId = pollRes.body.id;
    optionId = pollRes.body.options[0].id;
  });

  it("casts a valid vote and returns 201", async () => {
    const res = await request(app)
      .post("/api/votes")
      .set("Authorization", `Bearer ${token}`)
      .send({ pollId, optionId });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  it("prevents duplicate vote for same option (409)", async () => {
    const res = await request(app)
      .post("/api/votes")
      .set("Authorization", `Bearer ${token}`)
      .send({ pollId, optionId });

    expect(res.status).toBe(409);
  });

  it("returns 400 if option does not belong to poll", async () => {
    const res = await request(app)
      .post("/api/votes")
      .set("Authorization", `Bearer ${token}`)
      .send({ pollId, optionId: 999999 });

    expect(res.status).toBe(400);
  });

  it("returns 404 if poll does not exist", async () => {
    const res = await request(app)
      .post("/api/votes")
      .set("Authorization", `Bearer ${token}`)
      .send({ pollId: 999999, optionId });

    expect(res.status).toBe(404);
  });

  it("returns 401 when not authenticated", async () => {
    const res = await request(app).post("/api/votes").send({ pollId, optionId });
    expect(res.status).toBe(401);
  });
});
