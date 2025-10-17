import { UserRepository } from "../../src/repositories/user.repository";
import User, { type IUser } from "../../src/models/user.model";
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

// Mock the User model
jest.mock("../../src/models/user.model");

describe("UserRepository", () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create and save a new user", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "hashed123",
        role: "resident"
      };

      const mockSavedUser = {
        _id: "user123",
        ...userData,
        save: jest.fn()
      } as unknown as IUser;

      const mockSave = jest.fn().mockResolvedValue(mockSavedUser);
      (User as unknown as jest.Mock).mockImplementation(() => ({
        ...mockSavedUser,
        save: mockSave
      }));

      const result = await userRepository.create(userData);

      expect(User).toHaveBeenCalledWith(userData);
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(mockSavedUser);
    });
  });

  describe("findByEmail", () => {
    it("should find user by email", async () => {
      const mockUser = {
        _id: "user123",
        email: "john@example.com",
        name: "John Doe"
      } as IUser;

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.findByEmail("john@example.com");

      expect(User.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
      expect(result).toEqual(mockUser);
    });

    it("should return null when user not found", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const result = await userRepository.findByEmail("notfound@example.com");

      expect(result).toBeNull();
    });
  });

  describe("findById", () => {
    it("should find user by ID", async () => {
      const mockUser = {
        _id: "user123",
        email: "john@example.com",
        name: "John Doe"
      } as IUser;

      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      const result = await userRepository.findById("user123");

      expect(User.findById).toHaveBeenCalledWith("user123");
      expect(result).toEqual(mockUser);
    });

    it("should return null when user ID not found", async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      const result = await userRepository.findById("nonexistent");

      expect(result).toBeNull();
    });
  });
});
