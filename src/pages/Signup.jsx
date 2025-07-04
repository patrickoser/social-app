import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider, db } from '../config/firebase'
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { addDoc, getDocs, collection, query, where, doc, setDoc } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";

const Signup = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { user, loading: authLoading } = useContext(AuthContext)
    const navigate = useNavigate()

    // Redirect if already logged in
    useEffect(() => {
        if (user && !authLoading) {
            navigate('/home')
        }
    }, [user, authLoading, navigate])

    /* Reference the usernames collection. */
    const usernamesRef = collection(db, "usernames")

    /* Queryusernames collection searching for a username in the usernames collection
    that matches the username given in the signup form. If an identical username is 
    found then isUsernameAvailable returns true, otherwise null. */
    const isUsernameAvailable = async (username) => {
        const usernamesQuery = query(usernamesRef, where("username", "==", username))
        const querySnapshot = await getDocs(usernamesQuery)
        return querySnapshot.empty
    }

    /* Creates a new account as long as 'isAvailable' is false. */
    const handleSignup = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        
        // Check if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            setLoading(false)
            return
        }
        
        const isAvailable = await isUsernameAvailable(username)
        if (isAvailable) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password)
                const user = userCredential.user
                /* Add the user to the usernames collection. */
                await setDoc(doc(db, 'usernames', username), { 
                    userId: user.uid,
                    username: username,
                    email: email,
                    createdAt: new Date().toISOString() // Optional: add timestamp
                })
                /* Add the user to the usernames collection. */
                console.log(`User Status: ${auth?.currentUser?.email} has created an account and signed in.`)
                setPassword('')
                setEmail('')
                setUsername('')
                setConfirmPassword('')
                // Don't navigate here - let useEffect handle it when user state updates
            } catch (err) {
                console.error(err)
                setError('Failed to create account. Please try again.')
                setLoading(false)
            }
        } else {
            setError('Username is already taken.')
            setLoading(false)
        }
    }

    /* Signs you in with a google account. */
    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider)
        } catch (err) {
            console.error(err)
            setError('Failed to sign in with Google. Please try again.')
        }
    }

    // Show loading if auth is still being determined
    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-800">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
            </div>
        )
    }

    return (
        <main className="flex flex-col justify-center px-6 py-12 lg:px-8 bg-white dark:bg-gray-800">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">Not signed up yet?</h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSignup} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Username:</label>
                        <div>
                            <input 
                                type="username"
                                placeholder="Enter username..."
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                                required
                                disabled={loading}
                                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Email address:</label>
                        <div>
                            <input 
                                type="email"
                                placeholder="Enter email..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                required
                                disabled={loading}
                                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Password:</label>
                        <div className="mt-2">
                            <input 
                                type="password"
                                placeholder="Enter password..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                required
                                disabled={loading}
                                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Confirm password:</label>
                        <div className="mt-2">
                            <input 
                                type="password"
                                placeholder="Confirm password..."
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                autoComplete="new-password"
                                required
                                disabled={loading}
                                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>
                    <div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="flex w-full justify-center rounded-md bg-indigo-600 dark:bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 dark:hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </div>
                </form>
                <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
                    Already have an account?&nbsp;
                    <Link to="/login"><button className="font-semibold leading-6 text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">Login here!</button></Link>
                </p>
                <div className="flex w-full items-center gap-2 py-6 text-sm text-slate-600">
                    <div className="h-px w-full bg-slate-200 dark:bg-slate-600"></div>
                    <p className="text-gray-900 dark:text-white">Or</p>
                    <div className="h-px w-full bg-slate-200 dark:bg-slate-600"></div>
                </div>
                <div className="inline-flex h-10 w-full items-center justify-center gap-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-gray-700 p-2 text-sm font-medium text-black dark:text-white">
                    <button onClick={signInWithGoogle}>Sign in with Google</button>
                </div>
            </div>
        </main>
    )
}

export default Signup