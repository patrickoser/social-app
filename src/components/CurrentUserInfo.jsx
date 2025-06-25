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
                setUrl(""); // Set empty string to trigger default image
            }
        } catch (err) {
            console.error(err);
            setUrl(""); // Set empty string on error to trigger default image
        }
    }

    useEffect(() => {
        if (user) {
            getImageUrl();
        }
    }, [user]);

    // Default profile picture component
    const DefaultProfilePic = () => (
        <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        </div>
    );

    return (
        <div className="flex items-center gap-3 p-4 border-y border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            {/* Profile picture */}
            {url ? (
                <img 
                    src={url} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600" 
                    alt="profile-pic" 
                />
            ) : (
                <DefaultProfilePic />
            )}
            {/* User details container */}
            <div className="flex flex-col">
                <span className="font-semibold text-gray-900 dark:text-white">{user?.username}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</span>
            </div>
        </div>
    )
}

export default CurrentUserInfo;