import { AuthService } from "../../src/services/auth.service";
import { UserRepository } from "../../src/repositories/user.repository";
import type { IUser } from "../../src/models/user.model";
import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Mock dependencies
jest.mock("../../src/repositories/user.repository");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("AuthService", () => {
  let authService: AuthService;
  let mockRepo: jest.Mocked<UserRepository>;

  // Helper to create mock user
  const createMockUser = (overrides: Partial<IUser> = {}): IUser => {
    return {
      _id: "user123",
      name: "John Doe",
      email: "john@example.com",
      password: "hashedPassword123",
      role: "resident",
      createdAt: new Date("2025-10-01T10:00:00Z"),
      updatedAt: new Date("2025-10-01T10:00:00Z"),
      save: jest.fn(),
      toObject: jest.fn(),
      toJSON: jest.fn(),
      ...overrides,
    } as unknown as IUser;
  };

  beforeEach(() => {
    // Set up environment variables
    process.env.JWT_SECRET = "test-secret-key";
    process.env.JWT_EXPIRES_IN = "7d";
    process.env.BCRYPT_SALT_ROUNDS = "10";

    mockRepo = new UserRepository() as jest.Mocked<UserRepository>;
    authService = new AuthService(mockRepo);
    jest.clearAllMocks();
  });

  describe("register", () => {
    const validRegisterData = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123"
    };

    it("should register a new user successfully", async () => {
      const mockUser = createMockUser();

      mockRepo.findByEmail.mockResolvedValue(null);
      mockRepo.create.mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword123");

      const result = await authService.register(validRegisterData);

      expect(mockRepo.findByEmail).toHaveBeenCalledWith("john@example.com");
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(mockRepo.create).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        password: "hashedPassword123",
        role: "resident"
      });
      expect(result).toEqual({
        id: "user123",
        name: "John Doe",
        email: "john@example.com",
        role: "resident"
      });
    });

    it("should register user with custom role", async () => {
      const mockManager = createMockUser({ role: "manager" });

      mockRepo.findByEmail.mockResolvedValue(null);
      mockRepo.create.mockResolvedValue(mockManager);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword123");

      const result = await authService.register({
        ...validRegisterData,
        role: "manager"
      });

      expect(result.role).toBe("manager");
    });

    it("should throw error when email already exists", async () => {
      const existingUser = createMockUser();
      mockRepo.findByEmail.mockResolvedValue(existingUser);

      await expect(authService.register(validRegisterData)).rejects.toThrow(
        "Email already registered"
      );

      expect(mockRepo.findByEmail).toHaveBeenCalledWith("john@example.com");
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockRepo.create).not.toHaveBeenCalled();
    });

    it("should default to resident role when role not provided", async () => {
      const mockUser = createMockUser({ role: "resident" });

      mockRepo.findByEmail.mockResolvedValue(null);
      mockRepo.create.mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword123");

      const result = await authService.register(validRegisterData);

      expect(result.role).toBe("resident");
    });

    it("should use custom BCRYPT_SALT_ROUNDS from environment", async () => {
      process.env.BCRYPT_SALT_ROUNDS = "12";
      authService = new AuthService(mockRepo);

      const mockUser = createMockUser();
      mockRepo.findByEmail.mockResolvedValue(null);
      mockRepo.create.mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword123");

      await authService.register(validRegisterData);

      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 12);
    });
  });

  describe("login", () => {
    const loginEmail = "john@example.com";
    const loginPassword = "password123";

    it("should login successfully with valid credentials", async () => {
      const mockUser = createMockUser();

      mockRepo.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("mock-jwt-token");

      const result = await authService.login(loginEmail, loginPassword);

      expect(mockRepo.findByEmail).toHaveBeenCalledWith(loginEmail);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginPassword, "hashedPassword123");
      expect(jwt.sign).toHaveBeenCalledWith(
        { sub: "user123", role: "resident", email: "john@example.com" },
        "test-secret-key",
        { expiresIn: "7d" }
      );
      expect(result).toEqual({
        token: "mock-jwt-token",
        user: {
          id: "user123",
          name: "John Doe",
          email: "john@example.com",
          role: "resident"
        }
      });
    });

    it("should throw error when user not found", async () => {
      mockRepo.findByEmail.mockResolvedValue(null);

      await expect(authService.login(loginEmail, loginPassword)).rejects.toThrow(
        "Invalid credentials"
      );

      expect(mockRepo.findByEmail).toHaveBeenCalledWith(loginEmail);
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it("should throw error when password is incorrect", async () => {
      const mockUser = createMockUser();

      mockRepo.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(loginEmail, loginPassword)).rejects.toThrow(
        "Invalid credentials"
      );

      expect(mockRepo.findByEmail).toHaveBeenCalledWith(loginEmail);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginPassword, "hashedPassword123");
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it("should generate token for different user roles", async () => {
      const mockCollector = createMockUser({ role: "collector", _id: "collector123" });

      mockRepo.findByEmail.mockResolvedValue(mockCollector);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("collector-token");

      const result = await authService.login(loginEmail, loginPassword);

      expect(jwt.sign).toHaveBeenCalledWith(
        { sub: "collector123", role: "collector", email: "john@example.com" },
        "test-secret-key",
        { expiresIn: "7d" }
      );
      expect(result.user.role).toBe("collector");
    });
  });

  describe("verifyToken", () => {
    it("should verify valid token successfully", () => {
      const mockPayload = { sub: "user123", role: "resident", email: "john@example.com" };
      (jwt.verify as jest.Mock).mockReturnValue(mockPayload);

      const result = authService.verifyToken("valid-token");

      expect(jwt.verify).toHaveBeenCalledWith("valid-token", "test-secret-key");
      expect(result).toEqual(mockPayload);
    });

    it("should throw error for invalid token", () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      expect(() => authService.verifyToken("invalid-token")).toThrow("Invalid token");
      expect(jwt.verify).toHaveBeenCalledWith("invalid-token", "test-secret-key");
    });

    it("should throw error for expired token", () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Token expired");
      });

      expect(() => authService.verifyToken("expired-token")).toThrow("Token expired");
    });
  });

  describe("Environment validation", () => {
    it("should throw error when JWT_SECRET is not set", () => {
      delete process.env.JWT_SECRET;
      const newService = new AuthService(mockRepo);

      expect(() => (newService as any).getJwtSecret()).toThrow(
        "JWT_SECRET environment variable is not set"
      );
    });

    it("should throw error when JWT_SECRET is empty string", () => {
      process.env.JWT_SECRET = "";
      const newService = new AuthService(mockRepo);

      expect(() => (newService as any).getJwtSecret()).toThrow(
        "JWT_SECRET environment variable is not set"
      );
    });

    it("should use default JWT_EXPIRES_IN when not set", () => {
      delete process.env.JWT_EXPIRES_IN;
      const newService = new AuthService(mockRepo);

      expect((newService as any).getJwtExpiresIn()).toBe("7d");
    });

    it("should use default BCRYPT_SALT_ROUNDS when not set", () => {
      delete process.env.BCRYPT_SALT_ROUNDS;
      const newService = new AuthService(mockRepo);

      expect((newService as any).getSaltRounds()).toBe(10);
    });
  });
});
