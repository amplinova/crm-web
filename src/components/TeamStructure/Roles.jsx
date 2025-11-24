import React, { useState, useEffect } from "react";
import rolesData from "../../json/roles.json";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(null);
  const [showEditModal, setShowEditModal] = useState(null);

  // Delete confirmation modal
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [newRole, setNewRole] = useState({
    roleName: "",
    description: "",
  });

  useEffect(() => {
    setRoles(rolesData); // Load JSON roles
  }, []);

  const filteredRoles = roles.filter((role) =>
    role.roleName.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    const updated = roles.filter((role) => role.id !== id);
    setRoles(updated);
    setDeleteConfirm(null);
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

        <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
          Delete Checked Roles
        </button>

        <button
          className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
          onClick={() => setRoles([])}
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
              <th className="px-4 py-3">Description</th>
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
                  <td className="px-4 py-3">{role.roleName}</td>
                  <td className="px-4 py-3">{role.description}</td>

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
            {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[380px] rounded-lg p-6 shadow-xl">

            <h2 className="text-xl font-bold text-red-700">Confirm Delete</h2>
            <p className="mt-3 text-gray-700">
              Are you sure you want to delete the role:
              <span className="font-semibold"> {deleteConfirm.roleName}</span>?
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

      {/* ================= ADD ROLE MODAL ================= */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[450px] rounded-lg shadow-xl p-6">

            <h2 className="text-xl font-bold text-blue-700 mb-4">Add Role</h2>

            <input
              type="text"
              placeholder="Role Name"
              className="border px-3 py-2 rounded w-full mb-3"
              value={newRole.roleName}
              onChange={(e) =>
                setNewRole({ ...newRole, roleName: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Description"
              className="border px-3 py-2 rounded w-full mb-3"
              value={newRole.description}
              onChange={(e) =>
                setNewRole({ ...newRole, description: e.target.value })
              }
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  const newId = roles.length + 1;
                  setRoles([
                    ...roles,
                    { id: newId, ...newRole },
                  ]);
                  setNewRole({ roleName: "", description: "" });
                  setShowAddModal(false);
                }}
                className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
              >
                Add Role
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= VIEW ROLE MODAL ================= */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[450px] rounded-lg shadow-xl p-6">

            <h2 className="text-xl font-bold text-blue-700">View Role</h2>

            <div className="mt-4 space-y-2 text-gray-700">
              <p><strong>ID:</strong> {showViewModal.id}</p>
              <p><strong>Name:</strong> {showViewModal.roleName}</p>
              <p><strong>Description:</strong> {showViewModal.description}</p>
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

      {/* ================= EDIT ROLE MODAL ================= */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[450px] rounded-lg shadow-xl p-6">

            <h2 className="text-xl font-bold text-green-700 mb-4">Edit Role</h2>

            <input
              type="text"
              className="border px-3 py-2 rounded w-full mb-3"
              value={showEditModal.roleName}
              onChange={(e) =>
                setShowEditModal({
                  ...showEditModal,
                  roleName: e.target.value,
                })
              }
            />

            <input
              type="text"
              className="border px-3 py-2 rounded w-full mb-3"
              value={showEditModal.description}
              onChange={(e) =>
                setShowEditModal({
                  ...showEditModal,
                  description: e.target.value,
                })
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
                onClick={() => {
                  const updated = roles.map((r) =>
                    r.id === showEditModal.id ? showEditModal : r
                  );
                  setRoles(updated);
                  setShowEditModal(null);
                }}
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

