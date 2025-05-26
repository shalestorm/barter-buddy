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

    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // if (!newUsername.trim()) {
        //     setError("A valid username is required.");
        //     setLoading(false);
        //     return;
        // };

        // if (!newEmail.trim()) {
        //     setError("A valid email is required.");
        //     setLoading(false);
        //     return;
        // };

        // if (!newPassword.trim()) {
        //     setError("A password is required.");
        //     setLoading(false);
        //     return;
        // };

        if (newPassword !== confirmPassword) {
            setError("Password does not match.");
            setLoading(false);
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

        // RIC: Check if username or email exist
        try {
            const response = await fetch("http://localhost:8000/users");

            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }

            const users = await response.json();

            const trimmedNewUsername = newUsername.trim().toLowerCase(); // RIC: {use toLowerCase()?}
            const trimmedNewEmail = newEmail.trim().toLowerCase(); // RIC: {use toLowerCase()?}

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


            // RIC: On Signup success, navigate to Login page (user must log in with new account)
            navigate('/login');

        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again."); // Ric: {too general?}
        } finally {
            setLoading(false);
        }


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
                {/*RIC: {We should add a similar link to Login page that navigates to Signup (and home?)}*/}
            </div>

            {error && <p>{error}</p>}
        </div>
    );

}
