import React, { useState, useEffect } from "react";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import useAxios from "../../Auth/useAxios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");
  const api = useAxios();
  const navigate = useNavigate();

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(null);
  const [showEditModal, setShowEditModal] = useState(null);

  // Delete confirmation modal
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
  });

  // Fetch all roles from backend
  const fetchRoles = async () => {
    try {
      const res = await api.get("/api/roles");
      setRoles(res.data.data);
    } catch (error) {
      Swal.fire("Error", "Failed to load roles", "error");
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(search.toLowerCase())
  );

  // DELETE role
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/roles/${id}`);
      setRoles(roles.filter((role) => role.id !== id));
      setDeleteConfirm(null);
      Swal.fire("Deleted!", "Role deleted successfully", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to delete role", "error");
    }
  };

  // ADD role
  const handleAddRole = async () => {
    try {
      const res = await api.post("/api/roles", newRole);
      setRoles([...roles, res.data]);
      setNewRole({ name: "", description: "" });
      setShowAddModal(false);
      Swal.fire("Success", "Role added successfully", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to add role", "error");
    }
  };

  // EDIT role
  const handleEditRole = async () => {
    try {
      const res = await api.put(
        `/api/roles/${showEditModal.id}`,
        showEditModal
      );
      const updated = roles.map((r) => (r.id === res.data.id ? res.data : r));
      setRoles(updated);
      setShowEditModal(null);
      Swal.fire("Success", "Role updated successfully", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to update role", "error");
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">Roles</h1>
          <p className="text-sm text-gray-600">
            <a href="/dashboard" className="text-blue-600 hover:underline">
              Dashboard
            </a>{" "}
            / <span className="font-semibold text-blue-700">Roles</span>
          </p>
        </div>

        {/* Search Input */}
        <div className="flex items-center border rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 outline-none"
          />
          <button className="px-4 py-2 bg-blue-700 text-white">Search</button>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-end gap-3 mb-5">
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
        >
          Add Role
        </button>

        <button
          className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
          onClick={() => {
            Swal.fire({
              title: "Are you sure?",
              text: "This will delete all roles!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#d33",
              cancelButtonColor: "#3085d6",
              confirmButtonText: "Yes, delete all!",
            }).then(async (result) => {
              if (result.isConfirmed) {
                try {
                  await Promise.all(
                    roles.map((role) => api.delete(`/api/roles/${role.id}`))
                  );
                  setRoles([]);
                  Swal.fire(
                    "Deleted!",
                    "All roles have been deleted.",
                    "success"
                  );
                } catch {
                  Swal.fire("Error", "Failed to delete roles", "error");
                }
              }
            });
          }}
        >
          Delete All Roles
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-blue-100 text-blue-900">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Role Name</th>
              <th className="px-4 py-3">Permissions</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredRoles.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6">
                  No roles found
                </td>
              </tr>
            ) : (
              filteredRoles.map((role) => (
                <tr key={role.id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-3">{role.id}</td>
                  <td className="px-4 py-3">{role.name}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() =>
                        navigate(`/team-structure/roles/permissions/${role.id}`)
                      }
                      className="text-purple-600 font-semibold underline"
                    >
                      Permissions
                    </button>
                  </td>

                  {/* ACTION BUTTONS */}
                  <td className="px-4 py-3 flex justify-center gap-3">
                    <EyeIcon
                      className="h-5 w-5 text-blue-600 cursor-pointer"
                      onClick={() => setShowViewModal(role)}
                    />
                    <PencilIcon
                      className="h-5 w-5 text-green-600 cursor-pointer"
                      onClick={() => setShowEditModal(role)}
                    />
                    <TrashIcon
                      className="h-5 w-5 text-red-600 cursor-pointer"
                      onClick={() => setDeleteConfirm(role)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[380px] rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-bold text-red-700">Confirm Delete</h2>
            <p className="mt-3 text-gray-700">
              Are you sure you want to delete the role:
              <span className="font-semibold"> {deleteConfirm.name}</span>?
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                No
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD ROLE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[450px] rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-bold text-blue-700 mb-4">Add Role</h2>
            <input
              type="text"
              placeholder="Role Name"
              className="border px-3 py-2 rounded w-full mb-3"
              value={newRole.name}
              onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRole}
                className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
              >
                Add Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW ROLE MODAL */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[450px] rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-bold text-blue-700">View Role</h2>
            <div className="mt-4 space-y-2 text-gray-700">
              <p>
                <strong>ID:</strong> {showViewModal.id}
              </p>
              <p>
                <strong>Name:</strong> {showViewModal.name}
              </p>
            </div>
            <button
              onClick={() => setShowViewModal(null)}
              className="mt-6 w-full py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* EDIT ROLE MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[450px] rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-bold text-green-700 mb-4">Edit Role</h2>
            <input
              type="text"
              className="border px-3 py-2 rounded w-full mb-3"
              value={showEditModal.name}
              onChange={(e) =>
                setShowEditModal({ ...showEditModal, name: e.target.value })
              }
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditRole}
                className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;
