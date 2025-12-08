import React, { useEffect, useState } from "react";
import useAxios from "../../Auth/useAxios";
import Swal from "sweetalert2";
import { TrashIcon, EyeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const FollowupReports = () => {
  const api = useAxios();
  const navigate = useNavigate();

  const [callLogs, setCallLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // "all" or "assigned"
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");

  // Get user role and ID from localStorage
  useEffect(() => {
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("userId");
    setUserRole(role || "");
    setUserId(id || "");
    
    // Set default tab based on role
    if (role !== "ADMIN") {
      setActiveTab("assigned");
    }
  }, []);

  /** Load all call logs */
  const getAllCallLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/leads/call-logs");
      setCallLogs(res.data);
      console.log(res.data);
    } catch (err) {
      Swal.fire("Error", "Failed to load call logs", "error");
    } finally {
      setLoading(false);
    }
  };

  /** Load call logs assigned to current user */
  const getCallLogsAssignedToMe = async () => {
    if (!userId) {
      Swal.fire("Error", "User ID not found", "error");
      return;
    }

    try {
      setLoading(true);
      // Assuming you have an API endpoint for assigned call logs
      // If not, you can filter from all call logs on frontend
      const allLogs = await api.get("/api/leads/call-logs");
      const myLogs = allLogs.data.filter(log => 
        log.agentId === userId || log.assignedTo === userId || log.createdBy === userId
      );
      setCallLogs(myLogs);
     
    } catch (err) {
      Swal.fire("Error", "Failed to load assigned call logs", "error");
    } finally {
      setLoading(false);
    }
  };

  /** Load call logs based on active tab */
  const loadCallLogs = async () => {
    if (activeTab === "all") {
      await getAllCallLogs();
    } else {
      await getCallLogsAssignedToMe();
    }
  };

  useEffect(() => {
    if (userRole && userId) {
      loadCallLogs();
    }
  }, [activeTab, userRole, userId]);

  /** Handle tab change */
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearch(""); // Reset search when changing tabs
  };

  /** Delete call log */
  const handleDeleteCallLog = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Call log will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/api/leads/get-call-logs/${id}`);
      Swal.fire("Deleted!", "Call log deleted successfully!", "success");
      loadCallLogs(); // Reload current tab data
    } catch (err) {
      Swal.fire("Error", "Failed to delete call log", "error");
    }
  };

  /** Search filter */
  const filteredCallLogs = callLogs.filter((log) =>
    log.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    log.agentName?.toLowerCase().includes(search.toLowerCase()) ||
    log.callType?.toLowerCase().includes(search.toLowerCase()) ||
    log.status?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">Call Logs Management</h1>
          <p className="text-sm text-gray-600">
            <a href="/dashboard" className="text-blue-600 hover:underline">
              Dashboard
            </a>{" "}
            / <span className="font-semibold text-blue-700">Call Logs</span>
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center border rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search call logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 outline-none"
          />
          <button className="px-4 py-2 bg-blue-700 text-white">Search</button>
        </div>
      </div>

      {/* Tabs - Only show if user is ADMIN */}
      {userRole === "ADMIN" && (
        <div className="mb-6 border-b">
          <div className="flex space-x-1">
            <button
              className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
                activeTab === "all"
                  ? "bg-blue-700 text-white border-b-2 border-blue-700"
                  : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
              }`}
              onClick={() => handleTabChange("all")}
            >
              All Call Logs
            </button>
            <button
              className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
                activeTab === "assigned"
                  ? "bg-blue-700 text-white border-b-2 border-blue-700"
                  : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
              }`}
              onClick={() => handleTabChange("assigned")}
            >
              Call Logs Assigned to Me
            </button>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="mt-4 flex justify-end gap-3 pb-5">
        

        <button
          onClick={() =>
            Swal.fire("Export", "Export Call Logs Feature Coming Soon", "info")
          }
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Export Call Logs
        </button>

       
      </div>

      {/* Table Header with Tab Info */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          {activeTab === "all" ? "All Call Logs" : "Call Logs Assigned to Me"}
          <span className="ml-2 text-sm text-gray-500">
            ({filteredCallLogs.length} call logs)
          </span>
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-blue-100 text-blue-900">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Customer Name</th>
              <th className="px-4 py-3">Agent Name</th>
              <th className="px-4 py-3">Call Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Call Date</th>
              <th className="px-4 py-3">Notes</th>
              {activeTab === "all" && <th className="px-4 py-3">Assigned Agent</th>}
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={activeTab === "all" ? "10" : "9"} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : filteredCallLogs.length === 0 ? (
              <tr>
                <td colSpan={activeTab === "all" ? "10" : "9"} className="text-center py-6">
                  No call logs found
                </td>
              </tr>
            ) : (
              filteredCallLogs.map((log) => (
                <tr key={log.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{log.id}</td>
                  <td className="px-4 py-3 font-medium">{log.customerName || "N/A"}</td>
                  <td className="px-4 py-3">{log.processedByName || "N/A"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      log.callType === "INCOMING" 
                        ? "bg-green-100 text-green-800"
                        : log.callType === "OUTGOING"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {log.callType || "Unknown"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      log.status === "COMPLETED" 
                        ? "bg-green-100 text-green-800"
                        : log.status === "MISSED"
                        ? "bg-red-100 text-red-800"
                        : log.status === "NO_ANSWER"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {log.status || "Unknown"}
                    </span>
                  </td>
                  <td className="px-4 py-3">{log.callDuration || "N/A"}</td>
                  <td className="px-4 py-3">
                    {log.contactDate ? new Date(log.contactDate).toLocaleString() : "N/A"}
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate">
                    {log.notes || "No notes"}
                  </td>
                  {activeTab === "all" && (
                    <td className="px-4 py-3">{log.processedByName || "Unassigned"}</td>
                  )}
                  <td className="px-4 py-3 flex items-center justify-center gap-3">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => navigate(`/call-logs/view/${log.id}`)}
                      title="View Details"
                    >
                      <EyeIcon className="w-6 h-6" />
                    </button>

                    <button
                      className="text-green-600 hover:text-green-800"
                      onClick={() => navigate(`/call-logs/call/${log.id}`)}
                      title="Make Call"
                    >
                      <PhoneIcon className="w-6 h-6" />
                    </button>

                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteCallLog(log.id)}
                      title="Delete"
                    >
                      <TrashIcon className="w-6 h-6" />
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

export default FollowupReports;