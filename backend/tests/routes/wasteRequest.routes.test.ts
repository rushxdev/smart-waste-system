import { describe, expect, it } from '@jest/globals';

describe("WasteRequest Routes", () => {
  it("should export waste request routes module", () => {
    const wasteRequestRoutes = require("../../src/routes/wasteRequest.routes");
    expect(wasteRequestRoutes.default).toBeDefined();
  });
});
