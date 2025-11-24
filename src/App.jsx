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
import LeadStatus from "./pages/Leads/LeadStatus";
import LeadRecycleBin from "./pages/Leads/LeadRecycleBin";
import UsersPage from "./pages/UsersPage";
import UserViewPage from "./pages/users/UserViewPage";
import UserEditPage from "./pages/users/UserEditPage";
import Admin from "./components/TeamStructure/Admin";
import Roles from "./components/TeamStructure/Roles";
import AddRole from "./components/TeamStructure/AddRole";
import ViewRole from "./components/TeamStructure/ViewRole";
import EditRole from "./components/TeamStructure/EditRole";
import Permissions from "./components/TeamStructure/Permissions";
import EmailSMS from "./components/EmailSMS/EmailSMS";
import Task from "./components/Task/Task";
import Invoice from "./components/Invoice/Invoice";
import FollowupReport from "./components/FollowupReport/FollowupReport";

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
          <Route path="/leads/status" element={<LeadStatus />} />
          <Route path="/leads/recycle-bin" element={<LeadRecycleBin />} />
          <Route path="/agents" element={<UsersPage />} />
          <Route path="/agents/view/:id" element={<UserViewPage />} />
          <Route path="/agents/edit/:id" element={<UserEditPage />} />
          <Route path="/team-structure/admin" element={<Admin />} />
          <Route path="/team-structure/roles" element={<Roles />} />
          <Route path="/team-structure/roles/add" element={<AddRole />} />
          <Route path="/team-structure/roles/view/:id" element={<ViewRole />} />
          <Route path="/team-structure/roles/edit/:id" element={<EditRole />} />
          <Route path="/team-structure/permissions" element={<Permissions />} />
          <Route path="/email-sms" element={<EmailSMS />} />
          <Route path="/task" element={<Task />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/followup-report" element={<FollowupReport />} />
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
