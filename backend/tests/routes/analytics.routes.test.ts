import { describe, expect, it } from '@jest/globals';

describe("Analytics Routes", () => {
  it("should export analytics routes module", () => {
    const analyticsRoutes = require("../../src/routes/analytics.routes");
    expect(analyticsRoutes.default).toBeDefined();
  });
});
