import React, { useEffect, useState } from "react";
import useAxios from "../../Auth/useAxios";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

const RolePermissions = () => {
  const api = useAxios();
  const { roleId } = useParams();

  const [permissionsData, setPermissionsData] = useState({});
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  console.log(roleId)

  // ======================================================
  // 1️⃣ Fetch categorized permissions
  // ======================================================
  const fetchPermissions = async () => {
    try {
      const res = await api.get("/api/permissions/categorized");
      setPermissionsData(res.data);
    } catch (error) {
      Swal.fire("Error", "Failed to load permissions", "error");
    }
  };

  // ======================================================
  // 2️⃣ Fetch permissions assigned to this role
  // ======================================================
  const fetchRolePermissions = async () => {
    try {
      const res = await api.get(`/api/permissions/roles/${roleId}`);
      setSelectedPermissions(res.data); // array of permission IDs
    } catch (error) {
      Swal.fire("Error", "Failed to load role permissions", "error");
    }
  };

  // ======================================================
  // Checkbox toggle
  // ======================================================
  const handleCheckboxChange = (permissionId) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  // Load permissions + role assigned permissions together
  useEffect(() => {
    fetchPermissions();
    fetchRolePermissions();
  }, []);

  // ======================================================
  // 3️⃣ Save permissions for role
  // ======================================================
  const handleSave = async () => {
    try {
      await api.post("/api/permissions/assign-role-permissions", {
        roleId: Number(roleId),
        permissionIds: selectedPermissions,
      });

      Swal.fire("Success", "Permissions updated successfully!", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to save permissions", "error");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-700">
        Assign Permissions to Role #{roleId}
      </h1>

      <p className="text-gray-600 mb-6">Manage permissions for this role.</p>

      {/* CATEGORY PERMISSIONS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(permissionsData).map(([category, permissions]) => (
          <div key={category} className="border rounded-lg shadow p-4 bg-white">
            <h2 className="text-lg font-semibold text-purple-700 mb-3">
              {category}
            </h2>

            {permissions.map((permission) => (
              <label key={permission.id} className="flex items-center gap-2 mb-2 text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={selectedPermissions.includes(permission.id)}
                  onChange={() => handleCheckboxChange(permission.id)}
                />
                {permission.name}
              </label>
            ))}
          </div>
        ))}
      </div>

      {/* SAVE BUTTON */}
      <div className="mt-6">
        <button
          className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
          onClick={handleSave}
        >
          Save Permissions
        </button>
      </div>
    </div>
  );
};

export default RolePermissions;
