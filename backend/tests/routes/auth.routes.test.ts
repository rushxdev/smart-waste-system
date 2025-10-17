import { describe, expect, it } from '@jest/globals';

describe("Auth Routes", () => {
  it("should export auth routes module", () => {
    const authRoutes = require("../../src/routes/auth.routes");
    expect(authRoutes.default).toBeDefined();
  });
});
