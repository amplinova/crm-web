// src/api/axios.js
import axios from "axios";
import { useAuth } from "./AuthContext";
import { API_BASE_URL } from "./Api";

const useAxios = () => {
    const { accessToken } = useAuth();

    console.log("🔐 Axios using Access Token:", accessToken);

    const instance = axios.create({
        baseURL: API_BASE_URL,
    });

    // Add Authorization header automatically
    instance.interceptors.request.use(
        (config) => {
            console.log("➡️ Axios Request:", config.url);

            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
                console.log("✔ Authorization header added");
            } else {
                console.warn("⚠ No access token found – request sent without Authorization");
            }

            return config;
        },
        (error) => {
            console.error("❌ Request Error:", error);
            return Promise.reject(error);
        }
    );

    return instance;
};

export default useAxios;
