import React, { useEffect, useState } from "react";
import useAxios from "../Auth/useAxios";
import Swal from "sweetalert2";

// Heroicons
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

const SourcePage = () => {
  const [sources, setSources] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [viewSource, setViewSource] = useState(null);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newSourceName, setNewSourceName] = useState("");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editSource, setEditSource] = useState({ id: null, name: "" });

  const api = useAxios();

  /** Load all sources */
  const getAllSources = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/sources/get-all-sources");
      setSources(res.data);
    } catch (err) {
      Swal.fire("Error", "Failed to load sources", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllSources();
  }, []);

  /** Add new source */
  const handleAddSource = async () => {
    if (!newSourceName.trim()) {
      return Swal.fire("Warning", "Source name cannot be empty", "warning");
    }

    try {
      await api.post("/api/sources/add-source", { name: newSourceName });

      Swal.fire("Success", "Source added successfully!", "success");

      setNewSourceName("");
      setAddModalOpen(false);
      getAllSources();
    } catch (err) {
      Swal.fire("Error", "Failed to add source", "error");
    }
  };

  /** Update source */
  const handleUpdateSource = async () => {
    if (!editSource.name.trim()) {
      return Swal.fire("Warning", "Source name cannot be empty", "warning");
    }

    try {
      await api.put(`/api/sources/edit-source/${editSource.id}`, {
        name: editSource.name,
      });

      Swal.fire("Updated!", "Source updated successfully", "success");

      setEditModalOpen(false);
      setEditSource({ id: null, name: "" });
      getAllSources();
    } catch (err) {
      Swal.fire("Error", "Failed to update source", "error");
    }
  };

  /** Delete Confirmation */
  const handleDeleteSource = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This source will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/api/sources/delete-source/${id}`);
      Swal.fire("Deleted!", "Source has been deleted.", "success");
      getAllSources();
    } catch (err) {
      Swal.fire("Error", "Failed to delete source", "error");
    }
  };

  /** View modal */
  const handleViewSource = async (id) => {
    try {
      const res = await api.get(`/api/sources/get-source/${id}`);
      setViewSource(res.data);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch source details", "error");
    }
  };

  /** Search filtering */
  const filteredSources = sources.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* HEADER: Title + Breadcrumbs + Search + Add Button */}
      <div className="flex justify-between items-center mb-6">
        {/* Left: Title + Breadcrumbs */}
        <div>
          <h1 className="text-2xl font-bold text-blue-700">
            Source Management
          </h1>

          <p className="text-sm text-gray-600">
            <a
              href="/dashboard"
              className="text-blue-600 hover:underline hover:text-blue-800"
            >
              Dashboard
            </a>
            {" / "}
            <span className="font-semibold text-black-700">Sources</span>
          </p>
        </div>

        {/* Right: Search bar + Add Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center border rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Search sources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 outline-none"
            />
            <button className="px-4 py-2 bg-blue-700 text-white hover:bg-blue-800">
              Search
            </button>
          </div>

          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
          >
            <PlusIcon className="w-5 h-5" />
            Add Source
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-blue-100 text-blue-900">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Source Name</th>
              <th className="px-4 py-3">Created At</th>
              <th className="px-4 py-3">Created By</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : filteredSources.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6">
                  No sources found
                </td>
              </tr>
            ) : (
              filteredSources.map((src) => (
                <tr key={src.id} className="border-b">
                  <td className="px-4 py-3">{src.id}</td>
                  <td className="px-4 py-3">{src.name}</td>
                  <td className="px-4 py-3">
                    {src.createdAt?.replace("T", " ")}
                  </td>
                  <td className="px-4 py-3">{src.createdBy || "N/A"}</td>

                  <td className="px-4 py-3 flex items-center justify-center gap-3">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleViewSource(src.id)}
                    >
                      <EyeIcon className="w-6 h-6" />
                    </button>

                    <button
                      className="text-yellow-600 hover:text-yellow-800"
                      onClick={() => {
                        setEditSource({ id: src.id, name: src.name });
                        setEditModalOpen(true);
                      }}
                    >
                      <PencilIcon className="w-6 h-6" />
                    </button>

                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteSource(src.id)}
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

      {/* Add Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-96 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add New Source</h2>

            <input
              type="text"
              placeholder="Enter source name"
              value={newSourceName}
              onChange={(e) => setNewSourceName(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setAddModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAddSource}
                className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-96 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit Source</h2>

            <input
              type="text"
              value={editSource.name}
              onChange={(e) =>
                setEditSource((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full border px-3 py-2 rounded"
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateSource}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewSource && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-96">
            <h3 className="text-lg font-bold text-blue-700">Source Details</h3>

            <div className="mt-4">
              <p>
                <strong>ID:</strong> {viewSource.id}
              </p>
              <p>
                <strong>Name:</strong> {viewSource.name}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {viewSource.createdAt?.replace("T", " ")}
              </p>
              <p>
                <strong>Created By:</strong> {viewSource.createdBy || "N/A"}
              </p>
            </div>

            <button
              className="mt-6 w-full py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
              onClick={() => setViewSource(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SourcePage;
