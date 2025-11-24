import React, { useEffect, useState } from "react";
import useAxios from "../../Auth/useAxios";
import Swal from "sweetalert2";

import {
  TrashIcon,
  PencilIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

const LeadsPage = () => {

  const api = useAxios();

  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [viewLead, setViewLead] = useState(null);

  // Add Lead modal
  const [addModalOpen, setAddModalOpen] = useState(false);
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

  // Edit Lead modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editLead, setEditLead] = useState(null);

  /** Load all leads */
  const getAllLeads = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/leads");
      setLeads(res.data.data);
      console.log(res.data.data);
    } catch (err) {
      Swal.fire("Error", "Failed to load leads", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllLeads();
  }, []);

  /** Add lead */
  const handleAddLead = async () => {
    try {
      await api.post("/api/leads", newLead);


      Swal.fire("Success", "Lead created successfully!", "success");

      setNewLead({
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

      setAddModalOpen(false);
      getAllLeads();
    } catch (err) {
      Swal.fire("Error", "Failed to add lead", "error");
    }
  };

  /** Update lead */
  const handleUpdateLead = async () => {
    try {
      await api.put(`/api/leads/${editLead.id}`, editLead);

      Swal.fire("Updated!", "Lead updated successfully!", "success");

      setEditModalOpen(false);
      setEditLead(null);
      getAllLeads();
    } catch (err) {
      Swal.fire("Error", "Failed to update lead", "error");
    }
  };

  /** Delete lead */
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
      getAllLeads();
    } catch (err) {
      Swal.fire("Error", "Failed to delete lead", "error");
    }
  };

  /** View lead */
  const handleViewLead = async (id) => {
    try {
      const res = await api.get(`/api/leads/${id}`);
      setViewLead(res.data.data);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch lead details", "error");
    }
  };

  /** Search filter */
  const filteredLeads = leads.filter((l) =>
    l.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">

      {/* Header section */}
      <div className="flex justify-between items-center mb-6">

        {/* Title + Breadcrumbs */}
        <div>
          <h1 className="text-2xl font-bold text-blue-700">Lead Management</h1>
          <p className="text-sm text-gray-600">
            <a href="/dashboard" className="text-blue-600 hover:underline">
              Dashboard
            </a>{" "}
            / <span className="font-semibold text-blue-700">Leads</span>
          </p>
        </div>

        {/* Search + Add */}
        <div className="flex items-center gap-3">
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
      </div>

      <div className="mt-4 flex justify-end gap-3 pb-5">

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
        >
          Add Lead
        </button>

        <button
          onClick={() => Swal.fire("Assign", "Assign Lead Feature Coming Soon", "info")}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Assign Lead
        </button>

        <button
         
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
        >
          Delete Checked Leads
        </button>

        <button
        
          className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
        >
          Delete All Leads
        </button>

      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-blue-100 text-blue-900">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Customer Name</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className="text-center py-6" colSpan="7">
                  Loading...
                </td>
              </tr>
            ) : filteredLeads.length === 0 ? (
              <tr>
                <td className="text-center py-6" colSpan="7">
                  No leads found
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b">
                  <td className="px-4 py-3">{lead.id}</td>
                  <td className="px-4 py-3">{lead.customerName}</td>
                  <td className="px-4 py-3">{lead.status}</td>
                  <td className="px-4 py-3">{lead.mobile}</td>
                  <td className="px-4 py-3">{lead.email}</td>
                  <td className="px-4 py-3">{lead.sourceName}</td>
                  <td className="px-4 py-3">{lead.priority}</td>

                  <td className="px-4 py-3 flex items-center justify-center gap-3">

                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleViewLead(lead.id)}
                    >
                      <EyeIcon className="w-6 h-6" />
                    </button>

                    <button
                      className="text-yellow-600 hover:text-yellow-800"
                      onClick={() => {
                        setEditLead(lead);
                        setEditModalOpen(true);
                      }}
                    >
                      <PencilIcon className="w-6 h-6" />
                    </button>

                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteLead(lead.id)}
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

      {/* Add Lead Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[500px] rounded-lg p-6 shadow-xl">

            <h2 className="text-xl font-bold mb-4">Add Lead</h2>

            {/* Form inputs */}
            <div className="grid grid-cols-1 gap-3">

              {/* Customer Name */}
              <input
                type="text"
                placeholder="Customer Name"
                className="border px-3 py-2 rounded"
                value={newLead.customerName}
                onChange={(e) =>
                  setNewLead({ ...newLead, customerName: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Mobile"
                className="border px-3 py-2 rounded"
                value={newLead.mobile}
                onChange={(e) =>
                  setNewLead({ ...newLead, mobile: e.target.value })
                }
              />

              <input
                type="email"
                placeholder="Email"
                className="border px-3 py-2 rounded"
                value={newLead.email}
                onChange={(e) =>
                  setNewLead({ ...newLead, email: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Location"
                className="border px-3 py-2 rounded"
                value={newLead.location}
                onChange={(e) =>
                  setNewLead({ ...newLead, location: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Source ID"
                className="border px-3 py-2 rounded"
                value={newLead.sourceId}
                onChange={(e) =>
                  setNewLead({ ...newLead, sourceId: e.target.value })
                }
              />

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
                onChange={(e) =>
                  setNewLead({ ...newLead, service: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Priority"
                className="border px-3 py-2 rounded"
                value={newLead.priority}
                onChange={(e) =>
                  setNewLead({ ...newLead, priority: e.target.value })
                }
              />

              <textarea
                placeholder="Note"
                className="border px-3 py-2 rounded"
                value={newLead.note}
                onChange={(e) =>
                  setNewLead({ ...newLead, note: e.target.value })
                }
              ></textarea>

              <input
                type="datetime-local"
                className="border px-3 py-2 rounded"
                value={newLead.followUpDate}
                onChange={(e) =>
                  setNewLead({ ...newLead, followUpDate: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Assigned To Employee ID"
                className="border px-3 py-2 rounded"
                value={newLead.assignedToId}
                onChange={(e) =>
                  setNewLead({ ...newLead, assignedToId: e.target.value })
                }
              />

            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setAddModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAddLead}
                className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
              >
                Add Lead
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Edit Lead Modal */}
      {editModalOpen && editLead && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[500px] rounded-lg p-6 shadow-xl">

            <h2 className="text-xl font-bold mb-4">Edit Lead</h2>

            <div className="grid grid-cols-1 gap-3">

              {/* Customer Name */}
              <input
                type="text"
                className="border px-3 py-2 rounded"
                value={editLead.customerName}
                onChange={(e) =>
                  setEditLead({ ...editLead, customerName: e.target.value })
                }
              />

              <input
                type="text"
                className="border px-3 py-2 rounded"
                value={editLead.mobile}
                onChange={(e) =>
                  setEditLead({ ...editLead, mobile: e.target.value })
                }
              />

              <input
                type="email"
                className="border px-3 py-2 rounded"
                value={editLead.email}
                onChange={(e) =>
                  setEditLead({ ...editLead, email: e.target.value })
                }
              />

              <input
                type="text"
                className="border px-3 py-2 rounded"
                value={editLead.location}
                onChange={(e) =>
                  setEditLead({ ...editLead, location: e.target.value })
                }
              />

              <input
                type="number"
                className="border px-3 py-2 rounded"
                value={editLead.sourceId}
                onChange={(e) =>
                  setEditLead({ ...editLead, sourceId: e.target.value })
                }
              />

              <input
                type="text"
                className="border px-3 py-2 rounded"
                value={editLead.businessCategory}
                onChange={(e) =>
                  setEditLead({
                    ...editLead,
                    businessCategory: e.target.value,
                  })
                }
              />

              <input
                type="text"
                className="border px-3 py-2 rounded"
                value={editLead.service}
                onChange={(e) =>
                  setEditLead({ ...editLead, service: e.target.value })
                }
              />

              <input
                type="text"
                className="border px-3 py-2 rounded"
                value={editLead.priority}
                onChange={(e) =>
                  setEditLead({ ...editLead, priority: e.target.value })
                }
              />

              <textarea
                className="border px-3 py-2 rounded"
                value={editLead.note}
                onChange={(e) =>
                  setEditLead({ ...editLead, note: e.target.value })
                }
              ></textarea>

              <input
                type="datetime-local"
                className="border px-3 py-2 rounded"
                value={editLead.followUpDate?.replace(" ", "T")}
                onChange={(e) =>
                  setEditLead({ ...editLead, followUpDate: e.target.value })
                }
              />

              <input
                type="number"
                className="border px-3 py-2 rounded"
                value={editLead.assignedToId}
                onChange={(e) =>
                  setEditLead({ ...editLead, assignedToId: e.target.value })
                }
              />

            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateLead}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Update Lead
              </button>
            </div>

          </div>
        </div>
      )}

      {/* View Lead Modal */}
      {viewLead && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[450px]">
            <h3 className="text-lg font-bold text-blue-700">Lead Details</h3>

            <div className="mt-4 text-sm space-y-1">
              <p><strong>ID:</strong> {viewLead.id}</p>
              <p><strong>Name:</strong> {viewLead.customerName}</p>
              <p><strong>Mobile:</strong> {viewLead.mobile}</p>
              <p><strong>Email:</strong> {viewLead.email}</p>
              <p><strong>Location:</strong> {viewLead.location}</p>
              <p><strong>Source:</strong> {viewLead.sourceName}</p>
              <p><strong>Priority:</strong> {viewLead.priority}</p>
              <p><strong>Service:</strong> {viewLead.service}</p>
              <p><strong>Business Category:</strong> {viewLead.businessCategory}</p>
              <p><strong>Assigned To:</strong> {viewLead.assignedToName}</p>
              <p><strong>Follow Up:</strong> {viewLead.followUpDate?.replace("T", " ")}</p>
              <p><strong>Note:</strong> {viewLead.note}</p>
            </div>

            <button
              className="mt-6 w-full py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
              onClick={() => setViewLead(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default LeadsPage;
