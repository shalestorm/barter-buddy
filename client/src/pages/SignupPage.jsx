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
            setError("A valid username is required.");
            return;
        };

        if (!newEmail.trim()) {
            setError("A valid email is required.");
            return;
        };

        if (!newPassword.trim()) {
            setError("A password is required.");
            return;
        };

        if (newPassword !== confirmPassword) {
            setError("Password confirm does not match.");
            return;
        };

        const formData = {
            username: newUsername.trim(),
            email: newEmail.trim(),
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            // bio: "", // RIC: {Necessary?}
            // profile_pic: "", // RIC: {Necessary?}
            password: newPassword.trim(),
        };

        // RIC: Check if username or email exists
        try {
            const response = await fetch("http://localhost:8000/users");

            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }

            const users = await response.json();
            const trimmedUsername = newUsername.trim().toLowerCase();
            const trimmedEmail = newEmail.trim().toLowerCase();

            // RIC: Check db for either username or email
            const existingUser = users.find((u) => u.username.toLowerCase() === trimmedUsername || u.email.toLowerCase() === trimmedEmail);

            // RIC: If either username or email exists
            if (existingUser) {
                if (existingUser.username.toLowerCase() === trimmedUsername) {
                    setError("That username is taken. Try another.");
                } else {
                    setError("That email is already in use. Try another.");
                }
                // RIC: Here is where/when we could apply "Forgot password?"
                return;
            }

            // RIC: create new user
            const signupResponse = await fetch('http://localhost:8000/users/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }, // RIC: {CHECK WITH SKYLER HEADERS & HOW TO HANDLE CREDENTIALS}
                body: JSON.stringify(formData), // RIC: {Is this correct?}
            });

            if (!signupResponse.ok) {
                throw new Error('Failed to create user.');
            }

// RIC: Brought this from previous project, pending see if necessary:
            // const newUser = await signupResponse.json()
            // setUser({
            //     id: newUser.id,
            //     username: newUser.username,
            // });


            // RIC: On Signup success, navigate to Dashboard page (or protected route?)
            navigate('/dashboard');

        } catch (err) {
            console.error(err);
            setError("Network or server error"); // Ric: {too general?}
        } finally {
            setLoading(false);
        }

        // setLoading(false); // RIC: {redundant?}



// RIC: This is Cayla's existing boilerplate code:
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
                    {loading ? "Creating and Logging In" : "Create and Log In"}
                </button>
            </form>
            <div className="login-link">
                Already have an account? <Link to="/login">Return to login page</Link>
            </div>

            {error && <p>{error}</p>}
        </div>
    );

}
