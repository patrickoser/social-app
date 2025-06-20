import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider, db } from '../config/firebase'
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { addDoc, getDocs, collection, query, where, doc, setDoc } from "firebase/firestore";

const Signup = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')

    /* 'confirmPassword' is likely not needed when interacting with firebase. I probably
    only need to check that it match password in the frontend and once that check
    is complete it can be discarded. */
    const [confirmPassword, setConfirmPassword] = useState('')
    const navigate = useNavigate()

    /* Reference the usernames collection. */
    const usernamesRef = collection(db, "usernames")

    /* Queryusernames collection searching for a username in the usernames collection
    that matches the username given in the signup form. If an identical username is 
    found then isUsernameAvailable returns true, otherwise null. */
    const isUsernameAvailable = async (username) => {
        /* const usernameDocRef = doc(db, 'usernames', username.toLowerCase())
        const usernameDoc = await getDoc(usernameDocRef) */
        const usernamesQuery = query(usernamesRef, where("username", "==", username))
        const querySnapshot = await getDocs(usernamesQuery)

        return querySnapshot.empty
    }

    /* Creates a new account as long as 'isAvailable' is false. */
    const handleSignup = async (e) => {
        e.preventDefault()
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
                navigate('/home')
                return user
            } catch (err) {
                console.error(err)
            }
        } else {
            console.log('Username is taken.')
        }
    }

    /* Signs you in with a google account. */
    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <main className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-white dark:bg-gray-800">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">Not signed up yet?</h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSignup} className="space-y-6">
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
                                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white bg-white dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 dark:bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 dark:hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Create Account</button>
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