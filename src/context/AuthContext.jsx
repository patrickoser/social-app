import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, getDocs, where } from "firebase/firestore";
import { createContext, useState, useEffect } from "react";
import { db } from "../config/firebase";

export const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const auth = getAuth()
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(true)

    /* Need to go through this and comment out each section because I forget how it works. */
    useEffect(() => {
        let unsubscribe;

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

    return (
        <AuthContext.Provider value={{
            user, loading
        }}>
            {!loading &&
                children
            }
        </AuthContext.Provider>
    )
}