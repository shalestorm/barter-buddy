// ThemeToggle.jsx - this component shows a button that lets users switch between light and dark themes
import React from 'react';
import { useTheme } from '../context/ThemeContext'; // This hook gives access to the current theme and a function to change it

const ThemeToggle = () => {
    // Pulling the current theme and toggle function from context
    const { theme, toggleTheme } = useTheme();

    return (
        // This button calls toggleTheme when clicked, and the text changes depending on the current theme
        <button onClick={toggleTheme} className="global-theme-toggle">
            {theme === 'wizard' ? '💀 Avada the Glow' : '🪄 Accio Light'}
        </button>
    );
};

export default ThemeToggle;

// This is the ThemeToggle component. It's just a little
// toggle button that lets users switch between our two
// custom themes: ‘wizard’ for light mode and ‘dark-lord’
// for dark mode. I used the useTheme hook from our context
// to grab the current theme and the function that flips it.
// When a user clicks the button, it updates the theme and
// the label changes accordingly. The actual style changes
// are handled by our CSS using the data-theme attribute on
// the body, so this toggle just controls the logic and user
// interaction. -CT
