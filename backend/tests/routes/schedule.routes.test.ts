import { describe, expect, it } from '@jest/globals';

describe("Schedule Routes", () => {
  it("should export schedule routes module", () => {
    const scheduleRoutes = require("../../src/routes/schedule.routes");
    expect(scheduleRoutes.default).toBeDefined();
  });
});
