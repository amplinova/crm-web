import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AuthPage from "./components/AuthPage";
import DashboardPage from "./components/Dashboard/DashboardPage";
import PrivateRoute from "./Auth/PrivateRoute";
import DashboardLayout from "./components/Layout/DashboardLayout";
import SetPasswordPage from "./SetPasswordPage";
import { AuthProvider } from "./Auth/AuthContext";
import SourcePage from "./pages/SourcePage";
import LeadsPage from "./pages/Leads/LeadsPage";
import UsersPage from "./pages/UsersPage";
import UserViewPage from "./pages/users/UserViewPage";
import UserEditPage from "./pages/users/UserEditPage";

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/set-password" element={<SetPasswordPage />} />
      <Route path="/" element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/sources" element={<SourcePage />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/agents" element={<UsersPage />} />

          <Route path="/agents/view/:id" element={<UserViewPage />} />
          <Route path="/agents/edit/:id" element={<UserEditPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" reverseOrder={false} />
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
