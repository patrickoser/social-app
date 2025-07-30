import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, getDocs, where, setDoc, doc } from "firebase/firestore";
import { createContext, useState, useEffect } from "react";
import { db } from "../config/firebase";
import { createGuestUser, isGuestUser, cleanupGuestData, GUEST_KEYS } from "../utils/guestUtils";

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
                console.error('Error signing out:', error);
            }
        }
    };

    /* Need to go through this and comment out each section because I forget how it works. */
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
                        // Handle Google sign-in users who don't have a username yet
                        // Auto-assign username from Google display name
                        // Get username from Google display name, or email prefix, or default to 'user'
                        const googleUsername = currentUser.displayName || currentUser.email?.split('@')[0] || 'user';
                        // Clean the username to only allow letters, numbers, and underscores, then make lowercase
                        const cleanUsername = googleUsername.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
                        
                        // Check if this username is available, if not add a number
                        // Start with the cleaned username
                        let finalUsername = cleanUsername;
                        // Counter to add numbers if username is taken
                        let counter = 1;
                        // Keep trying until we find an available username
                        while (true) {
                            // Query to check if this username already exists
                            const usernameCheck = query(collection(db, 'usernames'), where('username', '==', finalUsername));
                            // Execute the username check query
                            const usernameSnapshot = await getDocs(usernameCheck);
                            // If no documents found, username is available
                            if (usernameSnapshot.empty) {
                                break; // Username is available
                            }
                            // If username is taken, add a number to the end
                            finalUsername = `${cleanUsername}${counter}`;
                            // Increment counter for next attempt
                            counter++;
                        }
                        
                        // Create username document for Google user
                        // Save the new username document to Firestore
                        await setDoc(doc(db, 'usernames', finalUsername), {
                            userId: currentUser.uid,
                            username: finalUsername,
                            email: currentUser.email,
                            createdAt: new Date().toISOString(),
                            isGoogleUser: true
                        });
                        
                        // Set the user state with the new username
                        setUser({
                            email: currentUser.email,
                            userId: currentUser.uid,
                            username: finalUsername
                        });
                    }
                } catch (err) {
                    // Log any errors that occur during the process
                    console.error(err)
                }
            } else {
                // If no current user, set user state to null (logged out)
                setUser(null)
            }
            // Set loading to false since auth check is complete
            setLoading(false)
        })

        // Return cleanup function that will run when useEffect unmounts
        return () => {
            // If unsubscribe function exists, call it to stop the auth listener
            if(unsubscribe) unsubscribe()
        } 

    }, [])

    // Guest mode comment: Set up cleanup on page unload for guest users
    // This useEffect runs when the user state changes
    useEffect(() => {
        // Function to handle page unload/refresh
        const handleBeforeUnload = () => {
            // Check if current user is a guest user
            if (isGuestUser(user)) {
                // Clean up all guest data from sessionStorage
                cleanupGuestData();
            }
        };

        // Add event listener for beforeunload event (page refresh/close)
        window.addEventListener('beforeunload', handleBeforeUnload);
        // Return cleanup function to remove the event listener
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