import React, { useContext, useState } from "react";
import { Link } from 'react-router-dom'
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { DataContext } from "../context/DataContext";

const Login = () => {
    // Add a feature that checks local storage to see if they
    // already have an account before redirecting to Signup

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { navigate } = useContext(DataContext)

    const handleSignIn = async (e) => {
        e.preventDefault()
        try {
            await signInWithEmailAndPassword(auth, email, password)
            console.log(`User Status: ${auth?.currentUser?.email} has signed in.`)
            setEmail('')
            setPassword('')
            navigate('/home')
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <main className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-white dark:bg-gray-800">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">Sign in to your account.</h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSignIn} className="space-y-6">
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
                                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 dark:bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 dark:hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign In</button>
                    </div>
                </form>
                <p className="mt-10 text-center text-sm text-gray-500">
                    Don't have an account?&nbsp;
                    <Link to="/signup"><button className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Signup here!</button></Link>
                </p>
            </div>
        </main>
    )
}

export default Login