import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

const Header = () => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    
    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm pt-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex max-w-7xl mx-auto py-0 px-3">
                <div className="w-3/12 min-w-60 px-5">
                    <Link to="/home">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Social App</h2>
                    </Link>
                </div>
                <div className="flex-initial w-6/12"></div>
                <div className="w-3/12 min-w-60 px-5 flex justify-end">
                    <button
                        onClick={toggleTheme}
                        className="p-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 shadow-sm"
                        aria-label="Toggle theme"
                    >
                        {isDarkMode ? (
                            // Sun icon for light mode
                            <svg className="w-5 h-5 text-gray-800 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        ) : (
                            // Moon icon for dark mode
                            <svg className="w-5 h-5 text-gray-800 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header