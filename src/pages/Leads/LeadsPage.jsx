import React, { useEffect, useState } from "react";
import useAxios from "../../Auth/useAxios";
import Swal from "sweetalert2";
import {
  TrashIcon,
  PencilIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

// Lead History Modal Component
const LeadHistoryModal = ({ leadId, onClose }) => {
  const api = useAxios();
  const [loading, setLoading] = useState(false);
  const [historyList, setHistoryList] = useState([]);

  // Form state
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [nextScheduleDateTime, setNextScheduleDateTime] = useState("");
  const [callType, setCallType] = useState("");

  // Fetch history
  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/leads/get-history/${leadId}`);
      setHistoryList(res.data.data || []);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch lead history", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [leadId]);

  // Add new history
  const submitHistory = async () => {
    if (!description || !status) {
      Swal.fire("Error", "Description and status are required", "error");
      return;
    }

    const payload = {
      leadId,
      description,
      status,
      contactDate: null, // backend will set as NOW
      nextScheduleDateTime,
      callType,
      processedById: null, // backend will set logged-in user
    };

    try {
      const res = await api.post("/api/leads/add-history", payload);
      Swal.fire("Success", "History Added", "success");
      fetchHistory();
      setDescription("");
      setStatus("");
      setNextScheduleDateTime("");
      setCallType("");
    } catch (error) {
      Swal.fire("Error", "Failed to add history", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Lead History - #{leadId}</h2>
          <button
            onClick={onClose}
            className="text-red-500 text-xl font-bold hover:text-red-700"
          >
            ×
          </button>
        </div>

        {/* Add History Form */}
        <div className="p-6 border-b bg-gray-50">
          <h3 className="font-semibold mb-3 text-blue-700">Add New History</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter description..."
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next Follow-up
                </label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={nextScheduleDateTime}
                  onChange={(e) => setNextScheduleDateTime(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="NEW_LEADS">New Leads</option>
                  <option value="TRANSFER_LEADS">Transfer Leads</option>
                  <option value="PENDING_LEADS">Pending Leads</option>
                  <option value="PROCESSING_LEADS">Processing Leads</option>
                  <option value="INTERESTED_LEADS">Interested Leads</option>
                  <option value="NOT_PICKED_LEADS">Not Picked Leads</option>
                  <option value="MEETING_SCHEDULED_LEADS">
                    Meeting Scheduled
                  </option>
                  <option value="WHATSAPP_SCHEDULED_LEADS">
                    Whatsapp Scheduled
                  </option>
                  <option value="CALL_SCHEDULED_LEADS">Call Scheduled</option>
                  <option value="VISIT_SCHEDULED_LEADS">Visit Scheduled</option>
                  <option value="VISIT_DONE_LEADS">Visit Done</option>
                  <option value="BOOKED_LEADS">Booked</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Not Intrested</option>
                  <option value="OTHERS">Others</option>
                </select>
              </div>

              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Call Type
                </label>
                <select
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={callType}
                  onChange={(e) => setCallType(e.target.value)}
                >
                  <option value="">Select Call Type</option>
                  <option value="INCOMING">Incoming</option>
                  <option value="OUTGOING">Outgoing</option>
                  <option value="MISSED">Missed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
              onClick={submitHistory}
            >
              Add History
            </button>
          </div>
        </div>

        {/* History Table */}
        <div className="p-6">
          <h3 className="font-semibold mb-4 text-blue-700">History Records</h3>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading history...</p>
            </div>
          ) : historyList.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
              <ClockIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p>No history records found for this lead</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Next Follow-up
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Processed By
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {historyList.map((h) => (
                    <tr key={h.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {h.contactDate}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {h.description}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${
                            h.status === "BOOKED_LEADS"
                              ? "bg-green-100 text-green-800"
                              : h.status === "CANCELLED"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {h.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {h.nextScheduleDateTime || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {h.processedByName || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Duplicates Modal Component
const DuplicatesModal = ({ duplicates, onClose, onMerge, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [selectedForMerge, setSelectedForMerge] = useState([]);
  const [selectedForDelete, setSelectedForDelete] = useState([]);
  const [mergeToLead, setMergeToLead] = useState("");

  // Group duplicates by mobile number
  const groupedDuplicates = duplicates.reduce((groups, lead) => {
    const mobile = lead.mobile;
    if (!groups[mobile]) {
      groups[mobile] = [];
    }
    groups[mobile].push(lead);
    return groups;
  }, {});

  const toggleSelectForMerge = (leadId) => {
    setSelectedForMerge(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const toggleSelectForDelete = (leadId) => {
    setSelectedForDelete(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleMerge = async () => {
    if (selectedForMerge.length < 2 || !mergeToLead) {
      Swal.fire("Error", "Please select at least 2 leads and choose a lead to merge into", "error");
      return;
    }

    const result = await Swal.fire({
      title: "Confirm Merge",
      html: `
        <p>You are about to merge ${selectedForMerge.length} leads into lead ID: ${mergeToLead}</p>
        <p class="text-sm text-gray-600 mt-2">All data from other leads will be merged and those leads will be deleted.</p>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, merge them!",
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      await onMerge(selectedForMerge, mergeToLead);
      Swal.fire("Success", "Leads merged successfully!", "success");
      onClose();
    } catch (error) {
      Swal.fire("Error", "Failed to merge leads", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selectedForDelete.length === 0) {
      Swal.fire("Error", "Please select at least one lead to delete", "error");
      return;
    }

    const result = await Swal.fire({
      title: "Confirm Delete",
      html: `You are about to delete ${selectedForDelete.length} duplicate lead(s). This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete them!",
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      await onDelete(selectedForDelete);
      Swal.fire("Success", "Duplicate leads deleted successfully!", "success");
      onClose();
    } catch (error) {
      Swal.fire("Error", "Failed to delete leads", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Duplicate Leads by Mobile Number</h2>
            <p className="text-sm text-gray-600">
              Found {duplicates.length} leads with duplicate mobile numbers
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-red-500 text-xl font-bold hover:text-red-700"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Merge Section */}
          <div className="mb-8 p-4 border border-blue-200 rounded-lg bg-blue-50">
            <h3 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
              <DocumentDuplicateIcon className="w-5 h-5" />
              Merge Duplicates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select leads to merge (select 2 or more):
                </label>
                <div className="max-h-40 overflow-y-auto border rounded p-2">
                  {duplicates.map(lead => (
                    <div key={lead.id} className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        id={`merge-${lead.id}`}
                        checked={selectedForMerge.includes(lead.id)}
                        onChange={() => toggleSelectForMerge(lead.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`merge-${lead.id}`} className="text-sm">
                        {lead.customerName} ({lead.mobile}) - {lead.status}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Merge into (choose one lead to keep):
                </label>
                <select
                  value={mergeToLead}
                  onChange={(e) => setMergeToLead(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={selectedForMerge.length < 2}
                >
                  <option value="">Select lead to merge into</option>
                  {selectedForMerge.map(leadId => {
                    const lead = duplicates.find(l => l.id === leadId);
                    return lead ? (
                      <option key={lead.id} value={lead.id}>
                        {lead.customerName} ({lead.mobile})
                      </option>
                    ) : null;
                  })}
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  This lead will be kept, others will be deleted after merging their data
                </p>
              </div>
            </div>
            <button
              onClick={handleMerge}
              disabled={selectedForMerge.length < 2 || !mergeToLead || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Merging..." : `Merge ${selectedForMerge.length} Leads`}
            </button>
          </div>

          {/* Delete Section */}
          <div className="mb-8 p-4 border border-red-200 rounded-lg bg-red-50">
            <h3 className="font-semibold text-red-700 mb-3">Delete Duplicates</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select duplicate leads to delete:
              </label>
              <div className="max-h-40 overflow-y-auto border rounded p-2">
                {duplicates.map(lead => (
                  <div key={lead.id} className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      id={`delete-${lead.id}`}
                      checked={selectedForDelete.includes(lead.id)}
                      onChange={() => toggleSelectForDelete(lead.id)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <label htmlFor={`delete-${lead.id}`} className="text-sm">
                      {lead.customerName} ({lead.mobile}) - {lead.status}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={handleDelete}
              disabled={selectedForDelete.length === 0 || loading}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Deleting..." : `Delete ${selectedForDelete.length} Selected`}
            </button>
          </div>

          {/* Duplicates List */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">All Duplicates by Mobile Number</h3>
            {Object.entries(groupedDuplicates).map(([mobile, leads]) => (
              <div key={mobile} className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 border-b">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Mobile: {mobile}</span>
                    <span className="text-sm text-gray-600">
                      {leads.length} duplicate{leads.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">ID</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Email</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Assigned To</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Created</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {leads.map(lead => (
                        <tr key={lead.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm">#{lead.id}</td>
                          <td className="px-4 py-2 text-sm font-medium">{lead.customerName}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              lead.status === "BOOKED_LEADS" || lead.status === "COMPLETED"
                                ? "bg-green-100 text-green-800"
                                : lead.status === "CANCELLED"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {lead.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm">{lead.email}</td>
                          <td className="px-4 py-2 text-sm">{lead.assignedToName || "Unassigned"}</td>
                          <td className="px-4 py-2 text-sm">{new Date(lead.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main LeadsPage Component
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

  // Modal state
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);

  // Duplicate detection state
  const [showDuplicatesModal, setShowDuplicatesModal] = useState(false);
  const [duplicates, setDuplicates] = useState([]);
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);

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

    if (role !== "ADMIN") {
      setActiveTab("assigned");
    }

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
      Swal.fire(
        "Success",
        res.data.message || "Leads uploaded successfully!",
        "success"
      );
      loadLeads();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to upload leads",
        "error"
      );
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
      await api.put(`/api/leads/${leadId}/assigned-to`, {
        assignedToId: assignUserId,
      });
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

  /** Open History Modal */
  const openHistoryModal = (leadId) => {
    setSelectedLeadId(leadId);
    setShowHistoryModal(true);
  };

  /** Close History Modal */
  const closeHistoryModal = () => {
    setShowHistoryModal(false);
    setSelectedLeadId(null);
  };

  /** Find Duplicates by Mobile Number */
  const findDuplicatesByMobile = () => {
    setCheckingDuplicates(true);
    
    // Find leads with duplicate mobile numbers
    const mobileCount = {};
    leads.forEach(lead => {
      if (lead.mobile) {
        mobileCount[lead.mobile] = (mobileCount[lead.mobile] || 0) + 1;
      }
    });

    const duplicateMobiles = Object.keys(mobileCount).filter(mobile => mobileCount[mobile] > 1);
    
    if (duplicateMobiles.length === 0) {
      Swal.fire("No Duplicates", "No duplicate mobile numbers found in the current leads list.", "info");
      setCheckingDuplicates(false);
      return;
    }

    // Get all leads with duplicate mobile numbers
    const duplicateLeads = leads.filter(lead => 
      lead.mobile && duplicateMobiles.includes(lead.mobile)
    );

    setDuplicates(duplicateLeads);
    setShowDuplicatesModal(true);
    setCheckingDuplicates(false);
  };

  /** Merge duplicate leads */
  const handleMergeLeads = async (leadIds, mergeIntoLeadId) => {
    try {
      const response = await api.post("/api/leads/merge", {
        leadIds,
        mergeIntoLeadId
      });
      
      // Reload leads after merge
      loadLeads();
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  /** Delete duplicate leads */
  const handleDeleteLeads = async (leadIds) => {
    try {
      // Delete leads one by one
      for (const leadId of leadIds) {
        await api.delete(`/api/leads/${leadId}`);
      }
      
      // Reload leads after deletion
      loadLeads();
    } catch (error) {
      throw error;
    }
  };

  /** Close Duplicates Modal */
  const closeDuplicatesModal = () => {
    setShowDuplicatesModal(false);
    setDuplicates([]);
  };

  /** Apply filters */
  const filteredLeads = leads
    .filter((lead) => {
      const cleanName = (lead.customerName || "").replace(/[^a-zA-Z ]/g, "");
      const cleanSearch = (search || "").replace(/[^a-zA-Z ]/g, "");

      return cleanName.toLowerCase().includes(cleanSearch.toLowerCase());
    })
    .filter((lead) => (filterStatus ? lead.status === filterStatus : true))
    .filter((lead) =>
      filterAssignedTo ? lead.assignedToId === filterAssignedTo : true
    )
    .filter((lead) => (filterSource ? lead.sourceName === filterSource : true));

  /** Pagination */
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const displayedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate serial number for each lead based on current page
  const getSerialNumber = (index) => {
    return (currentPage - 1) * itemsPerPage + index + 1;
  };

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

  // Check if user is admin
  const isAdmin = userRole === "ADMIN";

  return (
    <div className="p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-blue-700">
            Lead Management
          </h1>
          <p className="text-sm text-gray-600">
            <a href="/dashboard" className="text-blue-600 hover:underline">
              Dashboard
            </a>{" "}
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

      {/* TABS - Only show for ADMIN */}
      {isAdmin && (
        <div className="mb-6 border-b">
          <div className="flex space-x-1 overflow-x-auto">
            <button
              className={`px-4 py-2 font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                activeTab === "all"
                  ? "bg-blue-700 text-white border-b-2 border-blue-700"
                  : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
              }`}
              onClick={() => handleTabChange("all")}
            >
              All Leads
            </button>
            <button
              className={`px-4 py-2 font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                activeTab === "assigned"
                  ? "bg-blue-700 text-white border-b-2 border-blue-700"
                  : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
              }`}
              onClick={() => handleTabChange("assigned")}
            >
              Leads Assigned to Me
            </button>
          </div>
        </div>
      )}

      {/* ACTION BUTTONS - Bulk Assign section only for ADMIN */}
      {isAdmin && (
        <div className="mt-4 flex flex-col md:flex-row justify-between gap-3 pb-5 items-start md:items-center">
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <select
              className="border p-2 rounded w-full md:w-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={assignUserId}
              onChange={(e) => setAssignUserId(e.target.value)}
            >
              <option value="">Assign To</option>
              {usersList.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName}
                </option>
              ))}
            </select>
            <button
              className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800 whitespace-nowrap transition-colors"
              onClick={handleBulkAssignLeads}
            >
              Assign Selected Leads
            </button>
            <button
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 whitespace-nowrap transition-colors flex items-center gap-2"
              onClick={findDuplicatesByMobile}
              disabled={checkingDuplicates}
            >
              <DocumentDuplicateIcon className="w-4 h-4" />
              {checkingDuplicates ? "Checking..." : "Find Duplicates"}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-3 md:mt-0">
            <button
              onClick={() => navigate("/leads/add")}
              className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 whitespace-nowrap text-center transition-colors"
            >
              Add Lead
            </button>
            <label className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer whitespace-nowrap text-center transition-colors">
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
      )}

      {/* Action buttons for non-admin users */}
      {!isAdmin && (
        <div className="mt-4 pb-5">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => navigate("/leads/add")}
              className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 whitespace-nowrap text-center transition-colors"
            >
              Add Lead
            </button>
            <button
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 whitespace-nowrap transition-colors flex items-center gap-2"
              onClick={findDuplicatesByMobile}
              disabled={checkingDuplicates}
            >
              <DocumentDuplicateIcon className="w-4 h-4" />
              {checkingDuplicates ? "Checking..." : "Find Duplicates"}
            </button>
          </div>
        </div>
      )}

      {/* FILTERS - Show all filters for ADMIN, only status and source for non-admin */}
      <div
        className={`grid ${
          isAdmin ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"
        } gap-4 pb-5`}
      >
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Filter by Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            {leadStatusOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {isAdmin && (
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Filter by Assigned To
            </label>
            <select
              value={filterAssignedTo}
              onChange={(e) => setFilterAssignedTo(e.target.value)}
              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Employees</option>
              {usersList.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Filter by Source
          </label>
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Sources</option>
            {sourceList.map((s) => (
              <option key={s.id} value={s.sourceName}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pagination Controls - Top */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <div className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-semibold">
            {(currentPage - 1) * itemsPerPage + 1}
          </span>{" "}
          to{" "}
          <span className="font-semibold">
            {Math.min(currentPage * itemsPerPage, filteredLeads.length)}
          </span>{" "}
          of <span className="font-semibold">{filteredLeads.length}</span> leads
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 whitespace-nowrap">
            Leads per page:
          </span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="border rounded p-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-blue-100 text-blue-900">
              {isAdmin && (
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked)
                        setSelectedLeads(displayedLeads.map((l) => l.id));
                      else setSelectedLeads([]);
                    }}
                    checked={
                      displayedLeads.every((l) =>
                        selectedLeads.includes(l.id)
                      ) && displayedLeads.length > 0
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}
              <th className="px-4 py-3 font-medium">S.No</th>
              <th className="px-4 py-3 font-medium">Customer Name</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Mobile</th>
              <th className="px-4 py-3 font-medium">Email</th>

              {isAdmin && activeTab === "all" && (
                <th className="px-4 py-3 font-medium">Assigned To</th>
              )}
              <th className="px-4 py-3 font-medium text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={isAdmin ? (activeTab === "all" ? 8 : 7) : 6}
                  className="text-center py-6"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mb-2"></div>
                    <p className="text-gray-600">Loading leads...</p>
                  </div>
                </td>
              </tr>
            ) : displayedLeads.length === 0 ? (
              <tr>
                <td
                  colSpan={isAdmin ? (activeTab === "all" ? 8 : 7) : 6}
                  className="text-center py-8 text-gray-500"
                >
                  <ClockIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <p>No leads found</p>
                </td>
              </tr>
            ) : (
              displayedLeads.map((lead, index) => (
                <tr
                  key={lead.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  {isAdmin && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={() => toggleSelectLead(lead.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                  )}
                  <td className="px-4 py-3 font-medium">
                    {getSerialNumber(index)}
                  </td>
                  <td className="px-4 py-3 font-medium">{lead.customerName}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lead.status === "BOOKED_LEADS" ||
                        lead.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : lead.status === "CANCELLED"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {leadStatusOptions.find((s) => s.value === lead.status)
                        ?.label || lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{lead.mobile}</td>
                  <td className="px-4 py-3">{lead.email}</td>

                  {isAdmin && activeTab === "all" && (
                    <td className="px-4 py-3">
                      {lead.assignedToName || "Unassigned"}
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      <button
                        className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors"
                        onClick={() => navigate(`/leads/view/${lead.id}`)}
                        title="View"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      <button
                        className="text-yellow-600 hover:text-yellow-800 p-1 hover:bg-yellow-50 rounded transition-colors"
                        onClick={() => navigate(`/leads/edit/${lead.id}`)}
                        title="Edit"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        className="text-indigo-600 hover:text-indigo-800 p-1 hover:bg-indigo-50 rounded transition-colors"
                        onClick={() => openHistoryModal(lead.id)}
                        title="History"
                      >
                        <ClockIcon className="w-5 h-5" />
                      </button>
                      {isAdmin && (
                        <button
                          className="text-green-700 hover:text-green-800 px-2 py-1 rounded text-xs border border-green-700 hover:bg-green-50 transition-colors"
                          onClick={() => handleAssignSingleLead(lead.id)}
                          title="Assign"
                        >
                          Assign
                        </button>
                      )}
                      <button
                        className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors"
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
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded flex items-center gap-1 transition-colors ${
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
                  className={`min-w-[2.5rem] px-2 py-2 rounded text-sm transition-colors ${
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
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-2 rounded flex items-center gap-1 transition-colors ${
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
            <span className="text-sm text-gray-600 whitespace-nowrap">
              Go to page:
            </span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const value = Math.max(
                  1,
                  Math.min(Number(e.target.value), totalPages)
                );
                setCurrentPage(value);
              }}
              className="border rounded p-1 w-16 text-center text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {/* Lead History Modal */}
      {showHistoryModal && selectedLeadId && (
        <LeadHistoryModal leadId={selectedLeadId} onClose={closeHistoryModal} />
      )}

      {/* Duplicates Modal */}
      {showDuplicatesModal && (
        <DuplicatesModal
          duplicates={duplicates}
          onClose={closeDuplicatesModal}
          onMerge={handleMergeLeads}
          onDelete={handleDeleteLeads}
        />
      )}
    </div>
  );
};

export default LeadsPage;