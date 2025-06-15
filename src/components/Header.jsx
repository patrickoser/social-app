import React from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

const Header = () => {
    
    return (
        <header className="flex justify-between">
            <section>
                <Link to="/home"><h2>Social App</h2></Link>
            </section>
        </header>
    )
}

export default Header