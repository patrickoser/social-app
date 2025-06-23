import React from "react";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { DataContext } from "../context/DataContext";
import { useContext } from "react";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";

const Settings = () => {
    /* Might not need to import context as it could be costly w/o
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
            <LeftSidebar />
            <section id="main-content-settings" className="flex-initial w-6/12 mt-5 px-5 text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <h1 className="text-center text-2xl font-bold mb-6 text-gray-900 dark:text-white">Settings</h1>
                <button 
                    onClick={logout} 
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700"
                >Logout</button>
            </section>
            <RightSidebar />
        </main>
    )
}

export default Settings