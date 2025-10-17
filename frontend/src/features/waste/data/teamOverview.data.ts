import type { Collector, TabConfig } from "../types/teamOverview.types";

// Mock data for Team Overview (Data Layer - Dependency Inversion Principle)
export const mockCollectors: Collector[] = [
  { id: 1, name: "John Smith", zone: "Zone A", status: "Active", collections: 15, rating: 4.8 },
  { id: 2, name: "Sarah Johnson", zone: "Zone B", status: "Active", collections: 12, rating: 4.6 },
  { id: 3, name: "Mike Wilson", zone: "Zone C", status: "On Break", collections: 8, rating: 4.9 },
  { id: 4, name: "Emily Davis", zone: "Zone A", status: "Active", collections: 18, rating: 4.7 },
];

export const tabs: TabConfig[] = [
  { id: "collectors", label: "Collectors", icon: "👥" },
  { id: "routes", label: "Schedules", icon: "🗺️" },
];