// src/pages/LeadStatusPage.jsx

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import leadStatusData from "../../json/allLeads.json";

const LeadStatus = () => {
  const [statuses, setStatuses] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setStatuses(leadStatusData);
  }, []);

  const filteredStatus = statuses.filter((item) =>
    item.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">

      {/* Title + Breadcrumb */}
      <h1 className="text-2xl font-bold text-blue-700 mb-1">
        Lead Status Management
      </h1>

      <p className="text-sm text-gray-600 mb-4">
        <a href="/dashboard" className="text-blue-600 hover:underline">
          Dashboard
        </a>{" "}
        /{" "}
        <span className="font-semibold text-blue-700">
          Lead Status
        </span>
      </p>

      {/* Search Bar → Top Right */}
      <div className="flex justify-end items-center mb-6">
        <div className="flex items-center border rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search statuses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 outline-none"
          />
          <button className="px-4 py-2 bg-blue-700 text-white">
            Search
          </button>
        </div>
      </div>

      {/* Status Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-blue-100 text-blue-900">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Lead Status</th>
              <th className="px-4 py-3">Description</th>
            </tr>
          </thead>

          <tbody>
            {filteredStatus.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-6">
                  No lead status found
                </td>
              </tr>
            ) : (
              filteredStatus.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="px-4 py-3">{item.id}</td>
                  <td className="px-4 py-3 font-semibold">{item.status}</td>
                  <td className="px-4 py-3">{item.description}</td>
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
