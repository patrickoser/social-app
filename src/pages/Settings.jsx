import React from "react";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import DataContext from "../context/DataContext";
import { useContext } from "react";
import Nav from "../components/Nav";

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
        <main className="flex h-screen max-w-7xl mx-auto py-0 px-3">
            <div id="left-sidebar" className="flex-auto min-w-60 mt-5 px-5 border">
                <Nav />
            </div>
            <div id="main-content-settings" className="max-w-full flex-auto min-w-60 border-b border-black text-left">
                <h1 className="text-center">Settings</h1>
                <button onClick={logout}>Logout</button>
            </div>
            <div id="right-sidebar" className="flex-auto min-w-60 mt-5 px-5 border"></div>
        </main>
    )
}

export default Settings