import { describe, expect, it } from '@jest/globals';

describe("Payment Routes", () => {
  it("should export payment routes module", () => {
    const paymentRoutes = require("../../src/routes/payment.routes");
    expect(paymentRoutes.default).toBeDefined();
  });
});
