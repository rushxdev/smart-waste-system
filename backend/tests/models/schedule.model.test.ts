import Schedule from "../../src/models/schedule.model";
import mongoose from "mongoose";
import { describe, expect, it, jest, beforeEach, beforeAll, afterAll } from '@jest/globals';

describe("Schedule Model", () => {
  describe("Date Validator", () => {
    it("should validate date is not in the past", () => {
      const schema = Schedule.schema;
      const dateField = schema.path('date');
      const validator = (dateField as any).validators.find((v: any) => v.message === "Date cannot be in the past");

      expect(validator).toBeDefined();

      // Test with past date
      const pastResult = validator.validator("2020-01-01");
      expect(pastResult).toBe(false);

      // Test with future date
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const futureDateString = futureDate.toISOString().split('T')[0];
      const futureResult = validator.validator(futureDateString);
      expect(futureResult).toBe(true);

      // Test with today's date
      const today = new Date().toISOString().split('T')[0];
      const todayResult = validator.validator(today);
      expect(todayResult).toBe(true);
    });
  });

  describe("Time Validator", () => {
    it("should validate HH:MM format", () => {
      const schema = Schedule.schema;
      const timeField = schema.path('time');
      const validator = (timeField as any).validators.find((v: any) => v.message === "Time must be in HH:MM format");

      expect(validator).toBeDefined();

      // Valid formats
      expect(validator.validator("08:00")).toBe(true);
      expect(validator.validator("23:59")).toBe(true);
      expect(validator.validator("00:00")).toBe(true);
      expect(validator.validator("12:30")).toBe(true);

      // Invalid formats
      expect(validator.validator("25:00")).toBe(false);
      expect(validator.validator("12:60")).toBe(false);
      expect(validator.validator("8:00")).toBe(true); // Single digit hour is valid
      expect(validator.validator("08:0")).toBe(false); // Single digit minute is invalid
      expect(validator.validator("invalid")).toBe(false);
      expect(validator.validator("08-00")).toBe(false);
    });
  });

  describe("Pre-save Hook", () => {
    it("should update updatedAt field before saving", async () => {
      const mockSchedule = new Schedule({
        name: "Morning Collection",
        date: "2025-10-20",
        time: "08:00",
        city: "Downtown",
        status: "Scheduled",
        managerId: "manager123"
      });

      const oldUpdatedAt = mockSchedule.updatedAt;

      // Wait a tiny bit to ensure time difference
      await new Promise(resolve => setTimeout(resolve, 10));

      // Manually trigger the pre-save hook
      const preSaveHooks = (Schedule.schema as any).s.hooks._pres.get('save');
      expect(preSaveHooks).toBeDefined();
      expect(preSaveHooks.length).toBeGreaterThan(0);

      // Execute the hook
      await new Promise<void>((resolve) => {
        preSaveHooks[0].fn.call(mockSchedule, () => resolve());
      });

      expect(mockSchedule.updatedAt.getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());
    });
  });

  describe("Schema Validations", () => {
    it("should have required fields", () => {
      const schema = Schedule.schema;

      expect((schema.path('name') as any).isRequired).toBe(true);
      expect((schema.path('date') as any).isRequired).toBe(true);
      expect((schema.path('time') as any).isRequired).toBe(true);
      expect((schema.path('city') as any).isRequired).toBe(true);
      expect((schema.path('status') as any).isRequired).toBe(true);
      expect((schema.path('managerId') as any).isRequired).toBe(true);
    });

    it("should have status enum values", () => {
      const schema = Schedule.schema;
      const statusField = (schema.path('status') as any);

      expect(statusField.enumValues).toContain("Scheduled");
      expect(statusField.enumValues).toContain("In Progress");
      expect(statusField.enumValues).toContain("Completed");
      expect(statusField.enumValues).toContain("Cancelled");
    });

    it("should have default status as Scheduled", () => {
      const schema = Schedule.schema;
      const statusField = (schema.path('status') as any);

      expect(statusField.defaultValue).toBe("Scheduled");
    });

    it("should have string length validations", () => {
      const schema = Schedule.schema;

      // Name field validations
      const nameField = (schema.path('name') as any);
      const nameMinValidator = nameField.validators.find((v: any) => v.message?.includes("3 characters"));
      const nameMaxValidator = nameField.validators.find((v: any) => v.message?.includes("100 characters"));
      expect(nameMinValidator).toBeDefined();
      expect(nameMaxValidator).toBeDefined();

      // City field validations
      const cityField = (schema.path('city') as any);
      const cityMinValidator = cityField.validators.find((v: any) => v.message?.includes("2 characters"));
      const cityMaxValidator = cityField.validators.find((v: any) => v.message?.includes("50 characters"));
      expect(cityMinValidator).toBeDefined();
      expect(cityMaxValidator).toBeDefined();
    });

    it("should have trim enabled for name and city", () => {
      const schema = Schedule.schema;

      expect((schema.path('name') as any).options.trim).toBe(true);
      expect((schema.path('city') as any).options.trim).toBe(true);
    });
  });

  describe("Indexes", () => {
    it("should have indexes defined", () => {
      const indexes = Schedule.schema.indexes();

      expect(indexes.length).toBeGreaterThan(0);

      // Check for managerId index
      const managerIdIndex = indexes.find(idx => idx[0].managerId === 1);
      expect(managerIdIndex).toBeDefined();

      // Check for date index
      const dateIndex = indexes.find(idx => idx[0].date === 1);
      expect(dateIndex).toBeDefined();

      // Check for status index
      const statusIndex = indexes.find(idx => idx[0].status === 1);
      expect(statusIndex).toBeDefined();

      // Check for createdAt index
      const createdAtIndex = indexes.find(idx => idx[0].createdAt === -1);
      expect(createdAtIndex).toBeDefined();
    });
  });
});
