import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
    
    return (
        <header className="flex justify-between">
            <section>
                <Link to="/home"><h2>Social App</h2></Link>
            </section>
            <nav>
                <ul className="flex flex-row justify-between">
                    <li><Link to="/profile">Profile</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                    <li><Link to="/settings">Settings</Link></li>
                </ul>
            </nav>
        </header>
    )
}

export default Header