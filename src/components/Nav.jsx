import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
    return (
        <div>
            <nav className="">
                <ul className="flex flex-col">
                    <li><Link to="/profile">Profile</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                    <li><Link to="/settings">Settings</Link></li>
                </ul>
                {/* Pin this current user info to the bottom of the left margin.
                Should be in a fixed position like the one on twitter. */}
                <div className="inset-x-0 bottom-0">
                    <div id="pfp">Image</div>
                    <div id="username">username</div>
                </div>
            </nav>
        </div>
    )
}

export default Nav