import React, { useEffect, useState } from "react";
import useAxios from "../../Auth/useAxios";
import { FiSearch, FiBell, FiUser } from "react-icons/fi";
import {
  FaUsers,
  FaPhone,
  FaChartLine,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import welcomeImg from "../../Assets/dashboard.png";

const Dashboard = () => {
  const api = useAxios();

  const [stats, setStats] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");

  // ----------------------------
  // Load role + ID
  // ----------------------------
  useEffect(() => {
    setUserRole(localStorage.getItem("role") || "");
    setUserId(localStorage.getItem("userId") || "");
  }, []);

  // ----------------------------
  // Fetch Stats
  // ----------------------------
  useEffect(() => {
    if (!userRole) return;
    loadStats();
  }, [userRole]);

  const loadStats = async () => {
    try {
      const url =
        userRole === "ADMIN"
          ? "/api/leads/stats"
          : `/api/leads/stats`;

      const res = await api.get(url);
      setStats(res.data.data);
    } catch (e) {
      console.error("Stats load failed", e);
    }
  };

  // ----------------------------
  // Safe getter (fallback: 0)
  // ----------------------------
  const getStatus = (key) =>
    stats?.leadsByStatus?.[key] !== undefined
      ? stats.leadsByStatus[key]
      : 0;

  const totalLeads = stats?.totalLeads || 0;
  const duplicateLeads = stats?.duplicateLeads || 0;

  // -------------------------------------
  // 🔵 Data Binding
  // -------------------------------------
  const data = {
    header: {
      title: "Dashboard",
      searchPlaceholder: "Search Leads...",
      rightIcons: ["bell", "user"],
    },

    welcomeBoard: {
      title: "Welcome Back!",
      subtitle: userRole === "ADMIN" ? "Admin Dashboard" : "My Dashboard",
      totalLeads: totalLeads,
      transferredLeads: getStatus("TRANSFER_LEADS"),
      buttons: [
        { label: "Allocate Leads", count: getStatus("NEW_LEADS") },
        { label: "Unallocate Leads", count: getStatus("PENDING_LEADS") },
        { label: "Not Reachable", count: getStatus("NOT_PICKED_LEADS") },
        { label: "Wrong Number", count: getStatus("OTHERS") },
        { label: "Channel Partner", count: 0 },
        { label: "Not Interested", count: getStatus("CANCELLED") },
        { label: "Future Lead", count: getStatus("PROCESSING_LEADS") },
        { label: "Lost", count: getStatus("CANCELLED") },
      ],
    },

    rightSideCards: [
      { label: "New Leads", count: getStatus("NEW_LEADS"), icon: <FaUsers className="h-7 w-7 text-blue-600" /> },
      { label: "Transfer Leads", count: getStatus("TRANSFER_LEADS"), icon: <FaChartLine className="h-7 w-7 text-green-600" /> },
      { label: "Pending Leads", count: getStatus("PENDING_LEADS"), icon: <FaPhone className="h-7 w-7 text-gray-600" /> },
      { label: "Processing Leads", count: getStatus("PROCESSING_LEADS"), icon: <FaUsers className="h-7 w-7 text-purple-600" /> },
      { label: "Interested Leads", count: getStatus("INTERESTED_LEADS"), icon: <FaCheckCircle className="h-7 w-7 text-green-600" /> },
      { label: "Not Picked Leads", count: getStatus("NOT_PICKED_LEADS"), icon: <FaTimesCircle className="h-7 w-7 text-red-600" /> },
      { label: "Meeting Scheduled Leads", count: getStatus("MEETING_SCHEDULED_LEADS"), icon: <FaUsers className="h-7 w-7 text-blue-600" /> },
      { label: "Whatsapp Scheduled Leads", count: getStatus("WHATSAPP_SCHEDULED_LEADS"), icon: <FaUsers className="h-7 w-7 text-green-600" /> },
      { label: "Call Scheduled Leads", count: getStatus("CALL_SCHEDULED_LEADS"), icon: <FaPhone className="h-7 w-7 text-blue-600" /> },
      { label: "Visit Scheduled Leads", count: getStatus("VISIT_SCHEDULED_LEADS"), icon: <FaUsers className="h-7 w-7 text-indigo-600" /> },
      { label: "Visit Done Leads", count: getStatus("VISIT_DONE_LEADS"), icon: <FaCheckCircle className="h-7 w-7 text-green-600" /> },
      { label: "Booked Leads", count: getStatus("BOOKED_LEADS"), icon: <FaCheckCircle className="h-7 w-7 text-green-700" /> },
      { label: "Completed", count: getStatus("COMPLETED"), icon: <FaCheckCircle className="h-7 w-7 text-green-800" /> },
      { label: "Cancelled", count: getStatus("CANCELLED"), icon: <FaTimesCircle className="h-7 w-7 text-red-700" /> },
      { label: "Duplicate Leads", count: duplicateLeads, icon: <FaTimesCircle className="h-7 w-7 text-red-700" /> },
      { label: "Others", count: getStatus("OTHERS"), icon: <FaUsers className="h-7 w-7 text-gray-700" /> },
    ],
  };

  const { header, welcomeBoard, rightSideCards } = data;

  const iconMap = {
    bell: <FiBell size={20} />,
    user: <FiUser size={20} />,
  };

  return (
    <div className="w-full min-h-screen bg-gray-100">

      {/* HEADER */}
      <header className="flex items-center justify-between bg-white p-4 shadow">
        <h1 className="text-xl font-bold">{header.title}</h1>

        <div className="flex items-center gap-4">

          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={header.searchPlaceholder}
              className="border rounded-lg pl-10 pr-3 py-2 w-64"
            />
          </div>

          {/* Header Icons */}
          <div className="flex items-center gap-4">
            {header.rightIcons.map((i, index) => (
              <div key={index} className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                {iconMap[i]}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex gap-4 p-4">

        {/* LEFT PANEL */}
        <div className="w-[35%] bg-white shadow rounded-xl p-4">
          <h2 className="text-xl font-bold">{welcomeBoard.title}</h2>
          <p className="text-sm text-gray-500">{welcomeBoard.subtitle}</p>

          <img src={welcomeImg} alt="Welcome" className="w-full h-42 object-cover rounded-lg mb-3" />

          <div className="mt-4 p-4 bg-blue-100 rounded-lg">
            <p>Total Leads: {welcomeBoard.totalLeads}</p>
            <p>Transferred Leads: {welcomeBoard.transferredLeads}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            {welcomeBoard.buttons.map((item, index) => (
              <div key={index} className="p-3 bg-blue-50 rounded-lg shadow text-center">
                <p className="font-medium">{item.label}</p>
                <p className="text-xl font-bold text-blue-700">{item.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-[65%]">
          <div className="grid grid-cols-3 gap-4">
            {rightSideCards.map((card, index) => (
              <div key={index} className="bg-white p-4 rounded-xl shadow text-center flex flex-col items-center">
                <div className="mb-2">{card.icon}</div>
                <p className="font-semibold">{card.label}</p>
                <p className="text-2xl font-bold mt-2 text-blue-600">{card.count}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
