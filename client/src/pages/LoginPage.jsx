import { useState } from "react";
import { useNavigate } from "react-router";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);



    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const formData = new URLSearchParams();
        formData.append("username", username)
        formData.append("password", password)

        try {
            const res = await fetch("http://localhost:8000/auth/login", {
                method: "POST",
                headers: { "Accept": "application/json" },
                credentials: "include",
                body: formData,
            });

            if (res.ok) {
                // Login success, redirect to dashboard or protected route
                navigate("/dashboard");
            } else {
                const data = await res.json();
                setError(data.detail || "Login failed");
            }
        } catch (err) {
            setError("Network error, please try again.");
        }

        setLoading(false);
    };

    return (
        <div className="login-page">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        autoComplete="username"
                    />
                </label>

                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                    />
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in" : "Log In"}
                </button>
            </form>

            {error && <p>{error}</p>}
        </div>
    );
}
