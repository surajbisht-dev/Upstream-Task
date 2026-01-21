import { describe, it, expect } from "vitest";
import { checkCycle } from "../../services/dependencyService.js";

describe("dependencyService - cycle detection", () => {
  it("detects a simple cycle", () => {
    const a = { _id: "a", dependencies: ["b"] };
    const b = { _id: "b", dependencies: ["a"] };

    const res = checkCycle([a, b]);
    expect(res.hasCycle).toBe(true);
    expect(res.cycle.length).toBeGreaterThan(0);
  });

  it("no cycle", () => {
    const a = { _id: "a", dependencies: ["b"] };
    const b = { _id: "b", dependencies: [] };

    const res = checkCycle([a, b]);
    expect(res.hasCycle).toBe(false);
  });
});
