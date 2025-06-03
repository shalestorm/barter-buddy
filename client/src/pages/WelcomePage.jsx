import React, { useEffect } from 'react';
import logo from '../assets/bb_new.png';
import backgroundcastle from '../assets/background.jpeg';
import '../styles/WelcomePage.css';
import Carousel from '../components/Carousel'; // Importing the Carousel component to display scrolling user profiles -CT */
import { useNavigate } from 'react-router';

const WelcomePage = () => {
    const navigate = useNavigate();

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

        updateGradient();
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
                <img src={logo} alt="Barter Buddy Logo" className="welcome-logo" />
                <br />
                <h1 className="magic-title">Welcome to Barter Buddy!</h1>
                <h2 className="magic-title">The Free Exchange of Knowledge</h2>
            </header>
            <div className="action-buttons-container">
                <button className="magic-button left-button" onClick={handleSignupButton}>NEW TO BARTER BUDDY?</button>
                <button className="magic-button login-button" onClick={handleLoginButton}>LOGIN</button>
            </div>
            {/* Adding the Carousel at the bottom of the page to show sample Barter Buddy users */}

            <Carousel />
        </div>
    );

};

export default WelcomePage;

// I imported the Carousel component that I built and then added it to the very
// bottom of the return block inside WelcomePage.jsx. This lets it show up under
// the logo and buttons so that visitors can see scrolling sample user profiles
// as part of the homepage. It gives the site a more dynamic, interactive feel
// and introduces the concept of bartering skills before even logging in. The
// carousel helps set the tone of the platform by showing fake user cards with
// the types of skills people might want to trade or learn. It scrolls automatically
// to keep things visually engaging, and it fits the magical theme by using custom
// styles from WelcomePage.css. -CT
