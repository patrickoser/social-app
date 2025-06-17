import React from "react";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { DataContext } from "../context/DataContext";
import { useContext } from "react";
import Nav from "../components/Nav";
import CurrentUserInfo from "../components/CurrentUserInfo";

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
            <div id="left-sidebar" className="w-3/12 min-w-60 mt-5 px-5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <Nav />
            </div>
            <div id="main-content-settings" className="flex-initial w-6/12 mt-5 px-5 text-center border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <h1 className="text-center text-2xl font-bold mb-6 text-gray-900 dark:text-white">Settings</h1>
                <button 
                    onClick={logout} 
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
                >Logout</button>
            </div>
            <div id="right-sidebar" className="w-3/12 min-w-60 mt-5 px-5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <CurrentUserInfo />
            </div>
        </main>
    )
}

export default Settings