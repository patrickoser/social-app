import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Guest mode comment: Component to show guest mode warning to users
const GuestIndicator = () => {
    // Guest mode comment: Get guest status from auth context
    const { isGuest } = useContext(AuthContext);

    // Guest mode comment: Only show indicator if user is a guest
    if (!isGuest) return null;

    return (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-6 mx-auto max-w-2xl">
            <div className="flex items-center justify-center space-x-4">
                <div className="flex-shrink-0">
                    <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                <div className="text-center">
                    <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                        Guest Mode Active
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 leading-relaxed">
                        Your posts, likes, and saves will be deleted when you leave the site.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GuestIndicator; 