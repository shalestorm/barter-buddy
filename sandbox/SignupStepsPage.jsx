import { useState } from "react";
import { Link, useNavigate } from "react-router";

export default function SignupPage() {
    const [newUsername, setNewUsername] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [signupStep, setSignupStep] = useState(1); // RIC: step-by-step signup

    const navigate = useNavigate()

    // RIC: Signup Step 1: check username and email
    const handleSignupStep1 = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // if (!newUsername.trim()) {
        //     setError("A valid username is required."); // RIC: We could use this to validate length etc (according to schema)
        //     setLoading(false);
        //     return;
        // };

        // if (!newEmail.trim()) {
        //     setError("A valid email is required."); // RIC: We could use this to validate length etc (according to schema)
        //     setLoading(false);
        //     return;
        // };

        // RIC: Check if username or email exist
        try {
            const response = await fetch("http://localhost:8000/users");

            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }

            const users = await response.json();

            const trimmedNewUsername = newUsername.trim().toLowerCase();
            const trimmedNewEmail = newEmail.trim().toLowerCase();

            // RIC: check if username or email match in users (returns bool)
            const usernameTaken = users.some((u) => u.username.toLowerCase() === trimmedNewUsername); // RIC: {use toLowerCase()?}
            const emailTaken = users.some((u) => u.email.toLowerCase() === trimmedNewEmail); // RIC: {use toLowerCase()?}

            if (usernameTaken || emailTaken) {
                if (usernameTaken && emailTaken) {
                    setError("Username and email already in use. Try other.");
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

    // RIC: Signup Step 2: check password
    const handleSignupStep2 = (e) => {
        e.preventDefault();
        setError(null);

        // if (!newPassword.trim()) {
        //     setError("A password is required."); // RIC: We could use this to validate length etc (according to schema)
        //     setLoading(false);
        //     return;
        // };

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        };

        setSignupStep(3);
    };

    // RIC: Signup Step 3: first and last names + final submit (create account)
    const handleSignupStep3 = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const formData = {
            username: newUsername.trim(),
            email: newEmail.trim(),
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            // bio: "", // RIC: {Necessary?}
            // profile_pic: "", // RIC: {Necessary?}
            password: newPassword.trim(),
        };

        // RIC: create new user
        try {
            const signupResponse = await fetch('http://localhost:8000/users/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }, // RIC: {Check headers vs LoginPage}
                body: JSON.stringify(formData), // RIC: {Is this correct?}
            });

            if (!signupResponse.ok) {
                throw new Error('Failed to create user.');
            }

            // RIC: On Signup success, navigate to Login page (user must log in with new account)
            navigate('/login');
        } catch(err) {
            console.error(err);
            setError("Signup failed. Try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="signup-page">
            <h2>New Account</h2>
            {/*RIC: Display form based on current step*/}
            <p>Step {signupStep} of 3</p>
            <form onSubmit={signupStep === 1 ? handleSignupStep1 : signupStep === 2 ? handleSignupStep2 : handleSignupStep3}>
                {/*RIC: Step 1: username and email*/}
                {signupStep === 1 && (
                    <>
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
                    </>
                )}
                {/*RIC: Step 2: password*/}
                {signupStep === 2 && (
                    <>
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
                    </>
                )}
                {/*RIC: Step 3 (final): first and last name + submit*/}
                {signupStep === 3 && (
                    <>
                        <label>
                            First Name:
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                placeholder="first name"
                            />
                        </label>
                        <br />
                        <label>
                            Last Name:
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                placeholder="last name"
                            />
                        </label>
                    </>
                )}
                <br />
                {/*RIC: previous step button*/}
                {step > 1 && (
                    <button
                        type="button"
                        onClick={() => setStep(step - 1)}
                        disabled={loading}
                    >
                        Back
                    </button>
                )}
                {/*RIC: submit (or next step) button*/}
                <button type="submit" disabled={loading}>
                    {loading ? "Loading..." : signupStep === 3 ? "Submit" : "Next"}
                </button>

            </form>

            <div className="login-link">
                Already have an account? <Link to="/login">Return to login page</Link>
                {/*RIC: {We should add a similar link to Login page that navigates to Signup (and home?)}*/}
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );

}
