import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import background_login from "../assets/background_login.png";
import logo from '../assets/bb_new.png';

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
                <Link to='/'>
                    <img src={logo} alt="Barter Buddy Logo" className="bb-logo" />
                </Link>
                <h2>Login</h2>
                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >
                    <div className="form-group">
                        <label htmlFor="username">Username: </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="username"
                            autoComplete="username"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password: </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="password"
                                autoComplete="current-password"
                            />
                    </div>
                    <div className="login-button-group">
                        <button
                            className="magic-button"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Log In"}
                        </button>
                    </div>
                </form>
                <br />
                <div className="signup-redirect">
                    <button className="magic-button" onClick={() => navigate("/signup")}>
                        Don’t have an account? Sign Up Now!
                    </button>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
}
