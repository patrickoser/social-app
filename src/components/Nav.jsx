import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Nav = () => {
    const { user } = useContext(AuthContext)

    return (
        <div className="flex h-screen">
            <nav className="flex flex-col h-full relative">
                <ul className="flex flex-col space-y-2">
                    <li><Link to={`/profile/${user?.username}`} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Profile</Link></li>
                    <li><Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Contact</Link></li>
                    <li><Link to="/settings" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Settings</Link></li>
                </ul>
            </nav>
        </div>
    )
}

export default Nav