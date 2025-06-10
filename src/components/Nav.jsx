import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Nav = () => {
    const { user } = useContext(AuthContext)

    return (
        <div className="flex h-screen">
            <nav className="flex flex-col h-full relative">
                <ul className="flex flex-col">
                    <li><Link to={`/profile/${user?.username}`}>Profile</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                    <li><Link to="/settings">Settings</Link></li>
                </ul>
            </nav>
        </div>
    )
}

export default Nav