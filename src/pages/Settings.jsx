import React from "react";
import { Link } from "react-router-dom";

const Settings = () => {
    return (
        <div>
            <h1 className="text-center">Settings</h1>
            <Link to="/"><h1 className="text-center">LoginSignupHub</h1></Link>
        </div>
    )
}

export default Settings