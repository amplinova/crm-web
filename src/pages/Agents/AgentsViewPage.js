import React, { useEffect, useState } from "react";
import useAxios from "../../Auth/useAxios";
import { useParams, useNavigate } from "react-router-dom";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const UserViewPage = () => {
  const { id } = useParams();
  const api = useAxios();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [leads, setLeads] = useState([]);

  // Load User
  useEffect(() => {
    api
      .get(`/auth/${id}`)
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, [id]);

  useEffect(() => {
    api
      .get(`/api/leads/assigned-to/${id}`)
      .then((res) => {
        setLeads(Array.isArray(res.data.data) ? res.data.data : []);
        console.log(res.data.data); 
      })
      .catch(() => setLeads([]));
  }, [id]);

  if (!user)
    return <div className="p-6 text-gray-600">Loading user details...</div>;

  const initial = user.fullName ? user.fullName.charAt(0).toUpperCase() : "?";

  // Dummy work report
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
      talk_time: "200",
      received_calls: 13,
      missed_calls: 2,
      outgoing_calls: 5,
      total_calls: 20,
    },
  ];

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">Agents</h1>
          <p className="text-sm text-gray-600">
            <a href="/dashboard" className="text-blue-600 hover:underline">
              Dashboard
            </a>{" "}
            /{" "}
            <a href="/agents" className="text-blue-600 hover:underline">
              Agents
            </a>{" "}
            /{" "}
            <span className="font-semibold text-blue-700">{user.fullName}</span>
          </p>
        </div>
      </div>

      {/* TOP CARD */}
      <div className="w-full bg-white shadow-md rounded-xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-blue-600 text-white flex items-center justify-center rounded-full text-2xl font-semibold">
            {initial}
          </div>

          <div className="flex flex-col">
            <h2 className="text-2xl font-bold">{user.fullName}</h2>
            <p className="text-gray-600 -mt-1">{user.role?.name}</p>

            <p className="text-gray-800 mt-1">
              <span className="font-semibold">Username:</span> {user.username}{" "}
              &nbsp;&nbsp;
              <span className="font-semibold">Email:</span> {user.email}
            </p>

            <p className="text-gray-800">
              <span className="font-semibold">Mobile:</span>{" "}
              {user.assignedMobileNumber}
            </p>

            <p className="text-gray-800">
              <span className="font-semibold">Gender:</span>{" "}
              {user.gender || "N/A"}
            </p>

            <p className="text-gray-800">
              <span className="font-semibold">Address:</span> {user.address}
            </p>
          </div>
        </div>

        <div className="text-right text-gray-700 leading-6">
          <p>
            <span className="font-semibold">Assigned Under:</span>{" "}
            {user.assignedUnder?.fullName || "None"}
          </p>

          <p>
            <span className="font-semibold">Profile Image:</span>{" "}
            {user.profileImage || "N/A"}
          </p>
        </div>
      </div>

      {/* HEADING */}
      <h2 className="text-xl font-bold text-gray-800 mb-3 mt-6">
        Leads Assigned
      </h2>

      {/* LEADS TABLE */}
      <div className="mt-4 bg-white shadow-md rounded-xl overflow-hidden">
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

        {leads.length === 0 ? (
          <div className="px-6 py-4 text-gray-600">Leads not assigned.</div>
        ) : (
          leads.map((lead) => (
            <div
              key={lead.id}
              className="grid grid-cols-8 px-6 py-4 items-center text-gray-800 border-t"
            >
              <div>{lead.id}</div>
              <div>{lead.customerName}</div>
              <div>{lead.status}</div>
              <div>{lead.mobile}</div>
              <div>{lead.email}</div>
              <div>{lead.sourceName}</div>
              <div>{lead.priority}</div>

              <div className="flex gap-4">
                <button
                  onClick={() => navigate(`/leads/view/${lead.id}`)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <EyeIcon className="h-6 w-6" />
                </button>

                <button
                  onClick={() => navigate(`/leads/edit/${lead.id}`)}
                  className="text-yellow-500 hover:text-yellow-700"
                >
                  <PencilIcon className="h-6 w-6" />
                </button>

                <button
                  onClick={() => alert("Delete clicked")}
                  className="text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* WORK REPORT */}
      <h2 className="text-xl font-bold text-gray-800 mb-3 mt-10">
        Work Report
      </h2>

      <div className="mt-4 bg-white shadow-md rounded-xl overflow-hidden">
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
