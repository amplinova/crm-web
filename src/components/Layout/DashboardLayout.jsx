// src/components/Layout/DashboardLayout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";

const DashboardLayout = ({ onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} />

      {/* Main Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar setSidebarOpen={setSidebarOpen} onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto p-6 transition-colors bg-gray-50 dark:bg-gray-900">
          {/* ✅ All child routes (dashboard, customers, etc.) render here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
