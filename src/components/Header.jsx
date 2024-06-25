import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
    
    return (
        <header className="flex justify-between">
            <section>
                <Link to="/profile"><h2>Comparable</h2></Link>
            </section>
            <nav>
                <ul className="flex flex-row justify-center">
                    <li><Link>New List</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                    <li><Link to="/settings">Settings</Link></li>
                </ul>
            </nav>
        </header>
    )
}

export default Header