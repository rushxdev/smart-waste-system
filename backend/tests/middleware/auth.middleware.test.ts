import { authenticate, type AuthRequest } from "../../src/middleware/auth.middleware";
import type { Response, NextFunction } from "express";
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import jwt from "jsonwebtoken";

// Mock jwt
jest.mock("jsonwebtoken");

describe("Auth Middleware", () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock<NextFunction>;

  beforeEach(() => {
    // Set up environment
    process.env.JWT_SECRET = "test-secret-key";

    // Reset mocks
    mockRequest = {
      headers: {}
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  describe("authenticate", () => {
    it("should authenticate successfully with valid token", () => {
      const mockPayload = {
        sub: "user123",
        role: "resident",
        email: "user@example.com"
      };

      mockRequest.headers = {
        authorization: "Bearer valid-token-123"
      };

      (jwt.verify as jest.Mock).mockReturnValue(mockPayload);

      authenticate(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith("valid-token-123", "test-secret-key");
      expect((mockRequest as AuthRequest).user).toEqual({
        sub: "user123",
        role: "resident",
        email: "user@example.com"
      });
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it("should return 401 when authorization header is missing", () => {
      mockRequest.headers = {};

      authenticate(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Missing token" });
      expect(mockNext).not.toHaveBeenCalled();
      expect(jwt.verify).not.toHaveBeenCalled();
    });

    it("should return 401 when authorization header does not start with Bearer", () => {
      mockRequest.headers = {
        authorization: "Basic some-token"
      };

      authenticate(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Missing token" });
      expect(mockNext).not.toHaveBeenCalled();
      expect(jwt.verify).not.toHaveBeenCalled();
    });

    it("should return 401 when token is empty after Bearer", () => {
      mockRequest.headers = {
        authorization: "Bearer "
      };

      authenticate(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Invalid token format" });
      expect(mockNext).not.toHaveBeenCalled();
      expect(jwt.verify).not.toHaveBeenCalled();
    });

    it("should return 401 when JWT verification fails", () => {
      mockRequest.headers = {
        authorization: "Bearer invalid-token"
      };

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      authenticate(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith("invalid-token", "test-secret-key");
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Invalid token" });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 401 when JWT is expired", () => {
      mockRequest.headers = {
        authorization: "Bearer expired-token"
      };

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("jwt expired");
      });

      authenticate(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Invalid token" });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should handle different user roles", () => {
      const roles = ["resident", "collector", "manager"];

      for (const role of roles) {
        jest.clearAllMocks();

        const mockPayload = {
          sub: `user-${role}`,
          role: role,
          email: `${role}@example.com`
        };

        mockRequest.headers = {
          authorization: `Bearer ${role}-token`
        };

        (jwt.verify as jest.Mock).mockReturnValue(mockPayload);

        authenticate(mockRequest as AuthRequest, mockResponse as Response, mockNext);

        expect((mockRequest as AuthRequest).user?.role).toBe(role);
        expect(mockNext).toHaveBeenCalled();
      }
    });

    it("should extract user data with additional fields", () => {
      const mockPayload = {
        sub: "user123",
        role: "resident",
        email: "user@example.com",
        extraField: "extra-value",
        anotherField: 123
      };

      mockRequest.headers = {
        authorization: "Bearer valid-token"
      };

      (jwt.verify as jest.Mock).mockReturnValue(mockPayload);

      authenticate(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect((mockRequest as AuthRequest).user).toEqual({
        sub: "user123",
        role: "resident",
        email: "user@example.com"
      });
    });

    it("should handle token without email field", () => {
      const mockPayload = {
        sub: "user123",
        role: "resident"
      };

      mockRequest.headers = {
        authorization: "Bearer valid-token"
      };

      (jwt.verify as jwt.Mock).mockReturnValue(mockPayload);

      authenticate(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect((mockRequest as AuthRequest).user).toEqual({
        sub: "user123",
        role: "resident",
        email: undefined
      });
      expect(mockNext).toHaveBeenCalled();
    });

    it("should handle malformed authorization header", () => {
      mockRequest.headers = {
        authorization: "BearerToken"
      };

      authenticate(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Missing token" });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should handle case-sensitive Bearer keyword", () => {
      mockRequest.headers = {
        authorization: "bearer valid-token"
      };

      authenticate(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Missing token" });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("verifyJWT function", () => {
    it("should throw error when JWT_SECRET is not set", () => {
      delete process.env.JWT_SECRET;

      mockRequest.headers = {
        authorization: "Bearer valid-token"
      };

      authenticate(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Invalid token" });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should throw error when JWT_SECRET is empty", () => {
      process.env.JWT_SECRET = "";

      mockRequest.headers = {
        authorization: "Bearer valid-token"
      };

      authenticate(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Invalid token" });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
