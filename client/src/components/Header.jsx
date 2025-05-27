import React from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import "./Header.css"; // optional, for styling
import logo from "../assets/bb_new.png"; // update path based on your project structure

const Header = () => {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <header className="header">
            {/* Left: Logged in as */}
            <div className="header-left">
                <p className="logged-in-text">Logged in as: {user.username}</p>
                <Link to={`/profile/${user.id}`} className="nav-button">Profile</Link>
                <Link to="/messages" className="nav-button">Messages</Link>
            </div>

            {/* Center: Logo */}
            <div className="header-center">
                <Link to="/welcome">
                    <img src={logo} alt="Barter Buddy Logo" className="header-logo" />
                </Link>
            </div>

            {/* Right: Logout */}
            <div className="header-right">
                <button onClick={logout} className="nav-button logout">Log Out</button>
            </div>
        </header>
    );
};

export default Header;
