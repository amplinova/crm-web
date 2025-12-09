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
import MyAccountPage from "./pages/MyAccountPage";
import LeadsPage from "./pages/Leads/LeadsPage";
import AddLeadPage from "./pages/Leads/AddLeadPage";
import ViewLeadPage from "./pages/Leads/ViewLeadPage";
import EditLeadPage from "./pages/Leads/EditLeadPage";
import LeadStatus from "./pages/Leads/LeadStatus";
import LeadRecycleBin from "./pages/Leads/LeadRecycleBin";
import UsersPage from "./pages/Agents/AgentsPage";
import UserViewPage from "./pages/Agents/AgentsViewPage";
import UserEditPage from "./pages/Agents/UserEditPage";
import Admin from "./components/TeamStructure/Admin";
import Roles from "./components/TeamStructure/Roles";
import Permissions from "./components/TeamStructure/Permissions";
import EmailSMS from "./components/EmailSMS/EmailSMS";
import Task from "./components/Task/Task";
import Invoice from "./components/Invoice/Invoice";
import FollowupReport from "./components/FollowupReport/FollowupReport";
import RolePermissions from "./components/Permissions/RolePermissions";
import SettingsPage from "./pages/SettingsPage";

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/set-password" element={<SetPasswordPage />} />
      <Route path="/" element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/my-account" element={<MyAccountPage />} />
          <Route path="/sources" element={<SourcePage />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/leads/add" element={<AddLeadPage />} />
          <Route path="/leads/view/:id" element={<ViewLeadPage />} />
          <Route path="/leads/edit/:id" element={<EditLeadPage />} />
          <Route path="/leads/status" element={<LeadStatus />} />
          <Route path="/leads/recycle-bin" element={<LeadRecycleBin />} />
          <Route path="/agents" element={<UsersPage />} />
          <Route path="/agents/view/:id" element={<UserViewPage />} />
          <Route path="/agents/edit/:id" element={<UserEditPage />} />
          <Route path="/team-structure/admin" element={<Admin />} />
          <Route path="/team-structure/roles" element={<Roles />} />
          <Route path="/team-structure/permissions" element={<Permissions />} />
          <Route path="/email-sms" element={<EmailSMS />} />
          <Route path="/task" element={<Task />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/followup-report" element={<FollowupReport />} />
          <Route path="settings" element={<SettingsPage />} />

          <Route path="/team-structure/roles/permissions/:roleId" element={<RolePermissions />} />
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
