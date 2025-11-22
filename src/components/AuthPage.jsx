// src/Auth/AuthPage.js
import React, { useState } from "react";

import ampliNovaLogo from "../Assets/AmpliNova Final Logo.png";
import axios from "axios";
import toast from "react-hot-toast";

import { API_BASE_URL } from "../Auth/Api";
import { useAuth } from "../Auth/AuthContext";

const AuthPage = () => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      console.log("📤 Sending login request:", formData);

      const res = await axios.post(`${API_BASE_URL}/auth/login`, formData);

      console.log("📥 Login API response:", res.data);

      // Call AuthContext login() to store tokens + user data
      login(res.data);

      toast.success("Login Successful");

      window.location.href = "/dashboard";
    } catch (err) {
      console.error("❌ Login Error:", err);

      const msg = err.response?.data?.message || "Invalid credentials";
      setErrorMsg(msg);

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container bg-gradient-to-br from-blue-800 via-blue-900 to-indigo-950 flex flex-col items-center min-h-screen overflow-hidden">
      {/* Logo Section */}
      <div className="logo-highlight-section relative w-full flex items-center justify-center h-[22vh] bg-gradient-to-b from-blue-700/40 via-blue-800/60 to-blue-900/70 backdrop-blur-md shadow-md">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.25),transparent_70%)] blur-3xl opacity-70"></div>
        <img
          src={ampliNovaLogo}
          alt="AmpliNova Logo"
          className="company-logo relative z-10 max-h-[140px] sm:max-h-[160px] md:max-h-[180px]"
        />
      </div>

      {/* Login Box */}
      <div className="flex-1 flex items-center justify-center w-full px-4 py-8">
        <div className="auth-box w-full max-w-[440px] bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
          </div>

          {errorMsg && <p className="text-red-600 text-sm mb-3">{errorMsg}</p>}

          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-800"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-800"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <a
              href="/forgot-password"
              className="text-blue-600 hover:text-blue-800 text-sm transition-colors"
            >
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
