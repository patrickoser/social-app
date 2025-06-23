import React from "react";
import { Link } from "react-router-dom";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";

const Missing = () => {
    return (
        <main className="flex h-screen max-w-7xl mx-auto py-0 px-3">
            <LeftSidebar />
            <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Something went wrong.</h1>
                <h3 className="text-gray-700 dark:text-gray-300">
                    Return <Link to="/home" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">home</Link>
                </h3>
            </div>
            <RightSidebar />
        </main>
    )
}

export default Missing