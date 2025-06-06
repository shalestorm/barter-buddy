import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button onClick={toggleTheme} className="global-theme-toggle">
            {theme === 'wizard' ? '💀 Avada the Glow' : '🪄 Accio Light'}
        </button>
    );
};

export default ThemeToggle;
