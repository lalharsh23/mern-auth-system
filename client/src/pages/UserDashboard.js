import React from "react";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../utils/auth";

const UserDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/signin");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>
      <p className="mb-4">Welcome, User! You are logged in.</p>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default UserDashboard;
