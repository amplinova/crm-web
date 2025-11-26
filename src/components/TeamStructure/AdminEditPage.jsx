import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminsData from "../../json/admins.json";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const AdminEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const admin = adminsData.find((a) => a.id === Number(id));

  const [formData, setFormData] = useState(admin || {});

  if (!admin) {
    return <div className="p-6">Admin Not Found</div>;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Updated Admin:", formData);
    alert("Admin updated successfully (local only)");
    navigate(-1);
  };

  return (
    <div className="p-6">
      <button
        className="flex items-center gap-2 text-blue-700 mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeftIcon className="w-5 h-5" /> Back
      </button>

      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        Edit Admin
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-6 space-y-5">

        <div>
          <label className="block mb-1 font-semibold">Full Name</label>
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Username</label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Mobile</label>
          <input
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option>ADMIN</option>
            <option>SUPER_ADMIN</option>
            <option>MANAGER</option>
            <option>AGENT</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default AdminEditPage;
