import React, { useState } from "react";
import useAxios from "../../Auth/useAxios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AddLeadPage = () => {
  const api = useAxios();
  const navigate = useNavigate();

  const [newLead, setNewLead] = useState({
    customerName: "",
    mobile: "",
    email: "",
    location: "",
    sourceId: "",
    businessCategory: "",
    service: "",
    priority: "",
    note: "",
    followUpDate: "",
    assignedToId: "",
  });

  const handleSubmit = async () => {
    try {
      await api.post("/api/leads", newLead);

      Swal.fire("Success", "Lead created successfully!", "success");
      navigate("/leads");
    } catch (err) {
      Swal.fire("Error", "Failed to add lead", "error");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Add Lead</h1>

      <div className="grid grid-cols-1 gap-3 bg-white p-6 shadow-xl rounded-lg">

        <input type="text" placeholder="Customer Name" className="border px-3 py-2 rounded"
          value={newLead.customerName}
          onChange={(e) => setNewLead({ ...newLead, customerName: e.target.value })} />

        <input type="text" placeholder="Mobile" className="border px-3 py-2 rounded"
          value={newLead.mobile}
          onChange={(e) => setNewLead({ ...newLead, mobile: e.target.value })} />

        <input type="email" placeholder="Email" className="border px-3 py-2 rounded"
          value={newLead.email}
          onChange={(e) => setNewLead({ ...newLead, email: e.target.value })} />

        <input type="text" placeholder="Location" className="border px-3 py-2 rounded"
          value={newLead.location}
          onChange={(e) => setNewLead({ ...newLead, location: e.target.value })} />

        <input type="number" placeholder="Source ID" className="border px-3 py-2 rounded"
          value={newLead.sourceId}
          onChange={(e) => setNewLead({ ...newLead, sourceId: e.target.value })} />

        <input type="text" placeholder="Business Category" className="border px-3 py-2 rounded"
          value={newLead.businessCategory}
          onChange={(e) => setNewLead({ ...newLead, businessCategory: e.target.value })} />

        <input type="text" placeholder="Service" className="border px-3 py-2 rounded"
          value={newLead.service}
          onChange={(e) => setNewLead({ ...newLead, service: e.target.value })} />

        <input type="text" placeholder="Priority" className="border px-3 py-2 rounded"
          value={newLead.priority}
          onChange={(e) => setNewLead({ ...newLead, priority: e.target.value })} />

        <textarea placeholder="Note" className="border px-3 py-2 rounded"
          value={newLead.note}
          onChange={(e) => setNewLead({ ...newLead, note: e.target.value })}></textarea>

        <input type="datetime-local" className="border px-3 py-2 rounded"
          value={newLead.followUpDate}
          onChange={(e) => setNewLead({ ...newLead, followUpDate: e.target.value })} />

        <input type="number" placeholder="Assigned To Employee ID" className="border px-3 py-2 rounded"
          value={newLead.assignedToId}
          onChange={(e) => setNewLead({ ...newLead, assignedToId: e.target.value })} />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button onClick={() => navigate("/leads")}
          className="px-4 py-2 bg-gray-400 text-white rounded">
          Cancel
        </button>

        <button onClick={handleSubmit}
          className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800">
          Add Lead
        </button>
      </div>
    </div>
  );
};

export default AddLeadPage;
