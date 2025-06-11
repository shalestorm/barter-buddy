import { useState } from "react";
import { Link, useNavigate } from "react-router";
import background_signup from '../assets/background_signup.jpg';
import logo from '../assets/bb_new.png';
import '../styles/LoginSignup.css';

export default function SignupPage() {
    const [newUsername, setNewUsername] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [signupStep, setSignupStep] = useState(1);

    const navigate = useNavigate();

    const API_BASE = "http://localhost:8000";

    const handleSignupStep1 = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE}/users`);

            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }

            const users = await response.json();

            const trimmedNewUsername = newUsername.trim().toLowerCase();
            const trimmedNewEmail = newEmail.trim().toLowerCase();

            const usernameTaken = users.some((u) => u.username.toLowerCase() === trimmedNewUsername);
            const emailTaken = users.some((u) => u.email.toLowerCase() === trimmedNewEmail);

            if (usernameTaken || emailTaken) {
                if (usernameTaken && emailTaken) {
                    setError("Username and email already in use. Try others.");
                } else if (usernameTaken) {
                    setError("Username taken. Try another.");
                } else {
                    setError("Email already in use. Try another.");
                }
                return;
            }

            setSignupStep(2);

        } catch (err) {
            console.error(err);
            setError("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSignupStep2 = (e) => {
        e.preventDefault();
        setError(null);

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setSignupStep(3);
    };

    const handleSignupStep3 = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const formData = {
            username: newUsername.trim(),
            email: newEmail.trim(),
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            password: newPassword.trim(),
        };

        try {
            const signupResponse = await fetch(`${API_BASE}/users/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!signupResponse.ok) {
                throw new Error('Failed to create user.');
            }

            navigate('/login');
        } catch (err) {
            console.error(err);
            setError("Signup failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-background" style={{ backgroundImage: `url(${background_signup})` }}>
            <div className="signup-overlay"></div>
            <div className="signup-container">
                <Link to='/'>
                    <img src={logo} alt="Barter Buddy Logo" className="bb-logo" />
                </Link>
                <h2>New Account</h2>
                <h5>Step {signupStep} of 3</h5>
                <form
                    className="signup-form"
                    onSubmit={
                        signupStep === 1
                            ? handleSignupStep1
                            : signupStep === 2
                                ? handleSignupStep2
                                : handleSignupStep3
                    }
                >
                    {signupStep === 1 && (
                        <>
                            <div className="form-group">
                                <label htmlFor="username"><h3>Username:</h3></label>
                                <input
                                    id="username"
                                    type="text"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    required
                                    placeholder="username"
                                    maxLength={16}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email"><h3>Email:</h3></label>
                                <input
                                    id="email"
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    required
                                    placeholder="example@domain.com"
                                    maxLength={32}
                                />
                            </div>
                        </>
                    )}
                    {signupStep === 2 && (
                        <>
                            <div className="form-group">
                                <label htmlFor="password"><h3>Password:</h3></label>
                                <input
                                    id="password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    placeholder="password"
                                    maxLength={32}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirm-password"><h3>Confirm Password:</h3></label>
                                <input
                                    id="confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    placeholder="confirm password"
                                    maxLength={32}
                                />
                            </div>
                        </>
                    )}
                    {signupStep === 3 && (
                        <>
                            <div className="form-group">
                                <label htmlFor="first-name"><h3>First Name:</h3></label>
                                <input
                                    id="first-name"
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                    placeholder="first name"
                                    maxLength={16}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="last-name"><h3>Last Name:</h3></label>
                                <input
                                    id="last-name"
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                    placeholder="last name"
                                    maxLength={16}
                                />
                            </div>
                        </>
                    )}
                    <div className="signup-button-group">
                        {signupStep > 1 ? (
                            <button
                                type="button"
                                className="magic-button"
                                onClick={() => setSignupStep(signupStep - 1)}
                                disabled={loading}
                            >
                                Back
                            </button>
                        ) : (
                            <div />
                        )}
                        <button
                            type="submit"
                            className="magic-button"
                            disabled={loading}
                        >
                            {loading ? "Loading..." : signupStep === 3 ? "Submit" : "Next"}
                        </button>
                    </div>
                </form>
                <br />
                <div className="login-redirect">
                    <button className="magic-button" onClick={() => navigate('/login')}>
                        Already have an account? Log in here!
                    </button>
                </div>

                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
}
