import React from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

const Header = () => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    
    return (
        <header className="flex justify-between">
            <div>
                <Link to="/home">
                    <h2 className="text-gray-900 dark:text-white">Social App</h2>
                </Link>
            </div>
        </header>
    )
}

export default Header