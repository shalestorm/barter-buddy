import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const success = await login(username, password);
        if (success) {
            navigate("/dashboard");
        } else {
            setError("Invalid username or password");
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
                <br />
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
                <br />
                <button type="submit" disabled={loading}>
                    {loading ? "Logging in" : "Log In"}
                </button>
            </form>

            <div className="signup-link">
                Don't have an account? <Link to="/signup">Sign Up</Link>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}
