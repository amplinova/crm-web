import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxios from "../../Auth/useAxios";
import Swal from "sweetalert2";
import {
  ClockIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

import MessagingModal from "./MessagingModal"; // New messaging modal

const AddHistoryModal = ({ leadId, onClose, onSuccess }) => {
  const api = useAxios();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    description: "",
    status: "",
    nextScheduleDateTime: "",
    callType: "",
    priority: "",
    callOutcome: "", // ✅ NEW

    // 🔽 DEMO RELATED
    demoDateTime: "",
    demoSession: "",
    demoMode: "",
    businessName: "",
    demoAttendedBy: "",
    closingChance: "",
  });

  const isDemoOutcome = [
    "DEMO_FIXED",
    "DEMO_RESCHEDULED",
    "DEMO_CONDUCTED",
  ].includes(formData.callOutcome);

  // 🔒 STATUS OPTIONS — UNCHANGED
  const statusOptions = [
    { value: "NEW_LEADS", label: "New Leads" },
  { value: "QUALIFIED_LEADS", label: "Qualified Leads" },
  { value: "DISQUALIFIED_LEADS", label: "Disqualified Leads" },
  { value: "PENDING_LEADS", label: "Pending Leads" },
  { value: "INTERESTED_LEADS", label: "Interested Leads" },
  { value: "NOT_INTERESTED_LEADS", label: "Not Interested" },
  { value: "BUY_LATER", label: "Buy Later" },
  { value: "INVALID_NUMBER", label: "Invalid Number" },
  { value: "NOT_PICKED_LEADS", label: "Not Picked" },

  { value: "DEMO_SCHEDULED_LEADS", label: "Demo Scheduled" },
  { value: "DEMO_CONDUCTED", label: "Demo Conducted" },
  { value: "DEMO_RESCHEDULED", label: "Demo Rescheduled" },

  { value: "CALL_SCHEDULED_LEADS", label: "Call Scheduled" },
  { value: "VISIT_SCHEDULED_LEADS", label: "Visit Scheduled" },
  { value: "VISIT_DONE_LEADS", label: "Visit Done" },

  { value: "SALE_DONE", label: "Sale Done" },
  { value: "SALE_DONE_PAYMENT_PENDING", label: "Sale Done – Payment Pending" },
  { value: "PAYMENT_PENDING", label: "Payment Pending" },

  { value: "RETENTION_CLIENTS", label: "Retention Client" },
  { value: "OTHERS", label: "Others" },
  ];

  // ✅ CALL OUTCOME OPTIONS (NEW SECTION)
  const callOutcomeOptions = [
    { value: "FIRST_CALL_DONE", label: "First Call Done" },
    { value: "FOLLOW_UP_CALL_DONE", label: "Follow-up Call Done" },
    { value: "CALLED_NOT_PICKED", label: "Called but Not Picked" },
    { value: "DEMO_FIXED", label: "Demo Fixed" },
    { value: "DEMO_CONDUCTED", label: "Demo Conducted" },
    { value: "DEMO_RESCHEDULED", label: "Demo Rescheduled" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.description || !formData.status) {
      Swal.fire("Error", "Description and status are required", "error");
      return;
    }

    const payload = {
  leadId,
  description: formData.description,
  status: formData.status,
  contactDate: null,
  nextScheduleDateTime: formData.nextScheduleDateTime || null,
  callType: formData.callType || null,
  priority: formData.priority || null,
  callOutcome: formData.callOutcome || null,

  // 🔽 DEMO DETAILS
  demoDateTime: isDemoOutcome ? formData.demoDateTime : null,
  demoSession: isDemoOutcome ? formData.demoSession : null,
  demoMode: isDemoOutcome ? formData.demoMode : null,
  businessName: isDemoOutcome ? formData.businessName : null,
  demoAttendedBy: isDemoOutcome ? formData.demoAttendedBy : null,
  closingChance: isDemoOutcome ? formData.closingChance : null,
};


    try {
      setLoading(true);
      await api.post("/api/leads/add-history", payload);

      Swal.fire("Success", "History entry added successfully", "success");
      onSuccess();
      onClose();
    } catch (error) {
      Swal.fire("Error", "Failed to add history entry", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-blue-700">Add History Entry</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="4"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>

            {/* Status + Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  required
                >
                  <option value="">Select Status</option>
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                >
                  <option value="">Select Priority</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
            </div>

            {/* Next Follow-up + Call Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next Follow-up
                </label>
                <input
                  type="datetime-local"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.nextScheduleDateTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nextScheduleDateTime: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Call Type
                </label>
                <select
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={formData.callType}
                  onChange={(e) =>
                    setFormData({ ...formData, callType: e.target.value })
                  }
                >
                  <option value="">Select Call Type</option>
                  <option value="INCOMING">Incoming</option>
                  <option value="OUTGOING">Outgoing</option>
                  <option value="MISSED">Missed</option>
                </select>
              </div>
            </div>

            {/* ✅ CALL OUTCOME SECTION */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Call Outcome
              </label>
              <select
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={formData.callOutcome}
                onChange={(e) =>
                  setFormData({ ...formData, callOutcome: e.target.value })
                }
              >
                <option value="">Select Call Outcome</option>
                {callOutcomeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 🔽 DEMO DETAILS (Only for Demo Outcomes) */}
            {isDemoOutcome && (
              <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
                <h3 className="text-md font-semibold text-gray-700">
                  Demo Details
                </h3>

                {/* Demo Date & Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Demo Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.demoDateTime}
                    onChange={(e) =>
                      setFormData({ ...formData, demoDateTime: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Session + Mode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Session
                    </label>
                    <select
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.demoSession}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          demoSession: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Session</option>
                      <option value="MORNING">Morning</option>
                      <option value="EVENING">Evening</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Demo Mode
                    </label>
                    <select
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.demoMode}
                      onChange={(e) =>
                        setFormData({ ...formData, demoMode: e.target.value })
                      }
                    >
                      <option value="">Select Mode</option>
                      <option value="VIRTUAL">Virtual</option>
                      <option value="PHYSICAL">Physical</option>
                    </select>
                  </div>
                </div>

                {/* Business Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.businessName}
                    onChange={(e) =>
                      setFormData({ ...formData, businessName: e.target.value })
                    }
                    placeholder="Enter business name"
                  />
                </div>

                {/* Attended By + Closing Chance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Attended By
                    </label>
                    <select
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.demoAttendedBy}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          demoAttendedBy: e.target.value,
                        })
                      }
                    >
                      <option value="">Select</option>
                      <option value="OWNER">Owner</option>
                      <option value="EMPLOYEE">Employee</option>
                      <option value="OTHERS">Others</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Closing Chance
                    </label>
                    <select
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.closingChance}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          closingChance: e.target.value,
                        })
                      }
                    >
                      <option value="">Select</option>
                      <option value="HIGH">High</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="LOW">Low</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {loading ? "Saving..." : "Save History Entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Pagination Component (same as before)
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
}) => {
  const pageOptions = [5, 10, 20, 50];

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        end = Math.min(totalPages - 1, maxVisiblePages - 1);
      }
      if (currentPage >= totalPages - 1) {
        start = Math.max(2, totalPages - (maxVisiblePages - 2));
      }

      pages.push(1);
      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push("...");
      if (totalPages > 1) pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Items per page:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {pageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-600">
          Showing {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
          {totalItems} items
        </span>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded ${
              currentPage === 1
                ? "text-gray-400"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>

          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === "number" && onPageChange(page)}
              disabled={page === "..." || page === currentPage}
              className={`min-w-[2rem] px-2 py-1 rounded text-sm ${
                page === "..."
                  ? "cursor-default"
                  : page === currentPage
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded ${
              currentPage === totalPages
                ? "text-gray-400"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

// Main ViewLeadPage Component
const ViewLeadPage = () => {
  const { id } = useParams();
  const leadId = Number(id);
  const api = useAxios();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [activeTab, setActiveTab] = useState("activity");

  const [emails, setEmails] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);

  // Pagination states
  const [activityPage, setActivityPage] = useState(1);
  const [emailPage, setEmailPage] = useState(1);
  const [taskPage, setTaskPage] = useState(1);

  const [activityPerPage, setActivityPerPage] = useState(10);
  const [emailPerPage, setEmailPerPage] = useState(10);
  const [taskPerPage, setTaskPerPage] = useState(10);

  // Modal states
  const [showAddHistoryModal, setShowAddHistoryModal] = useState(false);
  const [showMessagingModal, setShowMessagingModal] = useState(false);

  /** ------------------ FETCH LEAD ------------------ */
  const fetchLead = async () => {
    try {
      const res = await api.get(`/api/leads/${leadId}`);
      setLead(res.data.data);
    } catch (err) {
      Swal.fire("Error", "Failed to load lead", "error");
    }
  };

  /** ------------------ FETCH ACTIVITIES ------------------ */
  const fetchActivities = async () => {
    try {
      const historyRes = await api.get(`/api/leads/get-history/${leadId}`);
      const historyData = historyRes.data.data || [];

      const activitiesRes = await api.get(`/api/leads/${leadId}/activities`);
      const activitiesData = activitiesRes.data || [];

      const combined = [
        ...historyData.map((item) => ({
          ...item,
          type: "history",
          date: item.contactDate || item.createdAt,
          title: item.status || "History Entry",
          description: item.description,
          processedBy: item.processedByName,
          metadata: {
            nextScheduleDateTime: item.nextScheduleDateTime,
            callType: item.callType,
            priority: item.priority,
            recordedFileName: item.recordedFileName,
          },
        })),
        ...activitiesData.map((item) => ({
          ...item,
          type: "activity",
          date: item.createdAt,
          title: "Activity",
          description: item.message,
          processedBy: item.userName || "System",
          metadata: {},
        })),
      ];

      combined.sort((a, b) => new Date(b.date) - new Date(a.date));
      setActivities(combined);
    } catch (err) {
      console.error("Failed to load activities:", err);
      setActivities([]);
    }
  };

  /** ------------------ FETCH EMAILS ------------------ */
  const fetchEmails = async () => {
    try {
      const res = await api.get(`/api/leads/${leadId}/emails`);
      setEmails(res.data);
    } catch (err) {
      setEmails([]);
    }
  };

  /** ------------------ FETCH TASKS ------------------ */
  const fetchTasks = async () => {
    try {
      const res = await api.get(`/api/leads/${leadId}/tasks`);
      setTasks(res.data);
    } catch (err) {
      setTasks([]);
    }
  };

  /** ------------------ LOAD ALL DATA ------------------ */
  useEffect(() => {
    fetchLead();
    fetchActivities();
    fetchEmails();
    fetchTasks();
  }, [id]);

  /** ------------------ HANDLE HISTORY SUCCESS ------------------ */
  const handleHistorySuccess = () => {
    fetchActivities();
    fetchLead();
    setActivityPage(1);
  };

  /** ------------------ HANDLE MESSAGE SUCCESS ------------------ */
  const handleMessageSuccess = () => {
    fetchActivities(); // Refresh to show the new activity
  };

  // Calculate paginated data
  const getPaginatedActivities = () => {
    const startIndex = (activityPage - 1) * activityPerPage;
    const endIndex = startIndex + activityPerPage;
    return activities.slice(startIndex, endIndex);
  };

  const getPaginatedEmails = () => {
    const startIndex = (emailPage - 1) * emailPerPage;
    const endIndex = startIndex + emailPerPage;
    return emails.slice(startIndex, endIndex);
  };

  const getPaginatedTasks = () => {
    const startIndex = (taskPage - 1) * taskPerPage;
    const endIndex = startIndex + taskPerPage;
    return tasks.slice(startIndex, endIndex);
  };

  // Calculate total pages
  const activityTotalPages = Math.ceil(activities.length / activityPerPage);
  const emailTotalPages = Math.ceil(emails.length / emailPerPage);
  const taskTotalPages = Math.ceil(tasks.length / taskPerPage);

  if (!lead)
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lead details...</p>
        </div>
      </div>
    );

  return (
    <div className="p-6">
      {/* -------------------- TOP HEADER -------------------- */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-start justify-between">
          {/* Lead Info */}
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {lead.customerName
                ? lead.customerName.charAt(0).toUpperCase()
                : "L"}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {lead.customerName}
              </h1>
              <p className="text-gray-600 mt-1">
                {lead.address || lead.location || "Address not available"}
              </p>

              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <PhoneIcon className="w-4 h-4" />
                  <span className="font-medium">{lead.mobile}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <EnvelopeIcon className="w-4 h-4" />
                  <span className="font-medium">
                    {lead.email || "No email"}
                  </span>
                </div>

                {lead.followUpDate && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <CalendarDaysIcon className="w-4 h-4" />
                    <span className="font-medium">
                      Follow-up:{" "}
                      {new Date(lead.followUpDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status & Actions */}
          <div className="flex flex-col items-end gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm text-gray-500">Status</div>

                {/** Determine status safely */}
                {(() => {
                  const status = lead?.status || "UNKNOWN";

                  const statusClasses =
                    status === "BOOKED_LEADS" || status === "COMPLETED"
                      ? "bg-green-100 text-green-800"
                      : status === "CANCELLED"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800";

                  return (
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${statusClasses}`}
                    >
                      {status.replace(/_/g, " ")}
                    </span>
                  );
                })()}
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-500">Priority</div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    lead.priority === "HIGH"
                      ? "bg-red-100 text-red-800"
                      : lead.priority === "MEDIUM"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {lead.priority || "Not set"}
                </span>
              </div>
            </div>

            {/* Communication Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowMessagingModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md flex items-center gap-2"
              >
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                Send Message
              </button>

              <button
                onClick={() => navigate(`/leads/edit/${lead.id}`)}
                className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-md"
              >
                Edit Lead
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------- MAIN AREA -------------------- */}
      <div className="flex gap-6 mt-6">
        {/* LEFT SIDE DETAILS */}
        <div className="w-1/3">
          <div className="bg-white p-5 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Lead Information
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase">
                    Lead ID
                  </label>
                  <div className="font-mono text-gray-800 font-bold">
                    #{lead.id}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase">
                    Source
                  </label>
                  <div className="text-gray-800">{lead.sourceName}</div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase">
                  Category
                </label>
                <div className="text-gray-800">
                  {lead.businessCategory || "-"}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase">
                  Assigned To
                </label>
                <div className="text-gray-800">
                  {lead.assignedToName || "Unassigned"}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase">
                  Notes
                </label>
                <div className="text-gray-700 bg-gray-50 p-3 rounded-lg mt-1">
                  {lead.note || "No notes added"}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => setShowMessagingModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                Send SMS/WhatsApp
              </button>

              <button
                onClick={() => setShowAddHistoryModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
              >
                <ClockIcon className="w-5 h-5" />
                Add History Entry
              </button>

              <button
                onClick={() => navigate(`/leads/edit/${lead.id}`)}
                className="w-full px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Edit Lead Details
              </button>
            </div>
          </div>
        </div>

        {/* -------------------- RIGHT TABS -------------------- */}
        <div className="w-2/3 bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center border-b">
            <div className="flex">
              {["activity", "emails", "task"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-semibold text-sm uppercase tracking-wider ${
                    activeTab === tab
                      ? "text-blue-700 border-b-2 border-blue-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab === "activity"
                    ? "Activity & History"
                    : tab === "emails"
                    ? "Emails"
                    : "Tasks"}
                </button>
              ))}
            </div>

            {/* Add History Button */}
            {activeTab === "activity" && (
              <div className="pr-6">
                <button
                  onClick={() => setShowAddHistoryModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                >
                  <ClockIcon className="w-4 h-4" />
                  Add History
                </button>
              </div>
            )}
          </div>

          {/* -------------------- TAB BODY -------------------- */}
          <div className="p-6">
            {/* ============ ACTIVITY & HISTORY TAB ============ */}
            {activeTab === "activity" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-blue-700">
                    Lead Activity & History
                  </h3>
                  <div className="text-sm text-gray-500">
                    {activities.length} total entries
                  </div>
                </div>

                {activities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ClockIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-lg">
                      No activity or history found for this lead.
                    </p>
                    <button
                      onClick={() => setShowAddHistoryModal(true)}
                      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add First History Entry
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-6">
                      {getPaginatedActivities().map((item, index) => (
                        <div
                          key={`${item.type}-${item.id || index}`}
                          className={`border-l-4 pl-4 py-3 rounded-r-lg ${
                            item.type === "history"
                              ? "border-l-blue-500 bg-blue-50"
                              : "border-l-gray-400 bg-gray-50"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className={`px-2 py-1 text-xs rounded-full font-medium ${
                                    item.type === "history"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {item.type === "history"
                                    ? "History Entry"
                                    : "System Activity"}
                                </span>

                                {item.type === "history" && item.status && (
                                  <span
                                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                                      item.status === "BOOKED_LEADS" ||
                                      item.status === "COMPLETED"
                                        ? "bg-green-100 text-green-800"
                                        : item.status === "CANCELLED"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    {item.status.replace(/_/g, " ")}
                                  </span>
                                )}
                              </div>

                              <div className="text-gray-800 mb-2">
                                {item.description || item.message}
                              </div>

                              {/* Metadata for history entries */}
                              {item.type === "history" && item.metadata && (
                                <div className="mt-2 text-sm text-gray-600 space-y-1">
                                  {(item.metadata.callType ||
                                    item.metadata.priority ||
                                    item.metadata.nextScheduleDateTime) && (
                                    <div className="flex flex-wrap gap-2">
                                      {item.metadata.callType && (
                                        <span className="bg-gray-100 px-2 py-1 rounded">
                                          📞 {item.metadata.callType}
                                        </span>
                                      )}
                                      {item.metadata.priority && (
                                        <span
                                          className={`px-2 py-1 rounded ${
                                            item.metadata.priority === "HIGH"
                                              ? "bg-red-100 text-red-800"
                                              : item.metadata.priority ===
                                                "MEDIUM"
                                              ? "bg-yellow-100 text-yellow-800"
                                              : "bg-green-100 text-green-800"
                                          }`}
                                        >
                                          ⚡ {item.metadata.priority}
                                        </span>
                                      )}
                                    </div>
                                  )}

                                  {item.metadata.nextScheduleDateTime && (
                                    <div className="text-blue-600">
                                      <span className="font-medium">
                                        Next follow-up:
                                      </span>{" "}
                                      {new Date(
                                        item.metadata.nextScheduleDateTime
                                      ).toLocaleString()}
                                    </div>
                                  )}

                                  {item.metadata.recordedFileName && (
                                    <div>
                                      <span className="font-medium">
                                        Recording:
                                      </span>{" "}
                                      <a
                                        href={`/uploads/leads/recordings/${item.metadata.recordedFileName}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 hover:underline"
                                      >
                                        Listen
                                      </a>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="text-right ml-4">
                              <div className="text-sm text-gray-500 whitespace-nowrap">
                                {item.date
                                  ? new Date(item.date).toLocaleString()
                                  : "No date"}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                By: {item.processedBy || "System"}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Activity Pagination */}
                    {activities.length > 0 && (
                      <Pagination
                        currentPage={activityPage}
                        totalPages={activityTotalPages}
                        onPageChange={setActivityPage}
                        itemsPerPage={activityPerPage}
                        onItemsPerPageChange={setActivityPerPage}
                        totalItems={activities.length}
                      />
                    )}
                  </>
                )}
              </div>
            )}

            {/* ============ EMAIL TAB ============ */}
            {activeTab === "emails" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-blue-700">Emails</h3>
                  <div className="text-sm text-gray-500">
                    {emails.length} total emails
                  </div>
                </div>

                {emails.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No emails found for this lead.</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {getPaginatedEmails().map((email) => (
                        <div
                          key={email.id}
                          className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-semibold text-gray-800">
                                {email.subject}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {email.sentAt
                                  ? new Date(email.sentAt).toLocaleString()
                                  : new Date(email.createdAt).toLocaleString()}
                              </div>
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">
                                {email.fromEmail}
                              </span>
                              <span className="mx-2">→</span>
                              <span className="font-medium">
                                {email.toEmail}
                              </span>
                            </div>
                          </div>

                          <div className="text-gray-700 mt-3 mb-2">
                            {email.description}
                          </div>

                          <div
                            className={`text-xs px-2 py-1 rounded-full inline-block ${
                              email.status === "SENT"
                                ? "bg-green-100 text-green-800"
                                : email.status === "FAILED"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            Status: {email.status}
                            {email.errorMessage && ` - ${email.errorMessage}`}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Email Pagination */}
                    {emails.length > 0 && (
                      <Pagination
                        currentPage={emailPage}
                        totalPages={emailTotalPages}
                        onPageChange={setEmailPage}
                        itemsPerPage={emailPerPage}
                        onItemsPerPageChange={setEmailPerPage}
                        totalItems={emails.length}
                      />
                    )}
                  </>
                )}
              </div>
            )}

            {/* ============ TASK TAB ============ */}
            {activeTab === "task" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-blue-700">Tasks</h3>
                  <div className="text-sm text-gray-500">
                    {tasks.length} total tasks
                  </div>
                </div>

                {tasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No tasks assigned to this lead.</p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto rounded-lg border">
                      <table className="min-w-full text-left">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-3 font-medium text-gray-700">
                              Title
                            </th>
                            <th className="px-4 py-3 font-medium text-gray-700">
                              Start Date
                            </th>
                            <th className="px-4 py-3 font-medium text-gray-700">
                              End Date
                            </th>
                            <th className="px-4 py-3 font-medium text-gray-700">
                              Assigned To
                            </th>
                            <th className="px-4 py-3 font-medium text-gray-700">
                              Priority
                            </th>
                            <th className="px-4 py-3 font-medium text-gray-700">
                              Description
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {getPaginatedTasks().map((t) => (
                            <tr
                              key={t.id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-4 py-3 font-medium">
                                {t.title}
                              </td>
                              <td className="px-4 py-3">
                                {t.startDate
                                  ? new Date(t.startDate).toLocaleDateString()
                                  : "-"}
                              </td>
                              <td className="px-4 py-3">
                                {t.endDate
                                  ? new Date(t.endDate).toLocaleDateString()
                                  : "-"}
                              </td>
                              <td className="px-4 py-3">{t.assignedToName}</td>
                              <td className="px-4 py-3">
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${
                                    t.priority === "HIGH"
                                      ? "bg-red-100 text-red-800"
                                      : t.priority === "MEDIUM"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {t.priority}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-600">
                                {t.description}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Task Pagination */}
                    {tasks.length > 0 && (
                      <Pagination
                        currentPage={taskPage}
                        totalPages={taskTotalPages}
                        onPageChange={setTaskPage}
                        itemsPerPage={taskPerPage}
                        onItemsPerPageChange={setTaskPerPage}
                        totalItems={tasks.length}
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------------- BACK BUTTON ---------------- */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => navigate("/leads")}
          className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
        >
          Back to Leads
        </button>
      </div>

      {/* Modals */}
      {showAddHistoryModal && (
        <AddHistoryModal
          leadId={leadId}
          onClose={() => setShowAddHistoryModal(false)}
          onSuccess={handleHistorySuccess}
        />
      )}

      {showMessagingModal && lead && (
        <MessagingModal
          lead={lead}
          onClose={() => setShowMessagingModal(false)}
          onSuccess={handleMessageSuccess}
        />
      )}
    </div>
  );
};

export default ViewLeadPage;
