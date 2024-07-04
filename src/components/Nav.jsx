import React from "react";

const Nav = () => {
    return (
        <div>
            <nav>
                <ul  className="flex flex-row justify-between">
                    <li><Link to="/profile">Profile</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                    <li><Link to="/settings">Settings</Link></li>
                </ul>
            </nav>
        </div>
    )
}

export default Nav