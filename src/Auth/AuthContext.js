import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || null);
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || null);
    const [role, setRole] = useState(localStorage.getItem("role") || null);
    const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
    const [permissions, setPermissions] = useState(JSON.parse(localStorage.getItem("permissions")) || []);
    const [email, setEmail] = useState(null);

    console.log("🔹 Stored Access Token:", accessToken);
    console.log("🔹 Stored Refresh Token:", refreshToken);
    console.log("🔹 Stored Role:", role);
    console.log("🔹 Stored UserId:", userId);
    console.log("🔹 Stored Permissions:", permissions);

    // Decode JWT safely
    const decodeToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            console.log("🔍 Decoded Token:", decoded);
            return decoded;
        } catch (error) {
            console.error("❌ Error decoding token:", error);
            return null;
        }
    };

    // Return expiration time in ms
    const getTokenExpirationTime = (token) => {
        const decoded = decodeToken(token);
        return decoded?.exp ? decoded.exp * 1000 : null;
    };

    // LOGOUT FUNCTION
    const logout = () => {
        console.log("🚪 Logging out…");

        setAccessToken(null);
        setRefreshToken(null);
        setRole(null);
        setUserId(null);
        setPermissions([]);
        setEmail(null);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        localStorage.removeItem("permissions");

        Swal.fire({
            title: "Logged Out",
            text: "You have been logged out successfully.",
            icon: "info"
        });
    };

    // LOGIN FUNCTION
    const login = (response) => {
        console.log("📥 Login Response Received:", response);

        const { accessToken, refreshToken, role, userId, permissions } = response;

        // Save in React state
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setRole(role);
        setUserId(userId);
        setPermissions(permissions);

        // Save in local storage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("role", role);
        localStorage.setItem("userId", userId);
        localStorage.setItem("permissions", JSON.stringify(permissions));

        // Decode email
        const decoded = decodeToken(accessToken);
        if (decoded?.sub) {
            setEmail(decoded.sub);
            console.log("📧 Logged-in user email:", decoded.sub);
        }

        // Auto logout timer
        const expirationTime = getTokenExpirationTime(accessToken);
        if (expirationTime) {
            const timeout = expirationTime - Date.now();
            console.log("⏳ Logout scheduled in:", timeout / 1000, "seconds");
            setTimeout(logout, timeout);
        }
    };

    // Check token on page reload
    useEffect(() => {
        console.log("🔄 Checking saved token on page refresh");

        if (!accessToken) return;

        const expirationTime = getTokenExpirationTime(accessToken);

        if (expirationTime && expirationTime > Date.now()) {
            const timeout = expirationTime - Date.now();
            console.log("⏳ Auto-logout on reload in:", timeout / 1000, "seconds");
            setTimeout(logout, timeout);

            const decoded = decodeToken(accessToken);
            if (decoded?.sub) {
                setEmail(decoded.sub);
            }
        } else {
            console.log("⚠️ Token expired on reload");
            logout();
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                refreshToken,
                role,
                userId,
                permissions,
                email,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
