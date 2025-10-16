import React, { useState, useEffect } from "react";
import type { NewSchedule } from "../types/teamOverview.types";
import { CollectorsTable } from "./CollectorsTable";
import { SchedulesTable } from "./SchedulesTable";
import { ScheduleModal } from "./ScheduleModal";
import { TabNavigation } from "./TabNavigation";
import { mockCollectors, tabs } from "../data/teamOverview.data";
import { ScheduleService, type Schedule } from "../../../services/scheduleService";

// Team Overview Component (Single Responsibility: Coordinate team overview display)
export const TeamOverviewView: React.FC = () => {
  const [activeTab, setActiveTab] = useState("collectors");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  // Load schedules when component mounts or when switching to schedules tab
  useEffect(() => {
    if (activeTab === "routes") {
      loadSchedules();
    }
  }, [activeTab]);

  const loadSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      const schedulesData = await ScheduleService.getAllSchedules();
      setSchedules(schedulesData);
    } catch (err: any) {
      setError(err.message || "Failed to load schedules");
      console.error("Error loading schedules:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedule = () => {
    setShowScheduleModal(true);
  };

  const handleSaveSchedule = async (schedule: NewSchedule) => {
    try {
      setError(null);
      
      if (editingSchedule) {
        // Update existing schedule
        const updatedSchedule = await ScheduleService.updateSchedule(editingSchedule._id, schedule);
        
        // Update the schedule in local state
        setSchedules(prev => prev.map(s => s._id === editingSchedule._id ? updatedSchedule : s));
        
        console.log("Schedule updated successfully:", updatedSchedule);
      } else {
        // Create new schedule
        const newSchedule = await ScheduleService.createSchedule(schedule);
        
        // Add the new schedule to the local state
        setSchedules(prev => [...prev, newSchedule]);
        
        console.log("Schedule created successfully:", newSchedule);
      }
      
      // Close the modal and reset editing state
      setShowScheduleModal(false);
      setEditingSchedule(null);
      
    } catch (err: any) {
      setError(err.message || (editingSchedule ? "Failed to update schedule" : "Failed to create schedule"));
      console.error("Error saving schedule:", err);
      // Don't close the modal so user can fix the error
    }
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setShowScheduleModal(true);
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!window.confirm("Are you sure you want to delete this schedule? This action cannot be undone.")) {
      return;
    }

    try {
      setError(null);
      await ScheduleService.deleteSchedule(scheduleId);
      
      // Remove the schedule from local state
      setSchedules(prev => prev.filter(s => s._id !== scheduleId));
      
      console.log("Schedule deleted successfully");
    } catch (err: any) {
      setError(err.message || "Failed to delete schedule");
      console.error("Error deleting schedule:", err);
    }
  };

  const handleCloseModal = () => {
    setShowScheduleModal(false);
    setEditingSchedule(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Team Overview 👨
        </h1>
        <p className="text-gray-600">
          Monitor and manage your collection team and schedule.
        </p>
      </div>

      {/* Tab Navigation */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      {activeTab === "collectors" && (
        <CollectorsTable collectors={mockCollectors} />
      )}

      {activeTab === "routes" && (
        <div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading schedules...</p>
            </div>
          ) : (
            <SchedulesTable
              schedules={schedules}
              onCreateSchedule={handleCreateSchedule}
              onEditSchedule={handleEditSchedule}
              onDeleteSchedule={handleDeleteSchedule}
            />
          )}
        </div>
      )}

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={showScheduleModal}
        onClose={handleCloseModal}
        onSave={handleSaveSchedule}
        editingSchedule={editingSchedule}
      />
    </div>
  );
};