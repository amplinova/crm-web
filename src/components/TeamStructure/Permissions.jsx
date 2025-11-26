import React, { useState, useEffect } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

// Import permissions JSON (You will create this file)
import permissionsData from "../../json/permissions.json";

const PermissionPage = () => {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    setPermissions(permissionsData);
  }, []);

  // Handle checkbox toggle
  const togglePermission = (roleIndex, permKey) => {
    const updated = [...permissions];
    updated[roleIndex].permissions[permKey] =
      !updated[roleIndex].permissions[permKey];

    setPermissions(updated);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        Role-Based Permission Management
      </h1>

      <div className="overflow-x-auto shadow-lg rounded-xl bg-white p-4">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-blue-100 text-blue-900">
              <th className="px-4 py-3 border">Role</th>
              <th className="px-4 py-3 border">View</th>
              <th className="px-4 py-3 border">Create</th>
              <th className="px-4 py-3 border">Edit</th>
              <th className="px-4 py-3 border">Delete</th>
            </tr>
          </thead>

          <tbody>
            {permissions.map((role, index) => (
              <tr key={role.role} className="border">
                <td className="px-4 py-3 font-semibold text-gray-800 border">
                  {role.role}
                </td>

                {/* Permission Columns */}
                {["view", "create", "edit", "delete"].map((permKey) => (
                  <td
                    key={permKey}
                    className="px-4 py-3 text-center border cursor-pointer"
                    onClick={() => togglePermission(index, permKey)}
                  >
                    {role.permissions[permKey] ? (
                      <CheckCircleIcon className="w-6 h-6 text-green-600 mx-auto" />
                    ) : (
                      <div className="w-6 h-6 mx-auto border rounded bg-gray-200"></div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="mt-6 bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800">
        Save Permissions
      </button>
    </div>
  );
};

export default PermissionPage;
