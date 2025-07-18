import React, { useContext } from "react";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { DataContext } from "../context/DataContext";
import { AuthContext } from "../context/AuthContext";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import MobileNav from "../components/MobileNav";
// Guest mode comment: Guest indicator component for showing guest status
import GuestIndicator from "../components/GuestIndicator";
// Guest mode comment: Utility function to check if user is a guest
import { isGuestUser } from "../utils/guestUtils";

const Settings = () => {
    /* Might not need to import context as it could be costly w/o
    useMemo. Might be better to define Navigate component in 
    here directly. */
    const { navigate } = useContext(DataContext)
    // Guest mode comment: Added guest-specific auth functions
    const { user, signOutGuest, isGuest } = useContext(AuthContext)

    const logout = async () => {
        // Guest mode comment: Handle guest logout differently than regular logout
        if (isGuestUser(user)) {
            console.log(`Guest user has signed out.`)
            signOutGuest();
            navigate('/login');
        } else {
            console.log(`User Status: ${auth?.currentUser?.email} has signed out.`)
            try {
                await signOut(auth)
                navigate('/login')
            } catch (err) {
                console.error(err)
            }
        }
    }

    // Guest mode comment: Handle creating account from guest mode
    const handleCreateAccount = () => {
        // Guest mode comment: Log out of guest mode before navigating to signup
        if (isGuestUser(user)) {
            signOutGuest();
        }
        navigate('/signup');
    };

    return (
        <>
            <main className="flex flex-col md:flex-row max-w-7xl mx-auto py-0 px-3">
                <LeftSidebar />
                <section className="flex-1 w-full md:w-6/12 mt-5 px-3 md:px-5 pt-3 text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-t border-b border-gray-300 dark:border-gray-700 pb-20 md:pb-3">
                    {/* Guest mode comment: Show guest indicator when in guest mode */}
                    <GuestIndicator />
                    <h1 className="text-center text-2xl font-bold mb-6 text-gray-900 dark:text-white">Settings</h1>
                    
                    {/* Guest mode comment: Show special messaging and create account button for guests */}
                    {isGuest ? (
                        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                                You're currently in guest mode. Create a real account to save your data permanently.
                            </p>
                            <button 
                                onClick={handleCreateAccount}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 mr-2"
                            >
                                Create Account
                            </button>
                        </div>
                    ) : null}
                    
                    <button 
                        onClick={logout} 
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600"
                    >
                        {/* Guest mode comment: Show different button text for guests */}
                        {isGuest ? 'Exit Guest Mode' : 'Logout'}
                    </button>
                </section>
                <RightSidebar />
            </main>
            <MobileNav />
        </>
    )
}

export default Settings