import React, { useState, useEffect } from "react";
import useAxios from "../Auth/useAxios";
import Swal from "sweetalert2";
import { UserIcon, LockClosedIcon, ArrowRightOnRectangleIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const SettingsPage = () => {
  const api = useAxios();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("");

  // Profile form state
  const [profileData, setProfileData] = useState({
    fullName: "",
    username: "",
    email: "",
    mobile: "",
    gender: "",
    address: "",
    profileImage: null,
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role || "");
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      const res = await api.get(`/auth/${userId}`);
      const userData = res.data;
      setUser(userData);
      
      // Set profile form data
      setProfileData({
        fullName: userData.fullName || "",
        username: userData.username || "",
        email: userData.email || "",
        mobile: userData.assignedMobileNumber || "",
        gender: userData.gender || "",
        address: userData.address || "",
        profileImage: userData.profileImage || null,
      });
    } catch (error) {
      Swal.fire("Error", "Failed to load user data", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For demo purposes, we'll store the file name
      // In real implementation, you would upload to server
      setProfileData(prev => ({
        ...prev,
        profileImage: file.name
      }));
      
      Swal.fire("Success", "Image selected. Click Update Profile to save.", "success");
    }
  };

  // Update profile
  const handleUpdateProfile = async () => {
    if (!profileData.fullName || !profileData.email) {
      Swal.fire("Error", "Full Name and Email are required", "error");
      return;
    }

    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      const payload = {
        fullName: profileData.fullName,
        email: profileData.email,
        assignedMobileNumber: profileData.mobile,
        gender: profileData.gender,
        address: profileData.address,
        // Include other fields as needed by your API
      };

      const res = await api.put(`/auth/${userId}`, payload);
      Swal.fire("Success", "Profile updated successfully!", "success");
      
      // Update local user state
      setUser(prev => ({ ...prev, ...payload }));
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      Swal.fire("Error", "All password fields are required", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire("Error", "New passwords do not match", "error");
      return;
    }

    if (newPassword.length < 6) {
      Swal.fire("Error", "New password must be at least 6 characters", "error");
      return;
    }

    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      const payload = {
        currentPassword,
        newPassword
      };

      const res = await api.put(`/auth/${userId}/change-password`, payload);
      Swal.fire("Success", "Password changed successfully!", "success");
      
      // Clear password form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Failed to change password", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {
      try {
        // Call logout API if needed
        // await api.post("/auth/logout");
        
        // Clear local storage
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        
        // Redirect to login
        window.location.href = "/login";
      } catch (error) {
        // Still logout even if API fails
        localStorage.clear();
        window.location.href = "/login";
      }
    }
  };

  // Password visibility toggle
  const togglePasswordVisibility = (field) => {
    switch (field) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-blue-700">Settings</h1>
          <p className="text-sm text-gray-600">
            <a href="/dashboard" className="text-blue-600 hover:underline">Dashboard</a>{" "}
            / <span className="font-semibold text-blue-700">Settings</span>
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT SIDEBAR - TABS */}
        <div className="lg:w-1/4">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
            </div>
            <nav className="p-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  activeTab === "profile" 
                    ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <UserIcon className="w-5 h-5" />
                <span className="font-medium">Profile</span>
              </button>
              
              <button
                onClick={() => setActiveTab("password")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  activeTab === "password" 
                    ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <LockClosedIcon className="w-5 h-5" />
                <span className="font-medium">Change Password</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </nav>
          </div>

          {/* USER INFO CARD */}
          {user && (
            <div className="bg-white shadow-lg rounded-lg p-4 mt-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-600 text-white flex items-center justify-center rounded-full text-2xl font-semibold">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{user.fullName}</h3>
                  <p className="text-sm text-gray-600">{userRole}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT CONTENT AREA */}
        <div className="lg:w-3/4">
          {loading ? (
            <div className="bg-white shadow-lg rounded-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          ) : (
            <>
              {/* PROFILE TAB */}
              {activeTab === "profile" && (
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
                    <p className="text-sm text-gray-600 mt-1">Update your personal information</p>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-6">
                      {/* Profile Image */}
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="flex flex-col items-center">
                          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                            {profileData.profileImage ? (
                              <img 
                                src={profileData.profileImage} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <UserIcon className="w-20 h-20 text-gray-400" />
                            )}
                          </div>
                          <label className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors text-center">
                            Change Photo
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageUpload}
                            />
                          </label>
                        </div>
                        
                        <div className="flex-1">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name *
                              </label>
                              <input
                                type="text"
                                name="fullName"
                                value={profileData.fullName}
                                onChange={handleProfileChange}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter full name"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                              </label>
                              <input
                                type="text"
                                name="username"
                                value={profileData.username}
                                onChange={handleProfileChange}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter username"
                                readOnly
                              />
                              <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Form Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter email address"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mobile Number
                          </label>
                          <input
                            type="tel"
                            name="mobile"
                            value={profileData.mobile}
                            onChange={handleProfileChange}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter mobile number"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Gender
                          </label>
                          <select
                            name="gender"
                            value={profileData.gender}
                            onChange={handleProfileChange}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* Address */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <textarea
                          name="address"
                          value={profileData.address}
                          onChange={handleProfileChange}
                          rows="3"
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your address"
                        />
                      </div>

                      {/* Update Button */}
                      <div className="pt-4 border-t">
                        <button
                          onClick={handleUpdateProfile}
                          disabled={loading}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? "Updating..." : "Update Profile"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CHANGE PASSWORD TAB */}
              {activeTab === "password" && (
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Change Password</h2>
                    <p className="text-sm text-gray-600 mt-1">Update your password for enhanced security</p>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-6 max-w-2xl">
                      {/* Current Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(prev => ({
                              ...prev,
                              currentPassword: e.target.value
                            }))}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('current')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showCurrentPassword ? (
                              <EyeSlashIcon className="w-5 h-5" />
                            ) : (
                              <EyeIcon className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* New Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData(prev => ({
                              ...prev,
                              newPassword: e.target.value
                            }))}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('new')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showNewPassword ? (
                              <EyeSlashIcon className="w-5 h-5" />
                            ) : (
                              <EyeIcon className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Password must be at least 6 characters long
                        </p>
                      </div>

                      {/* Confirm New Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData(prev => ({
                              ...prev,
                              confirmPassword: e.target.value
                            }))}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                            placeholder="Confirm new password"
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('confirm')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showConfirmPassword ? (
                              <EyeSlashIcon className="w-5 h-5" />
                            ) : (
                              <EyeIcon className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Password Requirements */}
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">Password Requirements</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${passwordData.newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            At least 6 characters
                          </li>
                          <li className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${passwordData.newPassword !== passwordData.currentPassword ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            Different from current password
                          </li>
                          <li className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${passwordData.newPassword === passwordData.confirmPassword && passwordData.newPassword !== '' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            Passwords match
                          </li>
                        </ul>
                      </div>

                      {/* Update Password Button */}
                      <div className="pt-4 border-t">
                        <button
                          onClick={handleChangePassword}
                          disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? "Changing Password..." : "Change Password"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;