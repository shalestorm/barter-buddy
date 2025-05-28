import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import background_login from "../assets/background_login.png";

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
        <div className="page-container">
            <div className="gradient" style={{ backgroundImage: `url(${background_login})` }}>
                <div className="background-overlay"></div>
            </div>

            <div className="login-page">
    <h2>Login</h2>
    <form onSubmit={handleSubmit}>
        <label>
            Username: <> </>
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
            Password: <> </>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
            />
        </label>
        <br />
        <div className="action-buttons-container">
            <button
                className="magic-button"
                type="submit"
                disabled={loading}
            >
                {loading ? "Logging in..." : "Login"}
            </button>
        </div>
    </form>

    <div className="action-buttons-container">
        <button className="magic-button" onClick={() => navigate("/signup")}>
            Don’t have an account? Sign Up
        </button>
    </div>

  {error && <p style={{ color: 'red' }}>{error}</p>}
</div>
</div>
);
}
