jest.setTimeout(15000);
import request from "supertest";
import app from "../app";
import { getAuthToken } from "./setup";

describe("Poll API (multi-case)", () => {
  let token: string;
  let pollId: number;

  // Before all tests → authenticate and create a poll to test against
  beforeAll(async () => {
    // Get a JWT token from test setup
    const auth = await getAuthToken();
    token = auth.token;
  });

  // test for creating a poll with multiple options
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
  
  // test for creating a poll without options
  it("fails to create poll without options", async () => {
    const res = await request(app)
    .post("/api/polls")
    .set("Authorization", `Bearer ${token}`)
    .send({ question: "Invalid poll" });
    
    expect(res.status).toBe(400);
  });
  
  // test for fetching all the polls
  it("fetches all polls", async () => {
    const res = await request(app)
    .get("/api/polls")
    .set("Authorization", `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  
  // test for fetching a poll by id
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
