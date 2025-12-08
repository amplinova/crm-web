import React, { useEffect, useState } from "react";
import useAxios from "../../Auth/useAxios";
import Swal from "sweetalert2";
import { TrashIcon, PencilIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const LeadsPage = () => {
  const api = useAxios();
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");

  // Filters
  const [filterStatus, setFilterStatus] = useState("");
  const [filterAssignedTo, setFilterAssignedTo] = useState("");
  const [filterSource, setFilterSource] = useState("");

  const [usersList, setUsersList] = useState([]);
  const [sourceList, setSourceList] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Lead selection for bulk assign
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [assignUserId, setAssignUserId] = useState("");

  const leadStatusOptions = [
    { value: "NEW_LEADS", label: "New Leads" },
    { value: "TRANSFER_LEADS", label: "Transfer Leads" },
    { value: "PENDING_LEADS", label: "Pending Leads" },
    { value: "PROCESSING_LEADS", label: "Processing Leads" },
    { value: "INTERESTED_LEADS", label: "Interested Leads" },
    { value: "NOT_PICKED_LEADS", label: "Not Picked Leads" },
    { value: "MEETING_SCHEDULED_LEADS", label: "Meeting Scheduled" },
    { value: "WHATSAPP_SCHEDULED_LEADS", label: "Whatsapp Scheduled" },
    { value: "CALL_SCHEDULED_LEADS", label: "Call Scheduled" },
    { value: "VISIT_SCHEDULED_LEADS", label: "Visit Scheduled" },
    { value: "VISIT_DONE_LEADS", label: "Visit Done" },
    { value: "BOOKED_LEADS", label: "Booked" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
    { value: "OTHERS", label: "Others" },
  ];

  useEffect(() => {
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("userId");
    setUserRole(role || "");
    setUserId(id || "");

    if (role !== "ADMIN") setActiveTab("assigned");

    fetchFilterData();
  }, []);

  const fetchFilterData = async () => {
    try {
      const usersRes = await api.get("/auth/id-names");
      const sourceRes = await api.get("/api/sources/get-all-sources");

      setUsersList(usersRes.data || []);
      setSourceList(sourceRes.data || []);
    } catch (error) {
      console.log("Filter fetch error:", error);
    }
  };

  const getAllLeads = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/leads");
      setLeads(res.data.data);
    } catch (err) {
      Swal.fire("Error", "Failed to load leads", "error");
    } finally {
      setLoading(false);
    }
  };

  const getLeadsAssignedToMe = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await api.get(`/api/leads/assigned-to/${userId}`);
      setLeads(res.data.data);
    } catch (err) {
      Swal.fire("Error", "Failed to load assigned leads", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadLeads = async () => {
    if (activeTab === "all") await getAllLeads();
    else await getLeadsAssignedToMe();
  };

  useEffect(() => {
    if (userRole) loadLeads();
  }, [activeTab, userRole]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearch("");
  };

  const handleDeleteLead = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Lead will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/api/leads/${id}`);
      Swal.fire("Deleted!", "Lead deleted successfully!", "success");
      loadLeads();
    } catch (err) {
      Swal.fire("Error", "Failed to delete lead", "error");
    }
  };

  /** Bulk Upload CSV */
  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await api.post("/api/leads/bulk", formData);
      Swal.fire("Success", res.data.message || "Leads uploaded successfully!", "success");
      loadLeads();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to upload leads", "error");
    } finally {
      setLoading(false);
      e.target.value = null;
    }
  };

  /** Handle checkbox selection */
  const toggleSelectLead = (leadId) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId]
    );
  };

  /** Assign single lead */
  const handleAssignSingleLead = async (leadId) => {
    if (!assignUserId) {
      Swal.fire("Error", "Please select a user to assign", "error");
      return;
    }

    try {
      setLoading(true);
      await api.put(`/api/leads/${leadId}/assigned-to`, { assignedToId: assignUserId });
      Swal.fire("Success", "Lead assigned successfully!", "success");
      loadLeads();
    } catch (err) {
      Swal.fire("Error", "Failed to assign lead", "error");
    } finally {
      setLoading(false);
    }
  };

  /** Bulk assign selected leads */
  const handleBulkAssignLeads = async () => {
    if (!assignUserId || selectedLeads.length === 0) {
      Swal.fire("Error", "Please select leads and user", "error");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/leads/assign/bulk", {
        leadIds: selectedLeads,
        assignedToId: assignUserId,
      });
      Swal.fire("Success", "Leads assigned successfully!", "success");
      setSelectedLeads([]);
      loadLeads();
    } catch (err) {
      Swal.fire("Error", "Failed to assign leads", "error");
    } finally {
      setLoading(false);
    }
  };

  /** Apply filters */
  const filteredLeads = leads
    .filter((lead) => lead.customerName.toLowerCase().includes(search.toLowerCase()))
    .filter((lead) => (filterStatus ? lead.status === filterStatus : true))
    .filter((lead) => (filterAssignedTo ? lead.assignedToId === filterAssignedTo : true))
    .filter((lead) => (filterSource ? lead.sourceName === filterSource : true));

  /** Pagination */
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const displayedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">Lead Management</h1>
          <p className="text-sm text-gray-600">
            <a href="/dashboard" className="text-blue-600 hover:underline">Dashboard</a>{" "}
            / <span className="font-semibold text-blue-700">Leads</span>
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center border rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 outline-none"
          />
        </div>
      </div>

      {/* TABS */}
      {userRole === "ADMIN" && (
        <div className="mb-6 border-b">
          <div className="flex space-x-1">
            <button
              className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
                activeTab === "all" ? "bg-blue-700 text-white border-b-2 border-blue-700" : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
              }`}
              onClick={() => handleTabChange("all")}
            >
              All Leads
            </button>
            <button
              className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
                activeTab === "assigned" ? "bg-blue-700 text-white border-b-2 border-blue-700" : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
              }`}
              onClick={() => handleTabChange("assigned")}
            >
              Leads Assigned to Me
            </button>
          </div>
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div className="mt-4 flex justify-between gap-3 pb-5 items-center">
        <div className="flex gap-2">
          <select
            className="border p-2 rounded"
            value={assignUserId}
            onChange={(e) => setAssignUserId(e.target.value)}
          >
            <option value="">Assign To</option>
            {usersList.map((u) => (
              <option key={u.id} value={u.id}>{u.fullName}</option>
            ))}
          </select>
          <button
            className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
            onClick={handleBulkAssignLeads}
          >
            Assign Selected Leads
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/leads/add")}
            className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
          >
            Add Lead
          </button>
          <label className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer">
            Upload CSV
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleBulkUpload}
            />
          </label>
        </div>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-5">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Filter by Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">All Status</option>
            {leadStatusOptions.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Filter by Assigned To</label>
          <select
            value={filterAssignedTo}
            onChange={(e) => setFilterAssignedTo(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">All Employees</option>
            {usersList.map((u) => (
              <option key={u.id} value={u.id}>{u.fullName}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Filter by Source</label>
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">All Sources</option>
            {sourceList.map((s) => (
              <option key={s.id} value={s.sourceName}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-blue-100 text-blue-900">
              {userRole === "ADMIN" && <th className="px-4 py-3"><input type="checkbox" onChange={(e) => {
                if (e.target.checked) setSelectedLeads(displayedLeads.map(l => l.id));
                else setSelectedLeads([]);
              }} checked={displayedLeads.every(l => selectedLeads.includes(l.id))} /></th>}
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Customer Name</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Priority</th>
              {activeTab === "all" && <th className="px-4 py-3">Assigned To</th>}
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={userRole === "ADMIN" ? "9" : "8"} className="text-center py-6">Loading...</td>
              </tr>
            ) : displayedLeads.length === 0 ? (
              <tr>
                <td colSpan={userRole === "ADMIN" ? "9" : "8"} className="text-center py-6">No leads found</td>
              </tr>
            ) : (
              displayedLeads.map((lead) => (
                <tr key={lead.id} className="border-b">
                  {userRole === "ADMIN" && <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={() => toggleSelectLead(lead.id)}
                    />
                  </td>}
                  <td className="px-4 py-3">{lead.id}</td>
                  <td className="px-4 py-3">{lead.customerName}</td>
                  <td className="px-4 py-3">{lead.status}</td>
                  <td className="px-4 py-3">{lead.mobile}</td>
                  <td className="px-4 py-3">{lead.email}</td>
                  <td className="px-4 py-3">{lead.sourceName}</td>
                  <td className="px-4 py-3">{lead.priority}</td>
                  {activeTab === "all" && <td className="px-4 py-3">{lead.assignedToName || "Unassigned"}</td>}
                  <td className="px-4 py-3 flex items-center justify-center gap-2">
                    <button className="text-blue-600 hover:text-blue-800" onClick={() => navigate(`/leads/view/${lead.id}`)}><EyeIcon className="w-6 h-6" /></button>
                    <button className="text-yellow-600 hover:text-yellow-800" onClick={() => navigate(`/leads/edit/${lead.id}`)}><PencilIcon className="w-6 h-6" /></button>
                    <button className="text-green-700 hover:text-green-800 px-2 py-1 rounded text-sm" onClick={() => handleAssignSingleLead(lead.id)}>Assign</button>
                    <button className="text-red-600 hover:text-red-800" onClick={() => handleDeleteLead(lead.id)}><TrashIcon className="w-6 h-6" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-700 text-white" : "bg-gray-200 text-gray-700"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeadsPage;
