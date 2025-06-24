import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Nav = () => {
    const { user } = useContext(AuthContext)

    return (
        <div className="flex h-full">
            <nav className="flex flex-col h-full relative">
                <ul className="flex flex-col space-y-3">
                    <li><Link to={`/profile/${user?.username}`} className="text-lg font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Profile</Link></li>
                    <li><Link to="/contact" className="text-lg font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Contact</Link></li>
                    <li><Link to="/settings" className="text-lg font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Settings</Link></li>
                </ul>
            </nav>
        </div>
    )
}

export default Nav