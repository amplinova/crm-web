import React, { useEffect, useState } from "react";
import useAxios from "../../Auth/useAxios";
import { useParams, useNavigate } from "react-router-dom";

const UserViewPage = () => {
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

  if (!user) return <p>Loading user...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Employee Details</h2>

      <div className="space-y-2 text-sm">
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Name:</strong> {user.fullName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Mobile:</strong> {user.assignedMobileNumber}</p>
        <p><strong>Gender:</strong> {user.gender}</p>
        <p><strong>Address:</strong> {user.address}</p>
        <p><strong>Role:</strong> {user.role?.roleName}</p>
        <p><strong>Assigned Under:</strong> {user.assignedUnder?.fullName}</p>
      </div>

      <button
        onClick={() => navigate("/users")}
        className="mt-6 w-full py-2 bg-blue-700 text-white rounded-lg"
      >
        Back to Employees
      </button>
    </div>
  );
};

export default UserViewPage;
