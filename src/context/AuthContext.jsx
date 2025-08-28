import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, getDocs, where, setDoc, doc } from "firebase/firestore";
import { createContext, useState, useEffect } from "react";
import { db } from "../config/firebase";
import { createGuestUser, isGuestUser, cleanupGuestData, GUEST_KEYS } from "../utils/guestUtils";
import { logger } from "../utils/logger";

export const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const auth = getAuth()
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(true)

    /* Guest authentication functions - defined outside useEffect to ensure availability */
    const signInAsGuest = () => {
        const guestUser = createGuestUser();
        sessionStorage.setItem(GUEST_KEYS.IS_GUEST, 'true');
        setUser(guestUser);
    };

    /* Sign out guest and clean up their data */
    const signOutGuest = () => {
        cleanupGuestData();
        setUser(null);
    };

    /* Enhanced sign out that handles both guest and regular users */
    const signOut = async () => {
        if (isGuestUser(user)) {
            signOutGuest();
        } else {
            /* Regular Firebase sign out */
            try {
                await auth.signOut();
            } catch (error) {
                logger.error('Error signing out:', error);
            }
        }
    };

    /* Auth state listener */
    useEffect(() => {
        let unsubscribe;

        /* Check if user is a guest first before checking Firebase auth */
        const isGuest = sessionStorage.getItem(GUEST_KEYS.IS_GUEST);
        if (isGuest === 'true') {
            const guestUser = createGuestUser();
            setUser(guestUser);
            setLoading(false);
            return;
        }

        /* Assign the Firebase auth listener to the unsubscribe variable */
        unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const q = query(collection(db, 'usernames'), where('userId', '==', currentUser.uid))
                    const querySnapshot = await getDocs(q)
                    /* Check if the query returned any documents (user has a username) */
                    if (!querySnapshot.empty) {
                        /* Get the first (and should be only) document from the results */
                        const userDoc = querySnapshot.docs[0]
                        setUser({
                            email: currentUser.email,
                            userId: currentUser.uid,
                            username: userDoc.data().username
                        })
                    } else {
                        /* Get username from Google display name, or email prefix, or default to 'user' */
                        const googleUsername = currentUser.displayName || currentUser.email?.split('@')[0] || 'user';
                        /* Clean the username to only allow letters, numbers, and underscores, then make lowercase */
                        const cleanUsername = googleUsername.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
                        
                        /* Check if this username is available, if not add a number */
                        let finalUsername = cleanUsername;
                        let counter = 1;
                        while (true) {
                            /* Build a query to check if this username already exists */
                            const usernameCheck = query(collection(db, 'usernames'), where('username', '==', finalUsername));
                            /* Execute the username check query */
                            const usernameSnapshot = await getDocs(usernameCheck);
                            /* If no documents found, username is available */
                            if (usernameSnapshot.empty) {
                                break; /* Username is available, break out of the loop */
                            }
                            /* If username is taken, add a number to the end */
                            finalUsername = `${cleanUsername}${counter}`;
                            /* Increment counter for next attempt */
                            counter++;
                        }
                        
                        await setDoc(doc(db, 'usernames', finalUsername), {
                            userId: currentUser.uid,
                            username: finalUsername,
                            email: currentUser.email,
                            createdAt: new Date().toISOString(),
                        });
                        
                        setUser({
                            email: currentUser.email,
                            userId: currentUser.uid,
                            username: finalUsername
                        });
                    }
                } catch (err) {
                    logger.error('Error during auth state change:', err)
                }
            } else {
                /* If no current user, set user state to null (logged out) */
                setUser(null)
            }
            /* Set loading to false since auth check is complete */
            setLoading(false)
        })

        /* Return cleanup function that will run when useEffect unmounts */
        return () => {
            /* If unsubscribe function exists, call it to stop the auth listener */
            if(unsubscribe) unsubscribe()
        } 

    }, [])

    /* Set up cleanup on page unload for guest users */
    useEffect(() => {
        /* Function to handle page unload/refresh */
        const handleBeforeUnload = () => {
            /* Check if current user is a guest user */
            if (isGuestUser(user)) {
                /* Clean up all guest data from sessionStorage */
                cleanupGuestData();
            }
        };

        /* Add event listener for beforeunload event (page refresh/close) */
        window.addEventListener('beforeunload', handleBeforeUnload);
        /* Return cleanup function to remove the event listener */
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [user]);

    return (
        <AuthContext.Provider value={{
            user, 
            loading,
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