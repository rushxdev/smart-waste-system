import { describe, expect, it } from '@jest/globals';

describe("User Routes", () => {
  it("should export user routes module", () => {
    const userRoutes = require("../../src/routes/user.routes");
    expect(userRoutes.default).toBeDefined();
  });
});
