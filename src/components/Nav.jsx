import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../config/firebase";

const Nav = () => {
    const { user, loading } = useContext(AuthContext)

    return (
        <div className="flex">
            <nav className="flex flex-col justify-end h-full">
                <ul className="flex flex-col">
                    <li><Link to="/profile">Profile</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                    <li><Link to="/settings">Settings</Link></li>
                </ul>
                {/* Pin this current user info to the bottom of the left margin.
                Should be in a fixed position like the one on twitter. Add loading
                to account for when username is loading and a default for if no
                username can be found. */}
                <div className="place-self-end inset-x-0 bottom-0">
                    <div id="pfp">Image</div>
                    <div id="username">{user.username}</div>
                </div>
            </nav>
        </div>
    )
}

export default Nav