import React from "react";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import DataContext from "../context/DataContext";
import { useContext } from "react";

const Settings = () => {
    /* Might not need to import context as it could be costll w/o
    useMemo. Might be better to define Navigate component in 
    here directly. */
    const { navigate } = useContext(DataContext)

    const logout = async () => {
        console.log(`User Status: ${auth?.currentUser?.email} has signed out.`)
        try {
            await signOut(auth)
            navigate('/signup')
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div>
            <h1 className="text-center">Settings</h1>
            <button onClick={logout}>Logout</button>
        </div>
    )
}

export default Settings