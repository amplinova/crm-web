import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AddRole = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState({
    roleName: "",
    description: ""
  });

  const handleSave = () => {
    if (!role.roleName.trim()) {
      Swal.fire("Required", "Role Name is required", "warning");
      return;
    }

    Swal.fire("Success", "Role created successfully!", "success");

    // After successful save
    navigate("/team-structure/roles");
  };

  return (
    <div className="p-6">

      {/* Header + Breadcrumb */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Add Role</h1>

        <p className="text-sm text-gray-600">
          <a href="/dashboard" className="text-blue-600 hover:underline">
            Dashboard
          </a>{" "}
          /{" "}
          <a
            href="/team-structure/roles"
            className="text-blue-600 hover:underline"
          >
            Roles
          </a>{" "}
          / <span className="font-semibold text-blue-700">Add Role</span>
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-[600px]">

        {/* Role Name */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Role Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter role name"
            className="border w-full px-3 py-2 rounded outline-blue-500"
            value={role.roleName}
            onChange={(e) =>
              setRole({ ...role, roleName: e.target.value })
            }
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Description
          </label>
          <textarea
            placeholder="Enter description"
            className="border w-full px-3 py-2 rounded outline-blue-500"
            rows={4}
            value={role.description}
            onChange={(e) =>
              setRole({ ...role, description: e.target.value })
            }
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">

          <button
            onClick={() => navigate("/team-structure/roles")}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
          >
            Save Role
          </button>

        </div>

      </div>
    </div>
  );
};

export default AddRole;
