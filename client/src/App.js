import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { isLoggedIn } from "./utils/auth";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/signin"
          element={
            isLoggedIn() ? <Navigate to="/user-dashboard" /> : <Signin />
          }
        />
        <Route
          path="/signup"
          element={
            isLoggedIn() ? <Navigate to="/user-dashboard" /> : <Signup />
          }
        />

        {/* Protected Routes */}
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
};

export default App;
