import React, { useState } from 'react';
import { useNavigate } from 'react-router';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        // placeholder before adding real logic (api call, auth, etc.)
        console.log('Logging in with:', { email, password });

        // simulates a successful login
        navigate('/browse');
    };

    return (
        <div className="login-page">
            <h2>Login to Barter Buddy</h2>
            <form onSubmit={handleLogin} className="login-form">
                <label htmlFor="email">Email:</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" className="magic-button">Log In</button>
            </form>
        </div>
    );
};

export default LoginPage;
