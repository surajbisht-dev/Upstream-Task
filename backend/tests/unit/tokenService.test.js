import { describe, it, expect } from "vitest";
import {
  createActionToken,
  verifyActionToken,
} from "../../services/tokenService.js";

// quick env setup for test
process.env.JWT_SECRET = "testsecret";

describe("tokenService", () => {
  it("creates and verifies token", () => {
    const token = createActionToken({
      approvalId: "abc123",
      action: "approve",
      expiresIn: "1h",
    });
    const payload = verifyActionToken(token);

    expect(payload.rid).toBe("abc123");
    expect(payload.act).toBe("approve");
    expect(payload.typ).toBe("approval-action");
  });
});
