import { useEffect, useState } from "react";
import { Navigate } from "react-router";

export default function ProtectedRoute({ children }) {
    const [isAuthed, setIsAuthed] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/users/me", {
                    credentials: "include",
                });
                setIsAuthed(res.ok);
            } catch (err) {
                console.error("Auth check failed:", err);
                setIsAuthed(false);
            }
        };

        checkAuth();
    }, []);

    if (isAuthed === null) return <div>Loading...</div>;
    if (!isAuthed) return <Navigate to="/login" replace />;
    return children;
}
