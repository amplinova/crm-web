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

  /** Load all leads */
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

  useEffect(() => {
    getAllLeads();
  }, []);

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

  /** Search filter */
  const filteredLeads = leads.filter((l) =>
    l.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">Lead Management</h1>
          <p className="text-sm text-gray-600">
            <a href="/dashboard" className="text-blue-600 hover:underline">
              Dashboard
            </a>{" "}
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
          <button className="px-4 py-2 bg-blue-700 text-white">Search</button>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex justify-end gap-3 pb-5">

        <button
          onClick={() => navigate("/leads/add")}
          className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
        >
          Add Lead
        </button>

        <button
          onClick={() =>
            Swal.fire("Assign", "Assign Lead Feature Coming Soon", "info")
          }
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Assign Lead
        </button>

        <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
          Delete Checked Leads
        </button>

        <button className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800">
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
                <td colSpan="7" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6">
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
                      onClick={() => navigate(`/leads/view/${lead.id}`)}
                    >
                      <EyeIcon className="w-6 h-6" />
                    </button>

                    <button
                      className="text-yellow-600 hover:text-yellow-800"
                      onClick={() => navigate(`/leads/edit/${lead.id}`)}
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

    </div>
  );
};

export default LeadsPage;
