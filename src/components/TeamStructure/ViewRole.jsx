import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import rolesData from "../../json/roles.json";

const ViewRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const role = rolesData.find((item) => item.id === parseInt(id));

  if (!role) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold text-xl">
        Role not found!
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* Header + Breadcrumb */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-blue-700">View Role</h1>

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
          / <span className="font-semibold text-blue-700">View</span>
        </p>
      </div>

      {/* Content Box */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-[600px]">

        {/* Details */}
        <div className="space-y-4 text-gray-700">

          <p>
            <span className="font-semibold text-gray-900">ID:</span>{" "}
            {role.id}
          </p>

          <p>
            <span className="font-semibold text-gray-900">Role Name:</span>{" "}
            {role.roleName}
          </p>

          <p>
            <span className="font-semibold text-gray-900">Description:</span>{" "}
            {role.description}
          </p>

        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={() => navigate("/team-structure/roles")}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Back
          </button>

        </div>
      </div>
    </div>
  );
};

export default ViewRole;
