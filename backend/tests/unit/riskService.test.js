import { describe, it, expect } from "vitest";
import { computeAllRisks } from "../../services/riskService.js";

describe("riskService", () => {
  it("gives 0 risk for Done task", () => {
    const tasks = [
      { _id: "1", status: "Done", dependencies: [], dueDate: null },
    ];
    const risks = computeAllRisks(tasks);
    expect(risks[0].riskScore).toBe(0);
  });

  it("caps risk at 100", () => {
    const tasks = [
      {
        _id: "1",
        status: "Blocked",
        dependencies: ["2", "3", "4", "5", "6"],
        dueDate: new Date(),
      },
      { _id: "2", status: "Not Started", dependencies: [], dueDate: null },
      { _id: "3", status: "Not Started", dependencies: [], dueDate: null },
      { _id: "4", status: "Not Started", dependencies: [], dueDate: null },
      { _id: "5", status: "Not Started", dependencies: [], dueDate: null },
      { _id: "6", status: "Not Started", dependencies: [], dueDate: null },
    ];
    const risks = computeAllRisks(tasks);
    expect(risks[0].riskScore).toBeLessThanOrEqual(100);
  });
});
