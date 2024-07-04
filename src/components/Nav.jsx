import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
    return (
        <div>
            <nav>
                <ul  className="flex flex-col">
                    <li><Link to="/profile">Profile</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                    <li><Link to="/settings">Settings</Link></li>
                </ul>
            </nav>
        </div>
    )
}

export default Nav