// src/components/PrivateRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = () => {
    const { accessToken } = useAuth();

    console.log("🔐 PrivateRoute - AccessToken:", accessToken);

    // If no accessToken, redirect to login
    return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
