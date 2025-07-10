import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const GuestIndicator = () => {
    const { isGuest } = useContext(AuthContext);

    if (!isGuest) return null;

    return (
        <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Guest Mode
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                        Your posts, likes, and saves will be deleted when you leave the site.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GuestIndicator; 