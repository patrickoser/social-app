import React from "react";
import { Link } from "react-router-dom";
import Home from "./Home";

const Missing = () => {
    return (
        <div className="flex h-screen max-w-7xl mx-auto py-0 px-3">
            <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Page Not Found</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
                <Link 
                    to="/home" 
                    className="px-6 py-3 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                    Return to Home
                </Link>
            </div>
        </div>
    )
}

export default Missing