// src/components/ThemeToggle.jsx
import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button onClick={toggleTheme} className="global-theme-toggle">
            {theme === 'wizard' ? '🐍 Embrace the Dark Lord' : '⚡ Return to Wizardry'}
        </button>
    );
};

export default ThemeToggle;
