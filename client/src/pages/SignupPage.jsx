import { useState } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";

export default function SignupPage() {
    const [newUsername, setNewUsername] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!newUsername.trim()) {
            setError('A valid username is required.');
            return;
        }

        if (!newEmail.trim()) {
            setError('A valid email is required.');
            return;
        }

        if (!newPassword.trim()) {
            setError('A password is required.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Password confirm does not match.');
            return;
        }

        // const res = await fetch('/api/register', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ username, password }),
        // });

        // const data = await res.json();

        // if (res.ok) {
        //     console.log(`Welcome to Barter-Buddy ${username}!`);
        // } else {
        //     console.error(`OOPS Error: ${data.message}`);
        // }
    };

    return (
        <div className="signup-page">
            <h2>New Account</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        required
                        placeholder="username"
                    />
                </label>
                <br />
                <label>
                    Email:
                    <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        required
                        placeholder="example@domain.com"
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        placeholder="password"
                    />
                </label>
                <br />
                <label>
                    Confirm Password:
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="confirm password"
                    />
                </label>
                <br />
                <label>
                    First & Last Name:
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        placeholder="first name"
                    />
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        placeholder="last name"
                    />
                </label>
                <br />

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in" : "Log In"}
                </button>
            </form>
            <div className="login-link">
                Already have an account? <Link to="/login">Return to login page</Link>
            </div>

            {error && <p>{error}</p>}
        </div>
    );

}
