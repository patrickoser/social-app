import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ProfilePicture from "./ProfilePicture";

const CurrentUserInfo = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="flex items-center gap-3 p-4 border-y border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
            {/* Profile picture */}
            <ProfilePicture userId={user?.userId} size="md" />
            
            {/* User details container */}
            <div className="flex flex-col">
                <span className="font-semibold text-gray-900 dark:text-white">{user?.username}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</span>
            </div>
        </div>
    )
}

export default CurrentUserInfo;