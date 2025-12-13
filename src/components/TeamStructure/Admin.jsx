// src/pages/AdminPage.jsx

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { TrashIcon, PencilIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import useAxios from "../../Auth/useAxios";

const AdminPage = () => {
  const api = useAxios();
  const navigate = useNavigate();

  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // ------------------ GET ONLY ADMIN USERS ------------------
  const getAdmins = async () => {
    try {
      setLoading(true);

      const res = await api.get("/auth"); // fetch all users

      const onlyAdmins = res.data.data.filter(
        (u) => u.roleName?.toUpperCase() === "ADMIN"
      );

      setAdmins(onlyAdmins);
    } catch (error) {
      Swal.fire("Error", "Failed to load admins", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAdmins();
  }, []);

  // ------------------ DELETE ADMIN ------------------
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This admin will be removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/auth/${id}`);
      Swal.fire("Deleted!", "Admin removed successfully.", "success");

      getAdmins(); // refresh list
    } catch {
      Swal.fire("Error", "Failed to delete admin", "error");
    }
  };

  // ------------------ FILTER (Search) ------------------
  const filteredAdmins = admins.filter((a) =>
    (a.fullName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Admin Management</h1>

        {/* Search */}
        <div className="flex items-center border rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search admin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 outline-none"
          />
          <button className="px-4 py-2 bg-blue-700 text-white">Search</button>
        </div>
      </div>

      {/* ADMIN TABLE */}
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
                  Loading...
                </td>
              </tr>
            ) : filteredAdmins.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6">
                  No admins found
                </td>
              </tr>
            ) : (
              filteredAdmins.map((admin) => (
                <tr key={admin.id} className="border-b">
                  <td className="px-4 py-3">{admin.id}</td>
                  <td className="px-4 py-3">{admin.fullName}</td>
                  <td className="px-4 py-3">{admin.email}</td>
                  <td className="px-4 py-3">{admin.username}</td>
                  <td className="px-4 py-3">{admin.assignedMobileNumber}</td>
                  <td className="px-4 py-3">{admin.roleName}</td>

                  <td className="px-4 py-3 flex items-center justify-center gap-3">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => navigate(`/agents/view/${admin.id}`)}
                    >
                      <EyeIcon className="w-6 h-6" />
                    </button>

                    <button
                      className="text-yellow-600 hover:text-yellow-800"
                      onClick={() => navigate(`/agents/edit/${admin.id}`)}
                    >
                      <PencilIcon className="w-6 h-6" />
                    </button>

                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(admin.id)}
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

export default AdminPage;
