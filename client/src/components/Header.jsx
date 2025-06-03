import React, { useEffect, useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from 'react-router';
import '../styles/Header.css'
import logo from '../assets/bb_new.png';

export default function Header() {
    const [loading, setLoading] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const [hasRequests, setHasRequests] = useState(false);
    const { profilePicUrl } = useAuth();
    const { user, logout } = useAuth();
    const navigate = useNavigate();


    const handleLogout = async (e) => {
        setLoading(true);
        const success = await logout();
        if (success) {
            navigate('/login');
        }
    };

    const API_BASE = "http://localhost:8000";

    // RIC: Check for unread messages (should also check for connection requests)
    useEffect(() => {
        const newMessageFetch = () => {
            fetch(`${API_BASE}/messages/user/${user.id}/unread`)
                .then(res => {
                    if (!res.ok) throw new Error("Failed fetch unread messages.");
                    return res.json();
                })
                .then(data => setHasUnread(data.length > 0))
                .catch(console.error);
        };
        newMessageFetch();

        const fetchRequests = () => {
            fetch(`${API_BASE}/connection_requests/received/${user.id}`)
                .then(res => {
                    if (!res.ok) throw new Error("Failed to fetch requests.");
                    return res.json();
                })
                .then(data => setHasRequests(data.length > 0))
                .catch(console.error);
        };
        fetchRequests();

        const intervalId = setInterval(() => {
            newMessageFetch();
            fetchRequests();
        }, 1000)
        return () => clearInterval(intervalId);
    }, [user.id]);


    return (
        <div className="header">
            <div className="header-left">
                <h2 className="greet">Hello, {user.first_name} {user.last_name.charAt(0)}. !</h2>
                <Link to={`/profile/${user.id}`}>
                    <img src={profilePicUrl || "/default.png"} alt="User Profile Pic" className="header-prof-pic" />
                </Link>
                <div className="header-nav-buttons">
                    <button
                        className='magic-button'
                        onClick={() => navigate(`/dashboard`)}
                        disabled={loading}
                    >
                        Browse
                    </button>
                    <button
                        className='magic-button'
                        onClick={() => navigate(`/profile/${user.id}`)}
                        disabled={loading}
                    >
                        My Profile
                    </button>
                    <button
                        className='magic-button'
                        onClick={() => navigate(`/messages/${user.id}`)}
                        disabled={loading}
                    >
                        {hasUnread
                            ? hasRequests
                                ? "Messages 🦉! 🤝!"
                                : "Messages 🦉!"
                            : hasRequests
                                ? "Messages 🤝!"
                                : "Messages"}
                    </button>
                </div>
            </div>
            <div className="header-center">
                <Link to='/dashboard'>
                    <img src={logo} alt="Barter Buddy Logo" className="header-logo" title="Browse more Buddies!" />
                </Link>
            </div>
            <div className="header-right">
                <button
                    className='magic-button'
                    onClick={handleLogout}
                    disabled={loading}
                >
                    Log Out
                </button>
            </div>
        </div>
    );
};
