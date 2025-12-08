import React, { useEffect, useState } from "react";
import useAxios from "../../Auth/useAxios";
import Swal from "sweetalert2";
import { TrashIcon, PencilIcon, EyeIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
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
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const itemsPerPageOptions = [10, 25, 50, 100, 250, 500, 1000];

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

  useEffect(() => {
    // Reset to first page when items per page changes
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearch("");
    setCurrentPage(1);
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
    .filter((lead) => {
    const cleanName = (lead.customerName || "").replace(/[^a-zA-Z ]/g, "");
    const cleanSearch = (search || "").replace(/[^a-zA-Z ]/g, "");

    return cleanName.toLowerCase().includes(cleanSearch.toLowerCase());
  })
  .filter((lead) => (filterStatus ? lead.status === filterStatus : true))
  .filter((lead) => (filterAssignedTo ? lead.assignedToId === filterAssignedTo : true))
  .filter((lead) => (filterSource ? lead.sourceName === filterSource : true));
  
  /** Pagination */
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const displayedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination button generation with responsive design
  const getPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5; // Adjust based on screen size

    if (totalPages <= maxVisibleButtons) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      // Always show first page
      buttons.push(1);

      // Calculate start and end of pagination buttons
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if at the beginning
      if (currentPage <= 3) {
        end = Math.min(totalPages - 1, maxVisibleButtons - 1);
      }

      // Adjust if at the end
      if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - (maxVisibleButtons - 2));
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        buttons.push("...");
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        buttons.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        buttons.push("...");
      }

      // Always show last page if there's more than 1 page
      if (totalPages > 1) {
        buttons.push(totalPages);
      }
    }

    return buttons;
  };

  return (
    <div className="p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-blue-700">Lead Management</h1>
          <p className="text-sm text-gray-600">
            <a href="/dashboard" className="text-blue-600 hover:underline">Dashboard</a>{" "}
            / <span className="font-semibold text-blue-700">Leads</span>
          </p>
        </div>

        {/* Search */}
        <div className="w-full md:w-auto">
          <div className="flex items-center border rounded-lg overflow-hidden w-full md:w-64">
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 outline-none flex-1"
            />
          </div>
        </div>
      </div>

      {/* TABS */}
      {userRole === "ADMIN" && (
        <div className="mb-6 border-b">
          <div className="flex space-x-1 overflow-x-auto">
            <button
              className={`px-4 py-2 font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                activeTab === "all" ? "bg-blue-700 text-white border-b-2 border-blue-700" : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
              }`}
              onClick={() => handleTabChange("all")}
            >
              All Leads
            </button>
            <button
              className={`px-4 py-2 font-medium rounded-t-lg transition-colors whitespace-nowrap ${
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
      <div className="mt-4 flex flex-col md:flex-row justify-between gap-3 pb-5 items-start md:items-center">
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <select
            className="border p-2 rounded w-full md:w-40"
            value={assignUserId}
            onChange={(e) => setAssignUserId(e.target.value)}
          >
            <option value="">Assign To</option>
            {usersList.map((u) => (
              <option key={u.id} value={u.id}>{u.fullName}</option>
            ))}
          </select>
          <button
            className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800 whitespace-nowrap"
            onClick={handleBulkAssignLeads}
          >
            Assign Selected Leads
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-3 md:mt-0">
          <button
            onClick={() => navigate("/leads/add")}
            className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 whitespace-nowrap text-center"
          >
            Add Lead
          </button>
          <label className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer whitespace-nowrap text-center">
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

      {/* Pagination Controls - Top */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
          <span className="font-semibold">{Math.min(currentPage * itemsPerPage, filteredLeads.length)}</span> of{" "}
          <span className="font-semibold">{filteredLeads.length}</span> leads
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 whitespace-nowrap">Leads per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="border rounded p-1 text-sm"
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>{option}</option>
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
              }} checked={displayedLeads.every(l => selectedLeads.includes(l.id)) && displayedLeads.length > 0} /></th>}
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
                <tr key={lead.id} className="border-b hover:bg-gray-50">
                  {userRole === "ADMIN" && <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={() => toggleSelectLead(lead.id)}
                    />
                  </td>}
                  <td className="px-4 py-3">{lead.id}</td>
                  <td className="px-4 py-3">{lead.customerName}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      lead.status === "BOOKED_LEADS" || lead.status === "COMPLETED" 
                        ? "bg-green-100 text-green-800"
                        : lead.status === "CANCELLED"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {leadStatusOptions.find(s => s.value === lead.status)?.label || lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{lead.mobile}</td>
                  <td className="px-4 py-3">{lead.email}</td>
                  <td className="px-4 py-3">{lead.sourceName}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      lead.priority === "HIGH" 
                        ? "bg-red-100 text-red-800"
                        : lead.priority === "MEDIUM"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {lead.priority}
                    </span>
                  </td>
                  {activeTab === "all" && <td className="px-4 py-3">{lead.assignedToName || "Unassigned"}</td>}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      <button 
                        className="text-blue-600 hover:text-blue-800 p-1" 
                        onClick={() => navigate(`/leads/view/${lead.id}`)}
                        title="View"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      <button 
                        className="text-yellow-600 hover:text-yellow-800 p-1" 
                        onClick={() => navigate(`/leads/edit/${lead.id}`)}
                        title="Edit"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button 
                        className="text-green-700 hover:text-green-800 px-2 py-1 rounded text-xs border border-green-700 hover:bg-green-50"
                        onClick={() => handleAssignSingleLead(lead.id)}
                        title="Assign"
                      >
                        Assign
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-800 p-1" 
                        onClick={() => handleDeleteLead(lead.id)}
                        title="Delete"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION - Bottom */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
          <div className="text-sm text-gray-600">
            Page <span className="font-semibold">{currentPage}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </div>
          
          <div className="flex items-center gap-1 overflow-x-auto py-2 max-w-full">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded flex items-center gap-1 ${
                currentPage === 1 
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <ChevronLeftIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {getPaginationButtons().map((page, index) => (
                <button
                  key={index}
                  onClick={() => page !== "..." && setCurrentPage(page)}
                  disabled={page === "..." || page === currentPage}
                  className={`min-w-[2.5rem] px-2 py-2 rounded text-sm ${
                    page === "..."
                      ? "bg-transparent text-gray-500 cursor-default"
                      : page === currentPage
                      ? "bg-blue-700 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded flex items-center gap-1 ${
                currentPage === totalPages 
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">Go to page:</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const value = Math.max(1, Math.min(Number(e.target.value), totalPages));
                setCurrentPage(value);
              }}
              className="border rounded p-1 w-16 text-center text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;