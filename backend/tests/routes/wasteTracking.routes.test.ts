import { describe, expect, it } from '@jest/globals';

describe("WasteTracking Routes", () => {
  it("should export waste tracking routes module", () => {
    const wasteTrackingRoutes = require("../../src/routes/wasteTracking.routes");
    expect(wasteTrackingRoutes.default).toBeDefined();
  });
});
