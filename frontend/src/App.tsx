import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./app/AuthContext";
import ProtectedRoute from "./features/auth/ProtectedRoute";

import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import ManagerDashboard from "./features/waste/ManagerDashboard";
import CollectorDashboard from "./features/waste/CollectionDashboard";
import ResidentDashboard from "./features/waste/ResidentDashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManagerDashboard />
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
              // <ProtectedRoute allowedRoles={["resident"]}>
                <ResidentDashboard />
              // </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
