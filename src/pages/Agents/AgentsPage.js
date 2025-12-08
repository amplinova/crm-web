import React, { useEffect, useState } from "react";
import useAxios from "../../Auth/useAxios";
import Swal from "sweetalert2";
import { TrashIcon, PencilIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const UsersPage = () => {
  const api = useAxios();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    username: "",
    assignedMobileNumber: "",
    address: "",
    roleId: "",
    gender: "",
    assignedUnderId: null,
  });

  // ------------------ GET ALL USERS ------------------
  const getAllUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/auth");
      setUsers(res.data);
    } catch {
      Swal.fire("Error", "Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  // ------------------ GET ALL ROLES ------------------
  const getAllRoles = async () => {
    try {
      const res = await api.get("/api/roles");
      setRoles(res.data);
    } catch {
      Swal.fire("Error", "Failed to load roles", "error");
    }
  };

  useEffect(() => {
    getAllUsers();
    getAllRoles();
  }, []);

  // ------------------ ADD EMPLOYEE ------------------
 const handleAddUser = async () => {
  if (!newUser.fullName || !newUser.username || !newUser.roleId) {
    Swal.fire("Error", "Please fill required fields", "error");
    return;
  }

  try {
    setLoading(true);

    const response = await api.post("/auth/register", newUser, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.data?.success === false) {
      Swal.fire("Error", response.data.message || "Registration failed", "error");
      return;
    }

    Swal.fire("Success", "Employee added successfully!", "success");

    setShowAddModal(false);
    setNewUser({
      fullName: "",
      email: "",
      username: "",
      assignedMobileNumber: "",
      address: "",
      roleId: "",
      gender: "",
      assignedUnderId: null,
    });

    getAllUsers();
  } catch (error) {
    const backendMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data ||
      "Something went wrong";

    Swal.fire("Error", backendMessage, "error");
  } finally {
    setLoading(false);
  }
};


  // ------------------ DELETE SINGLE USER ------------------
  const handleDeleteUser = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This employee will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete!",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/auth/${id}`);
      Swal.fire("Deleted!", "Employee deleted successfully.", "success");
      getAllUsers();
    } catch {
      Swal.fire("Error", "Failed to delete employee", "error");
    }
  };

  // ------------------ DELETE ALL USERS ------------------
  const handleDeleteAllUsers = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete ALL employees!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete all!",
    });

    if (!result.isConfirmed) return;

    try {
      await Promise.all(users.map((user) => api.delete(`/auth/${user.id}`)));
      Swal.fire("Deleted!", "All employees deleted.", "success");
      getAllUsers();
    } catch {
      Swal.fire("Error", "Failed to delete all users", "error");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">Agents</h1>
          <p className="text-sm text-gray-600">
            <a href="/dashboard" className="text-blue-600 hover:underline">
              Dashboard
            </a>{" "}
            / <span className="font-semibold text-blue-700">Agents</span>
          </p>
        </div>

        <div className="flex items-center border rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search Employees..."
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
          className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
        >
          Add Employee
        </button>

        <button
          onClick={handleDeleteAllUsers}
          className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
        >
          Delete All Employees
        </button>
      </div>

      {/* USERS TABLE */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-blue-100 text-blue-900">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Full Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-6">
                  <span className="animate-pulse text-blue-700 font-semibold">Loading...</span>
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="px-4 py-3">{user.id}</td>
                  <td className="px-4 py-3">{user.fullName}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.username}</td>
                  <td className="px-4 py-3">{user.assignedMobileNumber}</td>
                  <td className="px-4 py-3">{user.role?.name}</td>

                  <td className="px-4 py-3 flex items-center justify-center gap-3">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => navigate(`/agents/view/${user.id}`)}
                    >
                      <EyeIcon className="w-6 h-6" />
                    </button>

                    <button
                      className="text-yellow-600 hover:text-yellow-800"
                      onClick={() => navigate(`/agents/edit/${user.id}`)}
                    >
                      <PencilIcon className="w-6 h-6" />
                    </button>

                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteUser(user.id)}
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

      {/* ADD EMPLOYEE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[500px] rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-bold text-green-700 mb-4">Add Employee</h2>

            <input
              type="text"
              placeholder="Full Name"
              className="border px-3 py-2 rounded w-full mb-3"
              value={newUser.fullName}
              onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
            />

            <input
              type="email"
              placeholder="Email"
              className="border px-3 py-2 rounded w-full mb-3"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />

            <input
              type="text"
              placeholder="Username"
              className="border px-3 py-2 rounded w-full mb-3"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            />

            <input
              type="text"
              placeholder="Mobile Number"
              className="border px-3 py-2 rounded w-full mb-3"
              value={newUser.assignedMobileNumber}
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  assignedMobileNumber: e.target.value.replace(/[^0-9]/g, "").slice(0, 10),
                })
              }
            />

            <input
              type="text"
              placeholder="Address"
              className="border px-3 py-2 rounded w-full mb-3"
              value={newUser.address}
              onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
            />

            <select
              className="border px-3 py-2 rounded w-full mb-3"
              value={newUser.roleId}
              onChange={(e) => setNewUser({ ...newUser, roleId: parseInt(e.target.value) })}
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>

            <select
              className="border px-3 py-2 rounded w-full mb-3"
              value={newUser.assignedUnderId || ""}
              onChange={(e) =>
                setNewUser({ ...newUser, assignedUnderId: parseInt(e.target.value) || null })
              }
            >
              <option value="">Assigned Under (Optional)</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName}
                </option>
              ))}
            </select>

            {/* FOOTER BUTTONS */}
            <div className="flex justify-end gap-3 mt-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
              >
                {loading ? "Adding..." : "Add Employee"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
