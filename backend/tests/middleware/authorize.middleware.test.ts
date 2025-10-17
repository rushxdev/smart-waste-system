import { authorize } from "../../src/middleware/authorize.middleware";
import type { AuthRequest } from "../../src/middleware/auth.middleware";
import type { Response, NextFunction } from "express";
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

describe("Authorize Middleware", () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock<NextFunction>;

  beforeEach(() => {
    mockRequest = {};

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  describe("authorize with single role", () => {
    it("should allow access when user has the required role", () => {
      mockRequest.user = {
        sub: "user123",
        role: "manager",
        email: "manager@example.com"
      };

      const middleware = authorize("manager");
      middleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it("should return 403 when user does not have the required role", () => {
      mockRequest.user = {
        sub: "user123",
        role: "resident",
        email: "resident@example.com"
      };

      const middleware = authorize("manager");
      middleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden: insufficient role" });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 401 when user is not authenticated", () => {
      mockRequest.user = undefined;

      const middleware = authorize("manager");
      middleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Not authenticated" });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("authorize with multiple roles (array)", () => {
    it("should allow access when user has one of the allowed roles", () => {
      mockRequest.user = {
        sub: "user123",
        role: "collector",
        email: "collector@example.com"
      };

      const middleware = authorize(["manager", "collector"]);
      middleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it("should allow access for first role in array", () => {
      mockRequest.user = {
        sub: "user123",
        role: "manager",
        email: "manager@example.com"
      };

      const middleware = authorize(["manager", "collector", "resident"]);
      middleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should allow access for last role in array", () => {
      mockRequest.user = {
        sub: "user123",
        role: "resident",
        email: "resident@example.com"
      };

      const middleware = authorize(["manager", "collector", "resident"]);
      middleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should return 403 when user does not have any of the allowed roles", () => {
      mockRequest.user = {
        sub: "user123",
        role: "resident",
        email: "resident@example.com"
      };

      const middleware = authorize(["manager", "collector"]);
      middleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden: insufficient role" });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 401 when user is not authenticated with multiple roles", () => {
      mockRequest.user = undefined;

      const middleware = authorize(["manager", "collector"]);
      middleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Not authenticated" });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("edge cases", () => {
    it("should handle empty roles array", () => {
      mockRequest.user = {
        sub: "user123",
        role: "manager",
        email: "manager@example.com"
      };

      const middleware = authorize([]);
      middleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden: insufficient role" });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should be case-sensitive for role matching", () => {
      mockRequest.user = {
        sub: "user123",
        role: "Manager",
        email: "manager@example.com"
      };

      const middleware = authorize("manager");
      middleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden: insufficient role" });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should handle user object without role property", () => {
      mockRequest.user = {
        sub: "user123",
        email: "user@example.com"
      } as any;

      const middleware = authorize("manager");
      middleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Forbidden: insufficient role" });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should handle null user", () => {
      mockRequest.user = null as any;

      const middleware = authorize("manager");
      middleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "Not authenticated" });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("all role combinations", () => {
    it("should work for manager role only", () => {
      mockRequest.user = {
        sub: "user123",
        role: "manager",
        email: "manager@example.com"
      };

      const middleware = authorize("manager");
      middleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should work for collector role only", () => {
      mockRequest.user = {
        sub: "user123",
        role: "collector",
        email: "collector@example.com"
      };

      const middleware = authorize("collector");
      middleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should work for resident role only", () => {
      mockRequest.user = {
        sub: "user123",
        role: "resident",
        email: "resident@example.com"
      };

      const middleware = authorize("resident");
      middleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should allow manager and collector access", () => {
      const roles: Array<"manager" | "collector"> = ["manager", "collector"];

      for (const role of roles) {
        jest.clearAllMocks();

        mockRequest.user = {
          sub: `user-${role}`,
          role: role,
          email: `${role}@example.com`
        };

        const middleware = authorize(["manager", "collector"]);
        middleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

        expect(mockNext).toHaveBeenCalled();
        expect(mockResponse.status).not.toHaveBeenCalled();
      }
    });

    it("should deny resident when only manager and collector allowed", () => {
      mockRequest.user = {
        sub: "user123",
        role: "resident",
        email: "resident@example.com"
      };

      const middleware = authorize(["manager", "collector"]);
      middleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("middleware factory pattern", () => {
    it("should create independent middleware instances", () => {
      const managerMiddleware = authorize("manager");
      const collectorMiddleware = authorize("collector");

      mockRequest.user = {
        sub: "user123",
        role: "manager",
        email: "manager@example.com"
      };

      // Manager middleware should pass
      managerMiddleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(1);

      jest.clearAllMocks();

      // Collector middleware should fail
      collectorMiddleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should handle multiple middleware calls with different users", () => {
      const middleware = authorize(["manager", "collector"]);

      // First user - manager (should pass)
      mockRequest.user = {
        sub: "user1",
        role: "manager",
        email: "manager@example.com"
      };

      middleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);
      expect(mockNext).toHaveBeenCalledTimes(1);

      jest.clearAllMocks();

      // Second user - resident (should fail)
      mockRequest.user = {
        sub: "user2",
        role: "resident",
        email: "resident@example.com"
      };

      middleware(mockRequest as AuthRequest, mockResponse as Response, mockNext);
      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
