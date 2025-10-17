import { AuthController } from "../../src/controllers/auth.controller";
import { AuthService } from "../../src/services/auth.service";
import type { Request, Response } from "express";
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

// Mock the AuthService
jest.mock("../../src/services/auth.service");
jest.mock("../../src/repositories/user.repository");

describe("AuthController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });

    mockRequest = {
      body: {}
    };

    mockResponse = {
      status: mockStatus,
      json: mockJson
    };

    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register user and return 201", async () => {
      const registerData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        role: "resident"
      };

      const mockUser = {
        id: "user123",
        name: "John Doe",
        email: "john@example.com",
        role: "resident"
      };

      mockRequest.body = registerData;
      (AuthService.prototype.register as jest.Mock).mockResolvedValue(mockUser);

      await AuthController.register(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockUser);
    });

    it("should return 400 on registration error", async () => {
      mockRequest.body = { name: "Test", email: "test@example.com", password: "pass" };
      (AuthService.prototype.register as jest.Mock).mockRejectedValue(new Error("Email already registered"));

      await AuthController.register(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ message: "Email already registered" });
    });
  });

  describe("login", () => {
    it("should login user and return 200 with token", async () => {
      const loginData = {
        email: "john@example.com",
        password: "password123"
      };

      const mockLoginResponse = {
        token: "jwt-token",
        user: {
          id: "user123",
          name: "John Doe",
          email: "john@example.com",
          role: "resident"
        }
      };

      mockRequest.body = loginData;
      (AuthService.prototype.login as jest.Mock).mockResolvedValue(mockLoginResponse);

      await AuthController.login(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockLoginResponse);
    });

    it("should return 401 on invalid credentials", async () => {
      mockRequest.body = { email: "wrong@example.com", password: "wrongpass" };
      (AuthService.prototype.login as jest.Mock).mockRejectedValue(new Error("Invalid credentials"));

      await AuthController.login(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({ message: "Invalid credentials" });
    });
  });
});
