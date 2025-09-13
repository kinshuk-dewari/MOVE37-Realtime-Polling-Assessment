jest.setTimeout(15000);
import request from "supertest";
import app from "../app";
import { getAuthToken } from "./setup";

describe("Vote API (protected + multi-case)", () => {
  let token: string;
  let pollId: number;
  let optionId: number;

  // Before all tests → authenticate and create a poll to test against
  beforeAll(async () => {
    const auth = await getAuthToken();
    token = auth.token;

    // Create a new poll with 3 options
    const pollRes = await request(app)
      .post("/api/polls")
      .set("Authorization", `Bearer ${token}`)
      .send({
        question: "Best backend framework?",
        options: ["Express", "Django", "Spring"],
      });

    expect(pollRes.status).toBe(201);

    // Save pollId and first optionId for later voting tests
    pollId = pollRes.body.id;
    optionId = pollRes.body.options[0].id;
  });

  // Test for casting a vote for the chosen option
  it("casts a valid vote and returns 201", async () => {
    const res = await request(app)
      .post("/api/votes")
      .set("Authorization", `Bearer ${token}`)
      .send({ pollId, optionId });

    expect(res.status).toBe(201);
    // Response should contain a vote id
    expect(res.body).toHaveProperty("id");
  });

  // Test to try voting again for the same option
  it("prevents duplicate vote for same option (409)", async () => {
    const res = await request(app)
      .post("/api/votes")
      .set("Authorization", `Bearer ${token}`)
      .send({ pollId, optionId });

    expect(res.status).toBe(409);
  });

  // Test if a non-existent optionId for the same poll
  it("returns 400 if option does not belong to poll", async () => {
    const res = await request(app)
      .post("/api/votes")
      .set("Authorization", `Bearer ${token}`)
      .send({ pollId, optionId: 696969 });

    expect(res.status).toBe(400);
  });

  // Test for an invalid pollId but a valid optionId
  it("returns 404 if poll does not exist", async () => {
    const res = await request(app)
      .post("/api/votes")
      .set("Authorization", `Bearer ${token}`)
      .send({ pollId: 999999, optionId });

    expect(res.status).toBe(404);
  });

  // Test for voting without sending Authorization header
  it("returns 401 when not authenticated", async () => {
    const res = await request(app).post("/api/votes").send({ pollId, optionId });
    expect(res.status).toBe(401);
  });
});
