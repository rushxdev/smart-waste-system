import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./app/AuthContext";
import ProtectedRoute from "./features/auth/ProtectedRoute";

import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import ManagerDashboard from "./features/waste/ManagerDashboard";
import CollectorDashboard from "./features/waste/CollectionDashboard";
import ResidentDashboard from "./features/waste/ResidentDashboard";

import AddCard from "./features/payment/AddCard";
import PricingSummary from "./features/payment/PricingSummary";

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

          <Route
           path="/resident/add-card"
           element={
           <ProtectedRoute allowedRoles={["resident"]}>
            <AddCard />
           </ProtectedRoute>
          } />
          
          <Route
           path="/resident/pricing-summary"
           element={
            <ProtectedRoute allowedRoles={["resident"]}>
            <PricingSummary />
           </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
