import { describe, it, expect } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app.js";

describe("integration - approval flow", () => {
  it("creates approval and approves via token link", async () => {
    // you need Mongo running for this test
    const mongoUri =
      process.env.MONGO_URI ||
      "mongodb://127.0.0.1:27017/upstreamPracticalTest";
    await mongoose.connect(mongoUri);

    const createRes = await request(app)
      .post("/api/approvals")
      .send({ title: "Test Approval", approverEmail: "exec@test.com" });

    expect(createRes.status).toBe(201);
    const approveLink = createRes.body.links.approveLink;
    expect(approveLink).toContain("/api/approvals/action?token=");

    const token = decodeURIComponent(approveLink.split("token=")[1]);

    const actionRes = await request(app).get(
      `/api/approvals/action?token=${encodeURIComponent(token)}`,
    );
    expect(actionRes.status).toBe(200);

    const listRes = await request(app).get("/api/approvals");
    const found = listRes.body.find((x) => x.title === "Test Approval");
    expect(found.status).toBe("Approved");

    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });
});
