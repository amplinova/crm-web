import React, { useState } from "react";
import ampliNovaLogo from "./Assets/AmpliNova Final Logo.png";
import { API_BASE_URL } from "./Auth/Api";

const SetPasswordPage = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/set-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setMsg("Password set successfully! Redirecting...");

      setTimeout(() => (window.location.href = "/login"), 2000);
    } catch (err) {
      setMsg(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container bg-gradient-to-br from-blue-800 via-blue-900 to-indigo-950 flex flex-col items-center min-h-screen overflow-hidden">

      <div className="logo-highlight-section relative w-full flex items-center justify-center h-[22vh]">
        <img src={ampliNovaLogo} alt="Logo" className="max-h-[160px]" />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8 w-full">
        <div className="auth-box max-w-[440px] w-full bg-white/90 rounded-2xl shadow-2xl p-8">

          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
            Set Password
          </h2>

          {msg && <p className="text-center text-blue-700 py-2">{msg}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2"
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white bg-gradient-to-r from-blue-700 to-blue-900"
            >
              {loading ? "Setting..." : "Set Password"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default SetPasswordPage;
