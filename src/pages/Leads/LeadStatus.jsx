// src/pages/LeadStatusPage.jsx

import React, { useEffect, useState } from "react";
import useAxios from "../../Auth/useAxios";
import { FiSearch } from "react-icons/fi";
import Swal from "sweetalert2";

const LeadStatus = () => {
  const api = useAxios();

  const [statuses, setStatuses] = useState([]);
  const [search, setSearch] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  // Get user role & ID
  useEffect(() => {
    const role = localStorage.getItem("role") || "";
    const id = localStorage.getItem("userId") || "";
    setUserRole(role);
    setUserId(id);
  }, []);

  // Fetch lead stats from API
  useEffect(() => {
    if (!userRole) return;
    loadLeadStatuses();
  }, [userRole]);

  const loadLeadStatuses = async () => {
    try {
      setLoading(true);
      const url =
        userRole === "ADMIN"
          ? "/api/leads/stats"
          : `/api/leads/stats`;

      const res = await api.get(url);

      if (res.data.success && res.data.data) {
        const leadsByStatus = res.data.data.leadsByStatus;

        // Transform into array for table
        const statusArray = Object.keys(leadsByStatus).map((key, index) => ({
          id: index + 1,
          status: key.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
          count: leadsByStatus[key],
        }));

        setStatuses(statusArray);
      } else {
        Swal.fire("Error", "Failed to load lead statuses", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong while fetching stats", "error");
    } finally {
      setLoading(false);
    }
  };

  // Filtered based on search
  const filteredStatus = statuses.filter((item) =>
    item.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gray-100">

      {/* Title + Breadcrumb */}
      <h1 className="text-2xl font-bold text-blue-700 mb-1">
        Lead Status Management
      </h1>

      <p className="text-sm text-gray-600 mb-6">
        <a href="/dashboard" className="text-blue-600 hover:underline">
          Dashboard
        </a>{" "}
        /{" "}
        <span className="font-semibold text-blue-700">
          Lead Status
        </span>
      </p>

      {/* Search Bar */}
      <div className="flex justify-end items-center mb-6">
        <div className="flex items-center border rounded-lg overflow-hidden bg-white shadow">
          <FiSearch className="text-gray-400 ml-2 absolute" />
          <input
            type="text"
            placeholder="Search statuses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-2 outline-none w-64"
          />
        </div>
      </div>

      {/* Status Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-blue-100 text-blue-900">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Lead Status</th>
              <th className="px-4 py-3">Count</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : filteredStatus.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-6">
                  No lead status found
                </td>
              </tr>
            ) : (
              filteredStatus.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{item.id}</td>
                  <td className="px-4 py-3 font-semibold">{item.status}</td>
                  <td className="px-4 py-3">{item.count}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadStatus;
