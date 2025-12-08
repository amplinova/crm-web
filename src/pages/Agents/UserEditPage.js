import React, { useEffect, useState } from "react";
import useAxios from "../../Auth/useAxios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const UserEditPage = () => {
  const { id } = useParams();
  const api = useAxios();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Load employees for "Assigned Under"
  const getAllUsers = async () => {
    try {
      const res = await api.get("/auth/id-names");
      setEmployees(res.data);
    } catch {
      Swal.fire("Error", "Failed to load employees list", "error");
    }
  };

  // Load user details
  const loadUser = async () => {
    const res = await api.get(`/auth/${id}`);

    setUser({
      ...res.data,
      roleId: res.data.role?.id || "",
      assignedUnderId: res.data.assignedUnder?.id || ""
    });
  };

  // Load roles
  const loadRoles = async () => {
    const res = await api.get(`/api/roles`);
    setRoles(res.data);
  };

  useEffect(() => {
    loadUser();
    loadRoles();
    getAllUsers();
  }, []);

  // Handle update
  const handleUpdate = async () => {
    try {
      const payload = {
        ...user,
        role: { id: user.roleId },
        assignedUnder: user.assignedUnderId
          ? { id: user.assignedUnderId }
          : null,
      };

      await api.put(`/auth/${id}`, payload);

      Swal.fire("Success", "User updated successfully!", "success");
      navigate("/agents");
    } catch {
      Swal.fire("Error", "Failed to update user", "error");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-yellow-700">Edit Employee</h2>

      <div className="grid gap-3">

        <input
          type="text"
          value={user.fullName}
          onChange={(e) => setUser({ ...user, fullName: e.target.value })}
          className="border px-3 py-2 rounded"
        />

        <input
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className="border px-3 py-2 rounded"
        />

        <input
          type="text"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          className="border px-3 py-2 rounded"
        />

        <input
          type="text"
          value={user.assignedMobileNumber}
          onChange={(e) =>
            setUser({ ...user, assignedMobileNumber: e.target.value })
          }
          className="border px-3 py-2 rounded"
        />

        <input
          type="text"
          value={user.gender}
          onChange={(e) => setUser({ ...user, gender: e.target.value })}
          className="border px-3 py-2 rounded"
        />

        <textarea
          value={user.address}
          onChange={(e) => setUser({ ...user, address: e.target.value })}
          className="border px-3 py-2 rounded"
        ></textarea>

        {/* ROLE DROPDOWN */}
        <select
          value={user.roleId}
          onChange={(e) => setUser({ ...user, roleId: e.target.value })}
          className="border px-3 py-2 rounded"
        >
          <option value="">Select Role</option>
          {roles.map(role => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>

        {/* ASSIGN UNDER EMPLOYEE */}
        <select
          value={user.assignedUnderId || ""}
          onChange={(e) =>
            setUser({ ...user, assignedUnderId: e.target.value })
          }
          className="border px-3 py-2 rounded"
        >
          <option value="">Assign Under</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>
              {emp.fullName}
            </option>
          ))}
        </select>

      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => navigate("/users")}
          className="w-full py-2 bg-gray-400 text-white rounded"
        >
          Cancel
        </button>

        <button
          onClick={handleUpdate}
          className="w-full py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default UserEditPage;
