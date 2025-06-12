import React, { createContext, useState, useEffect, useContext } from "react";
import { API_BASE_URL } from "../config";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profilePicUrl, setProfilePicUrl] = useState("")

    async function checkAuth() {
        try {
            const res = await fetch(`${API_BASE_URL}/users/auth/me`, {
                credentials: "include",
            });

            if (!res.ok) {
                setUser(null);
                setProfilePicUrl("");
                setLoading(false);
                return false;
            }

            const userData = await res.json();
            setUser(userData);
            setProfilePicUrl(`${userData.profile_pic}?t=${Date.now()}`)
            setLoading(false);
            return true;
        } catch (error) {
            console.error("Auth check failed:", error);
            setUser(null);
            setProfilePicUrl("");
            setLoading(false);
            return false;
        }
    }

    async function login(username, password) {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                credentials: "include",
                body: new URLSearchParams({ username, password }).toString(),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Login failed");
            }
            await checkAuth();
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            setUser(null);
            return false;
        }
    }


    async function logout() {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error("Logout failed");
            }

            setUser(null);
            return true;
        } catch (error) {
            console.error("Logout failed:", error);
            return false;
        }
    }

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, checkAuth, profilePicUrl, setProfilePicUrl }}>
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {
    return useContext(AuthContext);
}
