// src/pages/MyAccountPage.jsx

import React, { useEffect, useState } from "react";
import useAxios from "../Auth/useAxios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";

const MyAccountPage = () => {
  const api = useAxios();
  const { userId } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    username: "",
    gender: "",
    assigned_mobile_number: "",
    address: "",
    role_id: null,
    role_name: "",
    profile_image: "",
  });

  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  // ---------------------------
  // FETCH USER PROFILE
  // ---------------------------
  const fetchProfile = async () => {
    if (!userId) return;

    setLoading(true);

    try {
      const res = await api.get(`/auth/${userId}`);
      const data = res.data.data || res.data;

      console.log("Fetched user:", data);
      setUser(data);

      setForm({
        full_name: data.full_name || "",
        email: data.email || "",
        username: data.username || "",
        gender: data.gender || "",
        assigned_mobile_number: data.assigned_mobile_number || "",
        address: data.address || "",
        role_id: data.role?.id || null,
        role_name: data.role?.name || "",
        profile_image: data.profile_image || "",
      });

      setProfilePreview(data.profile_image || null);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  // ---------------------------
  // HANDLE IMAGE
  // ---------------------------
  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setProfileFile(f);

    const reader = new FileReader();
    reader.onload = () => setProfilePreview(reader.result);
    reader.readAsDataURL(f);
  };

  // ---------------------------
  // SAVE PROFILE HANDLER
  // ---------------------------
  const handleProfileSave = async () => {
    setLoading(true);

    try {
      let payload;

      if (profileFile) {
        payload = new FormData();
        Object.keys(form).forEach((key) => payload.append(key, form[key]));
        payload.append("profile_image", profileFile);
      } else {
        payload = form;
      }

      await api.put(`/auth/${userId}`, payload, {
        headers: profileFile
          ? { "Content-Type": "multipart/form-data" }
          : undefined,
      });

      Swal.fire("Success", "Profile updated successfully", "success");
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // CANCEL EDIT
  // ---------------------------
  const handleCancelEdit = () => {
    if (user) {
      setForm({
        full_name: user.full_name || "",
        email: user.email || "",
        username: user.username || "",
        gender: user.gender || "",
        assigned_mobile_number: user.assigned_mobile_number || "",
        address: user.address || "",
        role_id: user.role?.id || null,
        role_name: user.role?.name || "",
        profile_image: user.profile_image || "",
      });

      setProfilePreview(user.profile_image || null);
    }

    setProfileFile(null);
    setEditMode(false);
  };








  if (loading && !user) {
    return <div className="p-6">Loading...</div>;
  }

  // ---------------------------------------------
// PASSWORD CONFIRMATION BEFORE ENTERING EDIT MODE
// ---------------------------------------------
const handleEditClick = async () => {
  let show = false; // toggle flag

  const { value: password } = await Swal.fire({
    title: "Confirm Password",
    html: `
      <div style="display:flex; flex-direction:column; align-items:center; gap:12px;">
      
        <input id="swal-password" type="password"
          class="swal2-input"
          placeholder="Enter your password"
          style="width: 250px; text-align:center;" />

        <div style="display:flex; align-items:center; gap:8px; justify-content:center;">
          <input type="checkbox" id="togglePassword" />
          <label for="togglePassword" style="font-size:14px;">Show Password</label>
        </div>

      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Verify",
    preConfirm: () => {
      const pass = document.getElementById("swal-password").value;
      if (!pass) {
        Swal.showValidationMessage("Please enter your password");
        return;
      }
      return pass;
    },
    didOpen: () => {
      const input = document.getElementById("swal-password");
      const toggle = document.getElementById("togglePassword");

      toggle.addEventListener("change", () => {
        input.type = toggle.checked ? "text" : "password";
      });
    },
  });

  if (!password) return;

  try {
    // REUSE LOGIN API FOR PASSWORD VALIDATION
    const res = await api.post("/auth/login", {
      email: form.email,
      password: password,
    });

    if (res.data?.accessToken) {
      Swal.fire("Verified", "Password correct. You can edit your profile.", "success");
      setEditMode(true);
    }
  } catch (err) {
    Swal.fire("Error", "Incorrect password", "error");
  }
};



    return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">My Account</h1>
          <p className="text-sm text-gray-600">View and edit your profile</p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Back
        </button>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex gap-6 items-center">
          {/* PROFILE IMAGE */}
          <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {profilePreview ? (
              <img src={profilePreview} className="w-full h-full object-cover" alt="" />
            ) : (
              <div className="text-3xl text-gray-500">
                {form.full_name ? form.full_name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
          </div>

          {/* NAME + EMAIL */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{form.full_name}</h2>
                <p className="text-sm text-gray-600">{form.email}</p>
                <p className="text-sm text-gray-600">{form.assigned_mobile_number}</p>
              </div>

              {!editMode ? (
                <button
  onClick={handleEditClick}
  className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
>
  Edit Profile
</button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleProfileSave}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>

            {/* Change Image */}
            {editMode && (
              <div className="mt-3">
                <label className="text-sm text-gray-700">Change profile image</label>
                <input type="file" accept="image/*" onChange={onFileChange} />
              </div>
            )}
          </div>
        </div>

        {/* FORM FIELDS */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              disabled={!editMode}
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              disabled={!editMode}
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              disabled={!editMode}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Mobile</label>
            <input
              type="text"
              disabled={!editMode}
              value={form.assigned_mobile_number}
              onChange={(e) =>
                setForm({ ...form, assigned_mobile_number: e.target.value })
              }
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              disabled={!editMode}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              disabled={!editMode}
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="mt-1 w-full border rounded px-3 py-2"
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          {/* Role - READ ONLY */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <input
              type="text"
              disabled
              value={form.role_name}
              className="mt-1 w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;

