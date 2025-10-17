import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./app/AuthContext";
import ProtectedRoute from "./features/auth/ProtectedRoute";

import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import ManagerDashboard from "./features/waste/ManagerDashboard";
import ScheduleSelectedRequests from "./features/waste/components/ScheduleSelectedRequests";
import { NavigationLayout } from "./components/navigation/NavigationLayout";
import CollectorDashboard from "./features/waste/CollectionDashboard";
import ResidentDashboard from "./features/waste/ResidentDashboard";
import { TrackPickupView } from "./features/waste/components/TrackPickupView";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/manager"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/schedule-requests"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <NavigationLayout userRole="manager">
                  <ScheduleSelectedRequests />
                </NavigationLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/collector"
            element={
              <ProtectedRoute allowedRoles={["collector"]}>
                <CollectorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/resident"
            element={
              <ProtectedRoute allowedRoles={["resident"]}>
                <ResidentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/resident/track-pickup/:requestId"
            element={
              <ProtectedRoute allowedRoles={["resident"]}>
                <NavigationLayout userRole="resident">
                  <TrackPickupView />
                </NavigationLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
