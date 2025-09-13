import request from "supertest";
import app from "../app";

export const getAuthToken = async () => {
  const email = "polltest@example.com";
  const password = "123456";

  // 1. Register user (ignore if already exists)
  await request(app).post("/api/auth/register").send({
    name: "Poll Tester",
    email,
    password,
  });

  // 2. Login user
  const loginRes = await request(app).post("/api/auth/login").send({
    email,
    password,
  });

  const token = loginRes.body.token;
  const userId = loginRes.body.user?.id || loginRes.body.id;

  return { token, userId };
};
