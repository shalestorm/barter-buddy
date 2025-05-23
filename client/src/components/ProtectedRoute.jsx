import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const [isAuthed, setIsAuthed] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/auth/me", {
                    credentials: "include",
                });
                setIsAuthed(res.ok);
            } catch (err) {
                setIsAuthed(false);
            }
        };

        checkAuth();
    }, []);

    if (isAuthed === null) return <div>Loading...</div>;
    if (!isAuthed) return <Navigate to="/login" replace />;
    return children;
}
