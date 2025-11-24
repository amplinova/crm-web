import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import rolesData from "../../json/roles.json";
import Swal from "sweetalert2";

const EditRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Load the role
  const roleDetails = rolesData.find((r) => r.id === parseInt(id));

  const [role, setRole] = useState(
    roleDetails || {
      roleName: "",
      description: "",
    }
  );

  if (!roleDetails) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold text-xl">
        Role not found!
      </div>
    );
  }

  const handleUpdate = () => {
    if (!role.roleName.trim()) {
      Swal.fire("Required", "Role Name is required", "warning");
      return;
    }

    Swal.fire("Updated!", "Role updated successfully!", "success");

    // You can add API update here
    navigate("/team-structure/roles");
  };

  return (
    <div className="p-6">

      {/* Header + Breadcrumb */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Edit Role</h1>

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
          / <span className="font-semibold text-blue-700">Edit</span>
        </p>
      </div>

      {/* Form Box */}
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
            onClick={handleUpdate}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Update Role
          </button>

        </div>
      </div>
    </div>
  );
};

export default EditRole;
