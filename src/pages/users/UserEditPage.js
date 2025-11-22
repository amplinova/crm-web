import React, { useEffect, useState } from "react";
import useAxios from "../../Auth/useAxios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const UserEditPage = () => {
  const { id } = useParams();
  const api = useAxios();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const loadUser = async () => {
    const res = await api.get(`/auth/${id}`);
    setUser(res.data);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleUpdate = async () => {
    try {
      await api.put(`/auth/${id}`, user);
      Swal.fire("Success", "User updated successfully!", "success");
      navigate("/users");
    } catch {
      Swal.fire("Error", "Failed to update user", "error");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-yellow-700">Edit Employee</h2>

      <div className="grid gap-3">
        <input type="text" value={user.fullName}
          onChange={(e) => setUser({ ...user, fullName: e.target.value })}
          className="border px-3 py-2 rounded" />

        <input type="email" value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className="border px-3 py-2 rounded" />

        <input type="text" value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          className="border px-3 py-2 rounded" />

        <input type="text" value={user.assignedMobileNumber}
          onChange={(e) => setUser({ ...user, assignedMobileNumber: e.target.value })}
          className="border px-3 py-2 rounded" />

        <input type="text" value={user.gender}
          onChange={(e) => setUser({ ...user, gender: e.target.value })}
          className="border px-3 py-2 rounded" />

        <textarea value={user.address}
          onChange={(e) => setUser({ ...user, address: e.target.value })}
          className="border px-3 py-2 rounded"></textarea>
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={() => navigate("/users")}
          className="w-full py-2 bg-gray-400 text-white rounded">
          Cancel
        </button>

        <button onClick={handleUpdate}
          className="w-full py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
          Update
        </button>
      </div>
    </div>
  );
};

export default UserEditPage;
