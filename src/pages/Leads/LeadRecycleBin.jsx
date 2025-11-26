// src/pages/LeadRecycleBinPage.jsx

import React, { useState, useEffect } from "react";
import { EyeIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import recycleBinData from "../../json/allLeads.json";

const LeadRecycleBinPage = () => {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLeads(recycleBinData);
  }, []);

  const filteredLeads = leads.filter((lead) =>
    lead.name.toLowerCase().includes(search.toLowerCase())
  );

  // 🔥 Popup Handlers
  const handleRestore = () =>
    Swal.fire("Restored!", "Lead has been restored successfully.", "success");

  const handleRestoreAll = () =>
    Swal.fire("Restored All!", "All leads have been restored.", "success");

  const handleDeletePerm = () =>
    Swal.fire(
      "Deleted!",
      "Lead has been permanently deleted.",
      "warning"
    );

  const handleDeleteAllPerm = () =>
    Swal.fire(
      "Deleted All!",
      "All leads have been permanently deleted.",
      "error"
    );

  return (
    <div className="p-6">

      {/* 📌 Search Bar (Top) */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">Lead Recycle Bin</h1>
          <p className="text-sm text-gray-600">
            <a href="/dashboard" className="text-blue-600 hover:underline">
              Dashboard
            </a>{" "}
            / <span className="font-semibold text-blue-700">Recycle Bin</span>
          </p>
        </div>

        <div className="flex items-center border rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 outline-none"
          />
          <button className="px-4 py-2 bg-blue-700 text-white">
            Search
          </button>
        </div>
      </div>

      {/* 📌 Four Buttons (Right Side, Below Search) */}
      <div className="flex justify-end gap-3 mb-6">
        <button
          onClick={handleRestore}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Restore Lead
        </button>

        <button
          onClick={handleRestoreAll}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Restore All Leads
        </button>

        <button
          onClick={handleDeletePerm}
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
        >
          Delete Permanently
        </button>

        <button
          onClick={handleDeleteAllPerm}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Delete All Permanently
        </button>
      </div>

      {/* 📌 Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-blue-100 text-blue-900">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-center">View</th>
            </tr>
          </thead>

          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6">
                  No leads found
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b">
                  <td className="px-4 py-3">{lead.id}</td>
                  <td className="px-4 py-3">{lead.name}</td>
                  <td className="px-4 py-3">{lead.email}</td>
                  <td className="px-4 py-3">{lead.phone}</td>
                  <td className="px-4 py-3">{lead.status}</td>
                  <td className="px-4 py-3">{lead.source}</td>
                  <td className="px-4 py-3">{lead.date}</td>

                  {/* View Button Only */}
                  <td className="px-4 py-3 text-center">
                    <button className="text-blue-600 hover:text-blue-800">
                      <EyeIcon className="w-6 h-6" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadRecycleBinPage;
