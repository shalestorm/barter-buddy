import { useState } from "react";
import { useNavigate } from "react-router";

export default function SignupPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (res.ok) {
            console.log(`Welcome to Barter-Buddy ${username}!`);
        } else {
            console.error(`OOPS Error: ${data.message}`);
        }
    };

    return (
        <div className="signup-page">
            <h2>New Account</h2>
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
