import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../config/firebase";

const Nav = () => {
    const { user, loading } = useContext(AuthContext)
    const [url, setUrl] = useState("")

    const getImageUrl = async () => {
        const userRef = ref(storage, `users/${user.userId}`)

        try {
            const res = await listAll(userRef)
            if (res.items.length > 0) {
                const url = await getDownloadURL(res.items[0])
                setUrl(url)
            } else {
                /* This should return a default pic. */
                return null
            }
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        if (user) {
            getImageUrl()
        }
    }, [user])

    return (
        <div className="flex h-screen">
            <nav className="flex flex-col h-full relative">
                <ul className="flex flex-col">
                    <li><Link to="/profile">Profile</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                    <li><Link to="/settings">Settings</Link></li>
                </ul>
                {/* Pin this current user info to the bottom of the left margin.
                Should be in a fixed position like the one on twitter. Add loading
                to account for when username is loading and a default for if no
                username can be found. */}
                <div className="absolute bottom-0 inset-x-0 w-full px-4">
                    <img src={url} className="w-14 h-14 rounded-full" alt="profile-pic" />
                    <div id="username">{user.username}</div>
                </div>
            </nav>
        </div>
    )
}

export default Nav