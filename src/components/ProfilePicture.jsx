import React, { useState, useEffect } from "react";
import { useProfilePicture } from "../context/ProfilePictureContext";

const ProfilePicture = ({ 
    userId, 
    size = "md", 
    className = "",
    showLoading = true 
}) => {
    const { getProfilePicture, loadingStates } = useProfilePicture();
    const [imageUrl, setImageUrl] = useState(null);

    /* Size variants. */
    const sizeClasses = {
        xs: "w-6 h-6",
        sm: "w-8 h-8", 
        md: "w-12 h-12",
        lg: "w-16 h-16",
        xl: "w-24 h-24",
        "2xl": "w-32 h-32"
    };

    /* Default profile picture SVG sizes. */
    const svgSizes = {
        xs: "w-3 h-3",
        sm: "w-4 h-4",
        md: "w-6 h-6", 
        lg: "w-8 h-8",
        xl: "w-12 h-12",
        "2xl": "w-16 h-16"
    };

    /* Fetch profile picture. */
    useEffect(() => {
        if (!userId) return;

        const fetchImage = async () => {
            const url = await getProfilePicture(userId);
            setImageUrl(url);
        };

        fetchImage();
    }, [userId, getProfilePicture]);

    /* Default profile picture component. */
    const DefaultProfilePic = () => (
        <div className={`${sizeClasses[size]} rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center ${className}`}>
            <svg className={`${svgSizes[size]} text-gray-600 dark:text-gray-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        </div>
    );

    /* Loading state. */
    if (loadingStates[userId] && showLoading) {
        return (
            <div className={`${sizeClasses[size]} rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`} />
        );
    }

    /* Show image if available, otherwise show default. */
    if (imageUrl) {
        return (
            <img 
                src={imageUrl} 
                className={`${sizeClasses[size]} rounded-full object-cover border-2 border-gray-300 dark:border-gray-600 ${className}`}
                alt="profile-pic" 
            />
        );
    }

    return <DefaultProfilePic />;
};

export default ProfilePicture; 