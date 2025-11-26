import React, { useEffect, useState } from "react";
import useAxios from "../../Auth/useAxios";
import { useParams, useNavigate } from "react-router-dom";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const UserViewPage = () => {
  const { id } = useParams();
  const api = useAxios();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // Fallback JSON
  // Fallback JSON (two users)
const defaultUsers = [
  {
    name: "Shashi",
    subtitle: "Senior Executive",
    phone: "9876543210",
    email: "test2@gmail.com",
    address: "Hyderabad, Telangana",
    role: "Admin",
    assigned_to: "Manager",
    source: "Google",
    priority: "High",
  },
  {
    name: "Rohit",
    subtitle: "Sales Lead",
    phone: "9123456780",
    email: "rohit@example.com",
    address: "Bengaluru, Karnataka",
    role: "Employee",
    assigned_to: "Shashi",
    source: "Instagram",
    priority: "Medium",
  }
];

// Keep your original fallback (in case API gives one user)
const defaultUser = defaultUsers[0];


  useEffect(() => {
    api
      .get(`/users/${id}/`)
      .then((res) => setUser(res.data))
      .catch(() => setUser(defaultUser));
  }, [id]);

  if (!user) return <div className="p-6 text-gray-600">Loading...</div>;

  const initial = user.name ? user.name.charAt(0).toUpperCase() : "?";

  // ==========================================================
  // WORK REPORT (Dynamic Dummy Data)
  // ==========================================================
  const workReport = [
    {
      id: 1,
      date: "2025-01-29",
      talk_time: "45",
      received_calls: 12,
      missed_calls: 5,
      outgoing_calls: 8,
      total_calls: 25,
    },
    {
      id: 2,
      date: "2025-02-17",
      talk_time:"200",
      received_calls: 13,
      missed_calls:2,
      outgoing_calls:5,
      total_calls:20,
    }
  ];

  return (
    <div className="p-6">

      {/* ================= TOP BAR ================= */}
      <div className="w-full bg-white shadow-md rounded-xl p-6 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-blue-600 text-white flex items-center justify-center rounded-full text-2xl font-semibold">
            {initial}
          </div>

          <div className="flex flex-col">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-600 -mt-1">{user.subtitle}</p>

            <p className="text-gray-800 mt-1">
              <span className="font-semibold">Phone:</span> {user.phone} &nbsp;&nbsp;
              <span className="font-semibold">Email:</span> {user.email}
            </p>

            <p className="text-gray-800">
              <span className="font-semibold">Address:</span> {user.address}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="text-right text-gray-700 leading-6">
          <p><span className="font-semibold">Role:</span> {user.role}</p>
          <p><span className="font-semibold">Assigned To:</span> {user.assigned_to}</p>
        </div>
      </div>

      {/* ================= HEADING ================= */}
      <h2 className="text-xl font-bold text-gray-800 mb-3 mt-6">Leads Assigned</h2>

      {/* ==================== LEADS TABLE ===================== */}
      <div className="mt-4 bg-white shadow-md rounded-xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-blue-100 text-blue-900 font-semibold grid grid-cols-8 px-6 py-3">
          <div>ID</div>
          <div>Customer Name</div>
          <div>Status</div>
          <div>Mobile</div>
          <div>Email</div>
          <div>Source</div>
          <div>Priority</div>
          <div>Actions</div>
        </div>

        {/* ROW */}
        <div className="grid grid-cols-8 px-6 py-4 items-center text-gray-800 border-t">
          <div>{id}</div>
          <div>{user.name}</div>
          <div>{user.role}</div>
          <div>{user.phone}</div>
          <div>{user.email}</div>
          <div>{user.source}</div>
          <div>{user.priority}</div>

          {/* ACTION ICONS */}
          <div className="flex gap-4">
            {/* View */}
            <button
              onClick={() => navigate(`/users/view/${id}`)}
              className="text-blue-600 hover:text-blue-800"
            >
              <EyeIcon className="h-6 w-6" />
            </button>

            {/* Edit */}
            <button
              onClick={() => navigate(`/users/edit/${id}`)}
              className="text-yellow-500 hover:text-yellow-700"
            >
              <PencilIcon className="h-6 w-6" />
            </button>

            {/* Delete */}
            <button
              onClick={() => alert("Delete clicked")}
              className="text-red-500 hover:text-red-700"
            >
              <TrashIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* ======================= WORK REPORT ======================= */}
     {/* ======================= WORK REPORT ======================= */}
<h2 className="text-xl font-bold text-gray-800 mb-3 mt-10">Work Report</h2>

<div className="mt-4 bg-white shadow-md rounded-xl overflow-hidden">

  {/* HEADER — SAME STYLE AS FIRST TABLE */}
  <div className="bg-blue-100 text-blue-900 font-semibold grid grid-cols-8 px-6 py-3">
    <div>S.No</div>
    <div>Date</div>
    <div>Talk Time</div>
    <div>Received Calls</div>
    <div>Missed Calls</div>
    <div>Outgoing Calls</div>
    <div>Total Calls</div>
    <div>Attendance</div>
  </div>

  {/* ROWS — SAME STYLE USING GRID */}
  {workReport.map((item, index) => (
    <div
      key={item.id}
      className="grid grid-cols-8 px-6 py-4 items-center text-gray-800 border-t"
    >
      <div>{index + 1}</div>
      <div>{item.date}</div>
      <div>{item.talk_time} mins</div>
      <div>{item.received_calls}</div>
      <div>{item.missed_calls}</div>
      <div>{item.outgoing_calls}</div>
      <div>{item.total_calls}</div>

      {/* ATTENDANCE BADGE */}
      <div>
        {item.talk_time > 150 ? (
          <span className="px-3 py-1 text-sm font-semibold bg-green-100 text-green-700 rounded-full">
            Present
          </span>
        ) : (
          <span className="px-3 py-1 text-sm font-semibold bg-red-100 text-red-700 rounded-full">
            Absent
          </span>
        )}
      </div>
    </div>
  ))}
</div>
    </div>
  );
};

export default UserViewPage;
