import mongoose from "mongoose";
import connectDB from "../../src/config/db";
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';

// Mock mongoose
jest.mock("mongoose");

describe("Database Configuration", () => {
  let consoleLogSpy: jest.SpiedFunction<typeof console.log>;
  let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;
  let processExitSpy: jest.SpiedFunction<typeof process.exit>;

  beforeEach(() => {
    // Spy on console methods
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    processExitSpy = jest.spyOn(process, 'exit').mockImplementation((code?: string | number | null | undefined) => {
      throw new Error(`process.exit called with code ${code}`);
    }) as unknown as jest.SpiedFunction<typeof process.exit>;

    // Clear all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore all spies
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
  });

  describe("connectDB", () => {
    it("should connect successfully with valid MONGO_URI", async () => {
      const mockUri = "mongodb://localhost:27017/test-db";
      process.env.MONGO_URI = mockUri;

      const mockConnection = {
        connection: {
          host: "localhost"
        }
      };

      (mongoose.connect as jest.Mock).mockResolvedValue(mockConnection);

      await connectDB();

      expect(consoleLogSpy).toHaveBeenCalledWith(
        "Attempting MongoDB connection with URI:",
        expect.stringContaining("mongodb://localhost:")
      );
      expect(mongoose.connect).toHaveBeenCalledWith(mockUri);
      expect(consoleLogSpy).toHaveBeenCalledWith("MongoDB connected: localhost");
    });

    it("should throw error when MONGO_URI is not set", async () => {
      delete process.env.MONGO_URI;

      await expect(async () => {
        await connectDB();
      }).rejects.toThrow("process.exit called with code 1");

      expect(consoleLogSpy).toHaveBeenCalledWith(
        "Attempting MongoDB connection with URI:",
        "undefined"
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "MongoDB connection failed:",
        expect.any(Error)
      );
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it("should handle connection errors and exit process", async () => {
      process.env.MONGO_URI = "mongodb://localhost:27017/test-db";
      const connectionError = new Error("Connection timeout");

      (mongoose.connect as jest.Mock).mockRejectedValue(connectionError);

      await expect(async () => {
        await connectDB();
      }).rejects.toThrow("process.exit called with code 1");

      expect(mongoose.connect).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "MongoDB connection failed:",
        connectionError
      );
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it("should truncate long URIs in log message", async () => {
      const longUri = "mongodb://user:pass@very-long-host-name.example.com:27017/database";
      process.env.MONGO_URI = longUri;

      const mockConnection = {
        connection: {
          host: "very-long-host-name.example.com"
        }
      };

      (mongoose.connect as jest.Mock).mockResolvedValue(mockConnection);

      await connectDB();

      expect(consoleLogSpy).toHaveBeenCalledWith(
        "Attempting MongoDB connection with URI:",
        "mongodb://user:pass@..."
      );
    });

    it("should handle empty MONGO_URI", async () => {
      process.env.MONGO_URI = "";

      await expect(async () => {
        await connectDB();
      }).rejects.toThrow("process.exit called with code 1");

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "MongoDB connection failed:",
        expect.objectContaining({
          message: "MONGO_URI environment variable is not set"
        })
      );
    });

    it("should connect with different host names", async () => {
      const hosts = ["cluster0.mongodb.net", "localhost", "192.168.1.100"];

      for (const host of hosts) {
        process.env.MONGO_URI = `mongodb://${host}:27017/db`;

        const mockConnection = {
          connection: { host }
        };

        (mongoose.connect as jest.Mock).mockResolvedValue(mockConnection);

        await connectDB();

        expect(consoleLogSpy).toHaveBeenCalledWith(`MongoDB connected: ${host}`);
        jest.clearAllMocks();
      }
    });
  });
});
