import React from "react";
import { FiSearch, FiBell, FiSettings, FiUser } from "react-icons/fi";

const Dashboard = () => {
  // -------------------------------------
  // 🔵 INLINE JSON (Editable anytime)
  // -------------------------------------
  const data = {
    header: {
      title: "Dashboard",
      searchPlaceholder: "Search Leads...",
      rightIcons: ["bell", "settings", "user"]
    },

    welcomeBoard: {
      title: "Welcome Back!",
      subtitle: "Admin Dashboard",
      totalLeads: 20,
      transferredLeads: 0,
      buttons: [
        { label: "Allocate Leads", count: 0 },
        { label: "Unallocate Leads", count: 0 },
        { label: "Not Reachable", count: 0 },
        { label: "Wrong Number", count: 0 },
        { label: "Channel Partner", count: 0 },
        { label: "Not Interested", count: 0 },
        { label: "Future Lead", count: 0 },
        { label: "Lost", count: 0 }
      ]
    },

    rightSideCards: [
      { label: "New Leads", count: 19 },
      { label: "Transfer Leads", count: 0 },
      { label: "Pending Leads", count: 0 },
      { label: "Processing Leads", count: 0 },
      { label: "Interested Leads", count: 0 },
      { label: "Not Picked Leads", count: 0 },
      { label: "Meeting Scheduled Leads", count: 0 },
      { label: "Whatsapp Scheduled Leads", count: 0 },
      { label: "Call Scheduled Leads", count: 0 },
      { label: "Visit Scheduled Leads", count: 0 },
      { label: "Visit Done Leads", count: 0 },
      { label: "Booked Leads", count: 0 },
      { label: "Completed", count: 0 },
      { label: "Cancelled", count: 0 },
      { label: "Others", count: 0 }
    ]
  };

  const { header, welcomeBoard, rightSideCards } = data;

  // Icon mapping
  const iconMap = {
    bell: <FiBell size={20} />,
    settings: <FiSettings size={20} />,
    user: <FiUser size={20} />
  };

  // -------------------------------------
  // 🔵 UI Layout
  // -------------------------------------
  return (
    <div className="w-full min-h-screen bg-gray-100">

      {/* TOP HEADER */}
      <header className="flex items-center justify-between bg-white p-4 shadow">
        <h1 className="text-xl font-bold">{header.title}</h1>

        <div className="flex items-center gap-4">

          {/* Search Bar with Icon */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={header.searchPlaceholder}
              className="border rounded-lg pl-10 pr-3 py-2 w-64"
            />
          </div>

          {/* Right Header Icons */}
          <div className="flex items-center gap-4">
            {header.rightIcons.map((i, index) => (
              <div
                key={index}
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"
              >
                {iconMap[i]}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex gap-4 p-4">

        {/* LEFT PANEL — 35% */}
        <div className="w-[35%] bg-white shadow rounded-xl p-4">
          <h2 className="text-xl font-bold">{welcomeBoard.title}</h2>
          <p className="text-sm text-gray-500">{welcomeBoard.subtitle}</p>

          <div className="mt-4 p-4 bg-blue-100 rounded-lg">
            <p>Total Leads: {welcomeBoard.totalLeads}</p>
            <p>Transferred Leads: {welcomeBoard.transferredLeads}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            {welcomeBoard.buttons.map((item, index) => (
              <div
                key={index}
                className="p-3 bg-blue-50 rounded-lg shadow text-center"
              >
                <p className="font-medium">{item.label}</p>
                <p className="text-xl font-bold text-blue-700">{item.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL — 65% */}
        <div className="w-[65%]">
          <div className="grid grid-cols-3 gap-4">
            {rightSideCards.map((card, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-xl shadow text-center"
              >
                <p className="font-semibold">{card.label}</p>
                <p className="text-2xl font-bold mt-2 text-blue-600">
                  {card.count}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
