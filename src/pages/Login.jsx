import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
    // Add a feature that checks local storage to see if they
    // already have an account before redirecting to Signup

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { user, loading: authLoading, signInAsGuest } = useContext(AuthContext)
    const navigate = useNavigate()

    // Redirect if already logged in
    useEffect(() => {
        if (user && !authLoading) {
            navigate('/home')
        }
    }, [user, authLoading, navigate])

    const handleSignIn = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        
        try {
            await signInWithEmailAndPassword(auth, email, password)
            console.log(`User Status: ${auth?.currentUser?.email} has signed in.`)
            setEmail('')
            setPassword('')
            // Don't navigate here - let useEffect handle it when user state updates
        } catch (err) {
            console.error(err)
            setError('Invalid email or password. Please try again.')
            setLoading(false)
        }
    }

    const handleGuestSignIn = () => {
        signInAsGuest();
        // Navigation will be handled by useEffect when user state updates
    };

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
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">Sign in to your account.</h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSignIn} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Email Address</label>
                        <div className="mt-2">
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter email..."
                                value={email}
                                autoComplete="email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Password</label>
                            <div className="text-sm">
                                <a href="#" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">Forgot password?</a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter password..."
                                value={password}
                                autoComplete="current-password"
                                onChange={(e) => setPassword(e.target.value)}
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
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>
                </form>

                {/* Guest Sign In Section */}
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">Or</span>
                        </div>
                    </div>
                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={handleGuestSignIn}
                            className="flex w-full justify-center rounded-md bg-gray-100 dark:bg-gray-700 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 dark:text-white shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                        >
                            Try as Guest
                        </button>
                        <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
                            Explore the app without creating an account. Your data will be deleted when you leave.
                        </p>
                    </div>
                </div>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Don't have an account?&nbsp;
                    <Link to="/signup"><button className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Signup here!</button></Link>
                </p>
            </div>
        </main>
    )
}

export default Login