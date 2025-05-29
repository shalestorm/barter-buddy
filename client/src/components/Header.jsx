import React, { useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from 'react-router';
import './Header.css'
import logo from '../assets/bb_new.png';
// import background from '..assets/background.jpeg'

export default function Header() {
    const [loading, setLoading] = useState(false);
    const { profilePicUrl } = useAuth()

    const { user, logout } = useAuth();

    const navigate = useNavigate();


    const handleLogout = async (e) => {
        setLoading(true);
        const success = await logout();
        if (success) {
            navigate('/login');
        }
    };


    return (
        <div className="header">
            <div className="header-left">
                <h2 className="greet">Hello, {user.first_name} {user.last_name.charAt(0)}. !</h2>
                <Link to={`/profile/${user.id}`}>
                    <img src={profilePicUrl || "/default.png"} alt="User Profile Pic" className="header-prof-pic" />
                </Link>
                <div className="header-nav-buttons">
                    <button className='magic-button' onClick={() => navigate(`/profile/${user.id}`)} disabled={loading}>My Profile</button>
                    <button className='magic-button' onClick={() => navigate(`/messages/${user.id}`)} disabled={loading}>Messages</button>
                </div>
            </div>
            <div className="header-center">
                <Link to='/dashboard'>
                    <img src={logo} alt="Barter Buddy Logo" className="header-logo" />
                </Link>
            </div>
            <div className="header-right">
                <button className='magic-button' onClick={handleLogout} disabled={loading}>Log Out</button>
            </div>
        </div>
    );
};
