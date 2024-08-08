import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../config/firebase";

const Settings = () => {
    return (
        <div>
            <h1 className="text-center">Settings</h1>
            <Link to="/"><h1 className="text-center">LoginSignupHub</h1></Link>
            <button></button>
        </div>
    )
}

export default Settings