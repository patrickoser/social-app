import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider, db } from '../config/firebase'
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { getDocs, collection, query, where, doc, setDoc } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";

const Signup = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [usernameStatus, setUsernameStatus] = useState('')
    const { user, loading: authLoading, signInAsGuest } = useContext(AuthContext)
    const navigate = useNavigate()

    /* Username validation function */
    const validateUsername = (username) => {
        if (!username) {
            setUsernameError('')
            setUsernameStatus('')
            return false
        }
        
        /* Length: 3-20 characters */
        if (username.length < 3) {
            setUsernameError('Username must be at least 3 characters long.')
            setUsernameStatus('')
            return false
        }
        
        if (username.length > 20) {
            setUsernameError('Username must be less than 20 characters.')
            setUsernameStatus('')
            return false
        }
        
        /* Characters: letters, numbers, underscores, hyphens only */
        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            setUsernameError('Username can only contain letters, numbers, underscores, and hyphens.')
            setUsernameStatus('')
            return false
        }
        
        /* No consecutive special characters */
        if (/[_-]{2,}/.test(username)) {
            setUsernameError('Username cannot have consecutive underscores or hyphens.')
            setUsernameStatus('')
            return false
        }
        
        /* Cannot start or end with special characters */
        if (/^[_-]|[_-]$/.test(username)) {
            setUsernameError('Username cannot start or end with underscore or hyphen.')
            setUsernameStatus('')
            return false
        }
        
        /* Reserved words check */
        const reservedWords = [
            'admin', 'root', 'system', 'user', 'guest', 'test', 'demo',
            'support', 'help', 'info', 'contact', 'about', 'login', 'signup',
            'api', 'www', 'mail', 'ftp', 'localhost', 'null', 'undefined'
        ]
        
        if (reservedWords.includes(username.toLowerCase())) {
            setUsernameError('This username is reserved and cannot be used.')
            setUsernameStatus('')
            return false
        }
        
        /* No profanity or inappropriate words (basic check) */
        const inappropriateWords = ['fuck', 'shit', 'ass', 'bitch', 'dick', 'pussy']
        if (inappropriateWords.some(word => username.toLowerCase().includes(word))) {
            setUsernameError('Username contains inappropriate content.')
            setUsernameStatus('')
            return false
        }
        
        setUsernameError('')
        return true
    }

    /* Email validation function */
    const validateEmail = (email) => {
        /* Basic email format validation */
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        
        if (!email) {
            setEmailError('')
            return false
        }
        
        if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email address.')
            return false
        }
        
        /* Block common disposable email domains */
        const disposableDomains = [
            'tempmail.com', '10minutemail.com', 'guerrillamail.com', 
            'mailinator.com', 'yopmail.com', 'throwaway.com', 'temp-mail.org',
            'sharklasers.com', 'guerrillamailblock.com', 'pokemail.net',
            'spam4.me', 'bccto.me', 'chacuo.net', 'dispostable.com'
        ]
        
        const emailDomain = email.split('@')[1]?.toLowerCase()
        if (disposableDomains.includes(emailDomain)) {
            setEmailError('Please use a valid email address (disposable emails not allowed).')
            return false
        }
        
        setEmailError('')
        return true
    }

    /* Password validation function */
    const validatePassword = (password) => {
        if (!password) {
            setPasswordError('')
            return false
        }
        
        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters long.')
            return false
        }
        
        /* More password strength requirements */
        const hasUpperCase = /[A-Z]/.test(password)
        const hasLowerCase = /[a-z]/.test(password)
        const hasNumbers = /\d/.test(password)
        
        if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
            setPasswordError('Password must contain uppercase, lowercase, and numbers.')
            return false
        }
        
        setPasswordError('')
        return true
    }

    /* Confirm password validation function */
    const validateConfirmPassword = (confirmPassword) => {
        if (!confirmPassword) {
            setConfirmPasswordError('')
            return false
        }
        
        if (confirmPassword !== password) {
            setConfirmPasswordError('Passwords do not match.')
            return false
        }
        
        setConfirmPasswordError('')
        return true
    }

    /* Debounced username availability check */
    const debouncedUsernameCheck = (() => {
        let timeoutId
        return (username) => {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(async () => {
                if (username && validateUsername(username)) {
                    setIsCheckingUsername(true)
                    setUsernameStatus('') // Clear status while checking
                    try {
                        const isAvailable = await isUsernameAvailable(username)
                        if (!isAvailable) {
                            setUsernameError('Username is already taken.')
                            setUsernameStatus('taken')
                        } else {
                            setUsernameError('')
                            setUsernameStatus('available')
                        }
                    } catch (error) {
                        console.error('Error checking username availability:', error)
                    } finally {
                        setIsCheckingUsername(false)
                    }
                }
            }, 500) // Wait 500ms after user stops typing
        }
    })()

    const handleEmailChange = (e) => {
        const value = e.target.value
        setEmail(value)
        validateEmail(value)
    }

    const handlePasswordChange = (e) => {
        const value = e.target.value
        setPassword(value)
        validatePassword(value)
        /* Re-validate confirm password when password changes */
        if (confirmPassword) {
            validateConfirmPassword(confirmPassword)
        }
    }

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value
        setConfirmPassword(value)
        validateConfirmPassword(value)
    }

    const handleUsernameChange = (e) => {
        const value = e.target.value
        setUsername(value)
        validateUsername(value)
        debouncedUsernameCheck(value)
    }

    /* Redirect if already logged in */
    useEffect(() => {
        if (user && !authLoading) {
            navigate('/home')
        }
    }, [user, authLoading, navigate])

    /* Reference the usernames collection. */
    const usernamesRef = collection(db, "usernames")

    /* Query usernames collection searching for a username in the usernames collection
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
        
        // Validate email before proceeding
        if (!validateEmail(email)) {
            setError('Please fix the email validation errors.')
            setLoading(false)
            return
        }
        
        // Validate password before proceeding
        if (!validatePassword(password)) {
            setError('Please fix the password validation errors.')
            setLoading(false)
            return
        }
        
        // Check if passwords match
        if (!validateConfirmPassword(confirmPassword)) {
            setError('Please fix the password validation errors.')
            setLoading(false)
            return
        }
        
        // Validate username before proceeding
        if (!validateUsername(username)) {
            setError('Please fix the username validation errors.')
            setLoading(false)
            return
        }

        // Check if username is available
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

    // Guest mode comment: Handle guest sign in without creating account
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
                                onChange={handleUsernameChange}
                                autoComplete="username"
                                required
                                disabled={loading}
                                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            {usernameError && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {usernameError}
                                </p>
                            )}
                            {isCheckingUsername && !usernameError && (
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                    <svg className="animate-spin w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Checking availability...
                                </p>
                            )}
                            {usernameStatus === 'available' && (
                                <p className="mt-1 text-xs text-green-600 dark:text-green-400 flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Username available!
                                </p>
                            )}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Email address:</label>
                        <div>
                            <input 
                                type="email"
                                placeholder="Enter email..."
                                value={email}
                                onChange={handleEmailChange}
                                autoComplete="email"
                                required
                                disabled={loading}
                                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            {emailError && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{emailError}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Password:</label>
                        <div className="mt-2">
                            <input 
                                type="password"
                                placeholder="Enter password..."
                                value={password}
                                onChange={handlePasswordChange}
                                autoComplete="new-password"
                                required
                                disabled={loading}
                                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            {passwordError && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{passwordError}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Confirm password:</label>
                        <div className="mt-2">
                            <input 
                                type="password"
                                placeholder="Confirm password..."
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                autoComplete="new-password"
                                required
                                disabled={loading}
                                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            {confirmPasswordError && (
                                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{confirmPasswordError}</p>
                            )}
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

                {/* Guest mode comment: Guest Sign In Section */}
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