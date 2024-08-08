import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";

const Settings = () => {

    const logout = async () => {
        console.log(`User Status: ${auth.currentUser.email} has signed out.`)
        try {
            await signOut(auth)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div>
            <h1 className="text-center">Settings</h1>
            <Link to="/"><h1 className="text-center">LoginSignupHub</h1></Link>
            <button onClick={logout}>Logout</button>
        </div>
    )
}

export default Settings