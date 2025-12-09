import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxios from "../../Auth/useAxios";
import Swal from "sweetalert2";

const EditLeadPage = () => {
  const { id } = useParams();
  const api = useAxios();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [lead, setLead] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  const [sources, setSources] = useState([]);
  const [users, setUsers] = useState([]);

  /** ------------------ LEAD STATUS ENUMS ------------------ */
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
    // Get current user role and ID
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("userId");
    setUserRole(role || "");
    setCurrentUserId(id || "");
  }, []);

  /** ------------------ GET ALL SOURCES ------------------ */
  const getAllSources = async () => {
    try {
      const res = await api.get("/api/sources/get-all-sources");
      setSources(res.data);
    } catch {
      Swal.fire("Error", "Failed to load sources", "error");
    }
  };

  /** ------------------ GET ALL USERS ------------------ */
  const getAllUsers = async () => {
    try {
      const res = await api.get("/auth/id-names");
      setUsers(res.data);
    } catch {
      Swal.fire("Error", "Failed to load users", "error");
    }
  };

  /** ------------------ GET LEAD DATA ------------------ */
  const fetchLead = async () => {
    try {
      const res = await api.get(`/api/leads/${id}`);
      let data = res.data.data;

      const matchedSource = sources.find(
        (src) => src.name?.toLowerCase() === data.sourceName?.toLowerCase()
      );

      const matchedUser = users.find(
        (u) => u.fullName?.toLowerCase() === data.assignedToName?.toLowerCase()
      );

      setLead({
        ...data,
        sourceId: matchedSource?.id || "",
        assignedToId: matchedUser?.id || "",
      });
    } catch {
      Swal.fire("Error", "Failed to load lead", "error");
    }
  };

  /** -------- Fetch sources + users -------- */
  useEffect(() => {
    getAllSources();
    getAllUsers();
  }, []);

  /** -------- Fetch lead only after sources & users -------- */
  useEffect(() => {
    if (sources.length > 0 && users.length > 0) {
      fetchLead();
    }
  }, [sources, users]);

  /** ------------------ UPDATE LEAD ------------------ */
  const handleUpdate = async () => {
    if (!lead.customerName || !lead.mobile || !lead.sourceId) {
      Swal.fire("Required", "Customer Name, Mobile & Source are required", "warning");
      return;
    }

    try {
      setLoading(true);
      await api.put(`/api/leads/${id}`, lead);

      Swal.fire("Success", "Lead updated successfully!", "success");
      navigate("/leads");
    } catch {
      Swal.fire("Error", "Failed to update lead", "error");
    } finally {
      setLoading(false);
    }
  };

  // Check if user is admin
  const isAdmin = userRole === "ADMIN";

  // Get assigned user's name for display
  const getAssignedUserName = () => {
    if (!lead) return "";
    const user = users.find(u => u.id === lead.assignedToId);
    return user ? `${user.fullName} (${user.username})` : lead.assignedToName || "Not Assigned";
  };

  if (!lead) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">Lead Management</h1>
          <p className="text-sm text-gray-600">
            <a href="/dashboard" className="text-blue-600 hover:underline">Dashboard</a> /
            <a href="/leads" className="text-blue-600 hover:underline ml-1">Leads</a> /
            <span className="font-semibold text-blue-700 ml-1">Edit</span>
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 shadow-xl rounded-lg">

        <input
          type="text"
          placeholder="Customer Name *"
          className="border px-3 py-2 rounded"
          value={lead.customerName}
          onChange={(e) => setLead({ ...lead, customerName: e.target.value })}
        />

        <input
          type="text"
          placeholder="Mobile *"
          className="border px-3 py-2 rounded"
          value={lead.mobile}
          onChange={(e) => setLead({ ...lead, mobile: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          className="border px-3 py-2 rounded"
          value={lead.email}
          onChange={(e) => setLead({ ...lead, email: e.target.value })}
        />

        <input
          type="text"
          placeholder="Location"
          className="border px-3 py-2 rounded"
          value={lead.location}
          onChange={(e) => setLead({ ...lead, location: e.target.value })}
        />

        {/* Source Dropdown */}
        <select
          className="border px-3 py-2 rounded"
          value={lead.sourceId}
          onChange={(e) => setLead({ ...lead, sourceId: e.target.value })}
        >
          <option value="">Select Lead Source *</option>
          {sources.map((src) => (
            <option key={src.id} value={src.id}>
              {src.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Business Category"
          className="border px-3 py-2 rounded"
          value={lead.businessCategory}
          onChange={(e) => setLead({ ...lead, businessCategory: e.target.value })}
        />

        <input
          type="text"
          placeholder="Service"
          className="border px-3 py-2 rounded"
          value={lead.service}
          onChange={(e) => setLead({ ...lead, service: e.target.value })}
        />

        {/* Priority */}
        <select
          className="border px-3 py-2 rounded"
          value={lead.priority}
          onChange={(e) => setLead({ ...lead, priority: e.target.value })}
        >
          <option value="">Priority</option>
          <option value="HOT">HOT</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LOW">LOW</option>
        </select>

        {/* Status (ENUM) */}
        <select
          className="border px-3 py-2 rounded"
          value={lead.status}
          onChange={(e) => setLead({ ...lead, status: e.target.value })}
        >
          <option value="">Select Status</option>
          {leadStatusOptions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          className="border px-3 py-2 rounded"
          value={lead.followUpDate}
          onChange={(e) => setLead({ ...lead, followUpDate: e.target.value })}
        />

        {/* Assigned To Field - Different display for admin vs non-admin */}
        {isAdmin ? (
          // ADMIN: Show dropdown to assign to any user
          <select
            className="border px-3 py-2 rounded"
            value={lead.assignedToId}
            onChange={(e) => setLead({ ...lead, assignedToId: e.target.value })}
          >
            <option value="">Assign to Employee</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.fullName} ({u.username})
              </option>
            ))}
          </select>
        ) : (
          // NON-ADMIN: Show fixed text field (read-only) with current assignment
          <div className="border px-3 py-2 rounded bg-gray-50">
            <div className="text-sm text-gray-500">Assigned To</div>
            <div className="font-medium">{getAssignedUserName()}</div>
          </div>
        )}

        {/* Note */}
        <textarea
          placeholder="Note"
          className="border px-3 py-2 rounded md:col-span-2"
          value={lead.note}
          onChange={(e) => setLead({ ...lead, note: e.target.value })}
        ></textarea>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => navigate("/leads")}
          className="px-4 py-2 bg-gray-400 text-white rounded"
        >
          Cancel
        </button>

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Update Lead"}
        </button>
      </div>
    </div>
  );
};

export default EditLeadPage;