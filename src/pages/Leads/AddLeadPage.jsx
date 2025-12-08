import React, { useState, useEffect } from "react";
import useAxios from "../../Auth/useAxios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AddLeadPage = () => {
  const api = useAxios();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [sources, setSources] = useState([]);
  const [users, setUsers] = useState([]);

  const [newLead, setNewLead] = useState({
    customerName: "",
    mobile: "",
    email: "",
    location: "",
    sourceId: "",
    businessCategory: "",
    service: "",
    priority: "",
    status: "", // ⭐ NEW FIELD
    note: "",
    followUpDate: "",
    assignedToId: "",
  });

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

  useEffect(() => {
    getAllSources();
    getAllUsers();
  }, []);

  /** ------------------ SUBMIT ------------------ */
  const handleSubmit = async () => {
    if (!newLead.customerName || !newLead.mobile || !newLead.sourceId) {
      Swal.fire(
        "Required",
        "Customer Name, Mobile & Source are required",
        "warning"
      );
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/leads", newLead);

      Swal.fire("Success", "Lead created successfully!", "success");
      navigate("/leads");
    } catch (err) {
      Swal.fire("Error", "Failed to add lead", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 ">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">Lead Management</h1>
          <p className="text-sm text-gray-600">
            <a href="/dashboard" className="text-blue-600 hover:underline">
              Dashboard
            </a>{" "}
            / <a href="/leads" className="text-blue-600 hover:underline">
              Leads
            </a>{" "}/<span className="font-semibold text-blue-700">Add</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 shadow-xl rounded-lg">
        <input
          type="text"
          placeholder="Customer Name *"
          className="border px-3 py-2 rounded"
          value={newLead.customerName}
          onChange={(e) =>
            setNewLead({ ...newLead, customerName: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Mobile *"
          className="border px-3 py-2 rounded"
          value={newLead.mobile}
          onChange={(e) => setNewLead({ ...newLead, mobile: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          className="border px-3 py-2 rounded"
          value={newLead.email}
          onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
        />

        <input
          type="text"
          placeholder="Location"
          className="border px-3 py-2 rounded"
          value={newLead.location}
          onChange={(e) => setNewLead({ ...newLead, location: e.target.value })}
        />

        {/* Source Dropdown */}
        <select
          className="border px-3 py-2 rounded"
          value={newLead.sourceId}
          onChange={(e) => setNewLead({ ...newLead, sourceId: e.target.value })}
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
          value={newLead.businessCategory}
          onChange={(e) =>
            setNewLead({ ...newLead, businessCategory: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Service"
          className="border px-3 py-2 rounded"
          value={newLead.service}
          onChange={(e) => setNewLead({ ...newLead, service: e.target.value })}
        />

        {/* Priority */}
        <select
          className="border px-3 py-2 rounded"
          value={newLead.priority}
          onChange={(e) => setNewLead({ ...newLead, priority: e.target.value })}
        >
          <option value="">Priority</option>
          <option value="HOT">HOT</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LOW">LOW</option>
        </select>

        {/* ⭐ NEW STATUS FIELD */}
        <select
          className="border px-3 py-2 rounded"
          value={newLead.status}
          onChange={(e) => setNewLead({ ...newLead, status: e.target.value })}
        >
          <option value="">Select Status</option>
          <option value="NEW">NEW</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="FOLLOW_UP">FOLLOW UP</option>
          <option value="CONVERTED">CONVERTED</option>
          <option value="LOST">LOST</option>
        </select>

        <input
          type="datetime-local"
          className="border px-3 py-2 rounded"
          value={newLead.followUpDate}
          onChange={(e) =>
            setNewLead({ ...newLead, followUpDate: e.target.value })
          }
        />

        {/* Assigned To */}
        <select
          className="border px-3 py-2 rounded"
          value={newLead.assignedToId}
          onChange={(e) =>
            setNewLead({ ...newLead, assignedToId: e.target.value })
          }
        >
          <option value="">Assign to Employee</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.fullName}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Note"
          className="border px-3 py-2 rounded md:col-span-2"
          value={newLead.note}
          onChange={(e) => setNewLead({ ...newLead, note: e.target.value })}
        ></textarea>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => navigate("/leads")}
          className="px-4 py-2 bg-gray-400 text-white rounded"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Add Lead"}
        </button>
      </div>
    </div>
  );
};

export default AddLeadPage;
