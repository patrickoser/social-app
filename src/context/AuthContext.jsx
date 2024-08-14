import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createContext, useState, useEffect } from "react";

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const auth = getAuth()
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let unsubscribe;
        unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setLoading(false)
            currentUser ? setUser(currentUser) : setUser(null)
        })
    }, [])
    return (
        <AuthContext.Provider value={{}}>
            {children}
        </AuthContext.Provider>
    )
}