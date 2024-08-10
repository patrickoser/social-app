import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from '../config/firebase'
import { createUserWithEmailAndPassword } from "firebase/auth";

const Signup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // 'confirmPassword' is likely not needed when interacting with firebase. I probably
    // only need to check that it match password in the frontend and once that check
    // is complete it can be discarded.
    const [confirmPassword, setConfirmPassword] = useState('')
    const navigate = useNavigate()

    const handleSignup = async (e) => {
        e.preventDefault()
        console.log("Signup email: ", email, "password: ", password, "confirm password: ", confirmPassword)
        try {
            await createUserWithEmailAndPassword(auth, email, password)
            console.log(`User Status: ${auth?.currentUser?.email} has created an account and signed in.`)
            setPassword('')
            setEmail('')
            navigate('/home')
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <main className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Not signed up yet?</h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSignup} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                        <div>
                            <input 
                                type="email"
                                placeholder="Enter email..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                required
                                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                        <div className="mt-2">
                            <input 
                                type="password"
                                placeholder="Enter password..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                required
                                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Confirm password</label>
                        <div className="mt-2">
                            <input 
                                type="password"
                                placeholder="Confirm password..."
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                autoComplete="new-password"
                                required
                                className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Create Account</button>
                    </div>
                    <p className="mt-10 text-center text-sm text-gray-500">
                        Already have an account?&nbsp;
                        <Link to="/login"><button className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Login here!</button></Link>
                    </p>
                    <div className="flex w-full items-center gap-2 py-6 text-sm text-slate-600">
                        <div className="h-px w-full bg-slate-200"></div>
                        <p>Or</p>
                        <div className="h-px w-full bg-slate-200"></div>
                    </div>
                </form>
            </div>
        </main>
    )
}

export default Signup