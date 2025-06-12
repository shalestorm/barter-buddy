import React, { useEffect, useState } from 'react';
import logo from '../assets/bb_new.png';
import '../styles/WelcomePage.css';
import Carousel from '../components/Carousel';
import { useNavigate } from 'react-router';
import { API_BASE_URL } from "../config";

const WelcomePage = () => {
    const navigate = useNavigate();
    const [quote, setQuote] = useState('')
    const [author, setAuthor] = useState('')

    useEffect(() => {
        const colors = [
            [25, 65, 130],
            [255, 204, 0],
            [25, 65, 130],
            [255, 204, 0]
        ];

        let step = 0;
        const colorIndices = [0, 1, 2, 3];
        const gradientSpeed = 0.002;

        const updateGradient = () => {
            const c0_0 = colors[colorIndices[0]];
            const c0_1 = colors[colorIndices[1]];
            const c1_0 = colors[colorIndices[2]];
            const c1_1 = colors[colorIndices[3]];

            const istep = 1 - step;
            const r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
            const g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
            const b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
            const color1 = `rgb(${r1},${g1},${b1})`;

            const r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
            const g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
            const b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
            const color2 = `rgb(${r2},${g2},${b2})`;

            const gradientEl = document.getElementById("gradient");
            if (gradientEl) {
                gradientEl.style.background = `linear-gradient(to right, ${color1}, ${color2})`;
            }

            step += gradientSpeed;
            if (step >= 1) {
                step %= 1;
                colorIndices[0] = colorIndices[1];
                colorIndices[2] = colorIndices[3];

                colorIndices[1] = (colorIndices[1] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
                colorIndices[3] = (colorIndices[3] + Math.floor(1 + Math.random() * (colors.length - 1))) % colors.length;
            }

            requestAnimationFrame(updateGradient);
        };

        const fetchDailyQuote = () => {
            fetch(`${API_BASE_URL}/api/quote`)
                .then(res => res.json())
                .then(data => {
                    if (data && data[0]) {
                        setQuote(data[0].q);
                        setAuthor(data[0].a);
                    }
                })
                .catch(err => console.error("Failed to fetch quote:", err));
        };

        updateGradient();
        fetchDailyQuote();
    }, []);



    const handleSignupButton = () => {
        navigate('/signup');
    }

    const handleLoginButton = () => {
        navigate('/login');
    }


    return (
        <div className="gradient">
            <div className="background-overlay"></div>
            <header className="centered-header">
                <div className="daily-quote">
                    <h2>{quote ? `"${quote}"` : "Loading quote..."}</h2>
                    <h3>{author && `— ${author}`}</h3>
                </div>
                <img src={logo} alt="Barter Buddy Logo" className="welcome-logo" />
                <br />
                <h1 className="magic-title">Welcome to Skill Swap!</h1>
                <h2 className="magic-title">The Free Exchange of Knowledge</h2>
            </header>
            <div className="welcome-buttons-container">
                <button className="magic-button left-button" onClick={handleSignupButton}>NEW TO SKILL SWAP?</button>
                <button className="magic-button right-button" onClick={handleLoginButton}>LOG IN</button>
            </div>

            <Carousel />
        </div>
    );

};

export default WelcomePage;
