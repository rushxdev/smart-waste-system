import { describe, expect, it, beforeEach } from '@jest/globals';

describe("Environment Configuration", () => {
  // Store original environment
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset modules to clear the cached config
    jest.resetModules();
    // Restore original environment
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe("config", () => {
    it("should load config with all required environment variables", () => {
      process.env.JWT_SECRET = "test-secret-key";
      process.env.JWT_EXPIRES_IN = "14d";
      process.env.BCRYPT_SALT_ROUNDS = "12";

      const { config } = require("../../src/config/env");

      expect(config.JWT_SECRET).toBe("test-secret-key");
      expect(config.JWT_EXPIRES_IN).toBe("14d");
      expect(config.BCRYPT_SALT_ROUNDS).toBe(12);
    });

    it("should throw error when JWT_SECRET is not set", () => {
      delete process.env.JWT_SECRET;

      expect(() => {
        require("../../src/config/env");
      }).toThrow("JWT_SECRET environment variable is required");
    });

    it("should use default JWT_EXPIRES_IN when not set", () => {
      process.env.JWT_SECRET = "test-secret";
      delete process.env.JWT_EXPIRES_IN;

      const { config } = require("../../src/config/env");

      expect(config.JWT_EXPIRES_IN).toBe("7d");
    });

    it("should use default BCRYPT_SALT_ROUNDS when not set", () => {
      process.env.JWT_SECRET = "test-secret";
      delete process.env.BCRYPT_SALT_ROUNDS;

      const { config } = require("../../src/config/env");

      expect(config.BCRYPT_SALT_ROUNDS).toBe(10);
    });

    it("should use custom JWT_EXPIRES_IN when set", () => {
      process.env.JWT_SECRET = "test-secret";
      process.env.JWT_EXPIRES_IN = "30d";

      const { config } = require("../../src/config/env");

      expect(config.JWT_EXPIRES_IN).toBe("30d");
    });

    it("should convert BCRYPT_SALT_ROUNDS to number", () => {
      process.env.JWT_SECRET = "test-secret";
      process.env.BCRYPT_SALT_ROUNDS = "15";

      const { config } = require("../../src/config/env");

      expect(config.BCRYPT_SALT_ROUNDS).toBe(15);
      expect(typeof config.BCRYPT_SALT_ROUNDS).toBe("number");
    });

    it("should handle empty JWT_SECRET as missing", () => {
      process.env.JWT_SECRET = "";

      expect(() => {
        require("../../src/config/env");
      }).toThrow("JWT_SECRET environment variable is required");
    });

    it("should export config as const object", () => {
      process.env.JWT_SECRET = "test-secret";

      const { config } = require("../../src/config/env");

      // Verify config is an object with expected properties
      expect(config).toHaveProperty("JWT_SECRET");
      expect(config).toHaveProperty("JWT_EXPIRES_IN");
      expect(config).toHaveProperty("BCRYPT_SALT_ROUNDS");
    });

    it("should handle various JWT_EXPIRES_IN formats", () => {
      const expiryFormats = ["7d", "24h", "60m", "3600s"];

      for (const format of expiryFormats) {
        jest.resetModules();
        process.env.JWT_SECRET = "test-secret";
        process.env.JWT_EXPIRES_IN = format;

        const { config } = require("../../src/config/env");

        expect(config.JWT_EXPIRES_IN).toBe(format);
      }
    });

    it("should handle various BCRYPT_SALT_ROUNDS values", () => {
      const saltRounds = [8, 10, 12, 14];

      for (const rounds of saltRounds) {
        jest.resetModules();
        process.env.JWT_SECRET = "test-secret";
        process.env.BCRYPT_SALT_ROUNDS = rounds.toString();

        const { config } = require("../../src/config/env");

        expect(config.BCRYPT_SALT_ROUNDS).toBe(rounds);
      }
    });
  });
});
