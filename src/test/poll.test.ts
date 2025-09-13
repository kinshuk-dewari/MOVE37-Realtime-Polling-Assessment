jest.setTimeout(15000);
import request from "supertest";
import app from "../app";
import { getAuthToken } from "./setup";

describe("Poll API (multi-case)", () => {
  let token: string;
  let pollId: number;

  beforeAll(async () => {
    const auth = await getAuthToken();
    token = auth.token;
  });

  it("creates a poll with multiple options", async () => {
    const res = await request(app)
      .post("/api/polls")
      .set("Authorization", `Bearer ${token}`)
      .send({
        question: "What is my name bro",
        options: ["Kinshuk", "Huttu", "Dhondu"],
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(Array.isArray(res.body.options)).toBe(true);
    pollId = res.body.id;
  });

  it("fails to create poll without options", async () => {
    const res = await request(app)
      .post("/api/polls")
      .set("Authorization", `Bearer ${token}`)
      .send({ question: "Invalid poll" });

    expect(res.status).toBe(400);
  });

  it("fetches all polls", async () => {
    const res = await request(app)
      .get("/api/polls")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("fetches a single poll by id", async () => {
    const res = await request(app)
      .get(`/api/polls/${pollId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", pollId);
  });

  it("returns 404 for non-existent poll", async () => {
    const res = await request(app)
      .get("/api/polls/999999")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
