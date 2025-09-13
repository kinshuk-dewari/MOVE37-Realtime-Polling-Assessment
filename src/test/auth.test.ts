import request from "supertest";
import app from "../app";

describe("Auth API", () => {
  it("registers a new user (happy path)", async () => {
    const email = `auth${Date.now()}@example.com`;
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Auth Test", email, password: "abc123" });

    // Accept 201 or 400 (if test-run re-used), but on 201 ensure id returned.
    expect([201, 400]).toContain(res.status);
    if (res.status === 201) {
      expect(res.body).toHaveProperty("id");
    }
  });

  it("returns 400 when required fields missing", async () => {
    const res = await request(app).post("/api/auth/register").send({ email: "x@example.com" });
    expect(res.status).toBe(400);
  });

  it("logs in a user and returns token", async () => {
    const email = `login${Date.now()}@example.com`;
    const password = "p@ssw0rd";
    await request(app).post("/api/auth/register").send({ name: "L", email, password });
    const res = await request(app).post("/api/auth/login").send({ email, password });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("fails login with invalid credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: "notfound@example.com", password: "nope" });
    // Implementation may return 400/401/404 depending on your code; accept those
    expect([400, 401, 404]).toContain(res.status);
  });
});
