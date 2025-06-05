// ThemeContext.jsx - controls the light/dark theme of the app in a Harry Potter style
import React, { createContext, useContext, useEffect, useState } from 'react';

// This creates a new context that other components can use to share the current theme setting
const ThemeContext = createContext();

// This is the component that wraps around the app and gives theme access to all other components
export const ThemeProvider = ({ children }) => {
    // This sets up the theme state. If a theme was saved in localStorage, it uses that. Otherwise, it starts as 'wizard'.
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'wizard';
    });

    // This function switches between 'wizard' (light mode) and 'dark-lord' (dark mode)
    const toggleTheme = () => {
        const newTheme = theme === 'wizard' ? 'dark-lord' : 'wizard';
        setTheme(newTheme); // updates the state
        localStorage.setItem('theme', newTheme);  // saves the new theme in the browser so it remembers it
    };

    // Every time the theme changes, this sets a custom attribute on the body tag so our CSS knows which theme to apply
    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    // This makes the theme and toggle function available to any component that wants to use them
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};


// This is a shortcut hook so other components can easily grab the theme or call toggleTheme
export const useTheme = () => useContext(ThemeContext);


// “I created a ThemeContext to manage the theme across the app.It stores
// whether we’re in ‘wizard’ mode or ‘dark - lord’ mode, which are just our
// light and dark themes.I used localStorage so the user’s theme choice sticks
// even after refreshing the page.Then, I use a useEffect to update the < body >
// tag with a special data - theme attribute so that our CSS can respond to the
// current theme.Finally, I made a custom hook so any component can get the current
// theme or toggle between them.It all gets shared through a provider that wraps the
// whole app. -CT
