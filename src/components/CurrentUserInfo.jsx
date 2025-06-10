import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../config/firebase";

const CurrentUserInfo = () => {
    const { user } = useContext(AuthContext);
    const [url, setUrl] = useState("");

    const getImageUrl = async () => {
        const userRef = ref(storage, `users/${user.userId}`);
        try {
            const res = await listAll(userRef);
            if (res.items.length > 0) {
                const url = await getDownloadURL(res.items[0]);
                setUrl(url);
            } else {
                /* This should return a default pic. */
                return null;
            }
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if (user) {
            getImageUrl();
        }
    }, [user]);

    return (
        <div className="flex items-center gap-3 p-4 border-b">
            {/* Profile picture */}
            <img 
                src={url} 
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" 
                alt="profile-pic" 
            />
            {/* User details container */}
            <div className="flex flex-col">
                <span className="font-semibold text-gray-900">{user?.username}</span>
                <span className="text-sm text-gray-500">{user?.email}</span>
            </div>
        </div>
    )
}