import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, getDocs, where } from "firebase/firestore";
import { createContext, useState, useEffect } from "react";
import { db } from "../config/firebase";
// Guest mode comment: Import guest utilities for guest authentication
import { createGuestUser, isGuestUser, cleanupGuestData, GUEST_KEYS } from "../utils/guestUtils";

export const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const auth = getAuth()
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(true)

    /* Need to go through this and comment out each section because I forget how it works. */
    useEffect(() => {
        let unsubscribe;

        // Guest mode comment: Check if user is a guest first before checking Firebase auth
        const isGuest = sessionStorage.getItem(GUEST_KEYS.IS_GUEST);
        if (isGuest === 'true') {
            const guestUser = createGuestUser();
            setUser(guestUser);
            setLoading(false);
            return;
        }

        unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const q = query(collection(db, 'usernames'), where('userId', '==', currentUser.uid))
                    const querySnapshot = await getDocs(q)
                    if (!querySnapshot.empty) {
                        const userDoc = querySnapshot.docs[0]
                        setUser({
                            email: currentUser.email,
                            userId: currentUser.uid,
                            username: userDoc.data().username
                        })
                    }
                } catch (err) {
                    console.error(err)
                }
            } else {
                setUser(null)
            }
            setLoading(false)
        })

        return () => {
            if(unsubscribe) unsubscribe()
        } 

    }, [])

    // Guest mode comment: Guest authentication functions
    const signInAsGuest = () => {
        const guestUser = createGuestUser();
        sessionStorage.setItem(GUEST_KEYS.IS_GUEST, 'true');
        setUser(guestUser);
    };

    // Guest mode comment: Sign out guest and clean up their data
    const signOutGuest = () => {
        cleanupGuestData();
        setUser(null);
    };

    // Guest mode comment: Enhanced sign out that handles both guest and regular users
    const signOut = async () => {
        if (isGuestUser(user)) {
            signOutGuest();
        } else {
            // Regular Firebase sign out
            try {
                await auth.signOut();
            } catch (error) {
                console.error('Error signing out:', error);
            }
        }
    };

    // Guest mode comment: Set up cleanup on page unload for guest users
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (isGuestUser(user)) {
                cleanupGuestData();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [user]);

    return (
        <AuthContext.Provider value={{
            user, 
            loading,
            // Guest mode comment: Expose guest authentication functions
            signInAsGuest,
            signOutGuest,
            signOut,
            isGuest: isGuestUser(user)
        }}>
            {!loading &&
                children
            }
        </AuthContext.Provider>
    )
}