import { UserController } from "../../src/controllers/user.controller";
import User from "../../src/models/user.model";
import type { Request, Response } from "express";
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

// Mock the User model
jest.mock("../../src/models/user.model");

describe("UserController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });

    mockRequest = {
      query: {}
    };

    mockResponse = {
      status: mockStatus,
      json: mockJson
    };

    jest.clearAllMocks();
  });

  describe("listByRole", () => {
    it("should return all users when no role filter is provided", async () => {
      const mockUsers = [
        { _id: "user1", name: "John Doe", role: "collector" },
        { _id: "user2", name: "Jane Smith", role: "resident" }
      ];

      mockRequest.query = {};

      (User.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(mockUsers)
        })
      });

      await UserController.listByRole(mockRequest as Request, mockResponse as Response);

      expect(User.find).toHaveBeenCalledWith({});
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockUsers);
    });

    it("should return filtered users by role when role is provided", async () => {
      const mockCollectors = [
        { _id: "user1", name: "John Doe", role: "collector" },
        { _id: "user2", name: "Bob Johnson", role: "collector" }
      ];

      mockRequest.query = { role: "collector" };

      (User.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(mockCollectors)
        })
      });

      await UserController.listByRole(mockRequest as Request, mockResponse as Response);

      expect(User.find).toHaveBeenCalledWith({ role: "collector" });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockCollectors);
    });

    it("should return 500 on database error", async () => {
      mockRequest.query = { role: "collector" };

      (User.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          lean: jest.fn().mockRejectedValue(new Error("Database error"))
        })
      });

      // Mock console.error to avoid cluttering test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await UserController.listByRole(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ message: "Failed to fetch users" });

      consoleSpy.mockRestore();
    });
  });
});
