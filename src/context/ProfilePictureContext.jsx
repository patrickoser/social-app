import { createContext, useState, useContext } from "react";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";

export const ProfilePictureContext = createContext({});

export const ProfilePictureProvider = ({ children }) => {
    const [profilePictures, setProfilePictures] = useState({});
    const [loadingStates, setLoadingStates] = useState({});

    const getProfilePicture = async (userId) => {
        // Check if we already have this user's picture cached
        if (profilePictures[userId] !== undefined) {
            return profilePictures[userId];
        }

        // Check if we're already loading this user's picture
        if (loadingStates[userId]) {
            return null; // Return null while loading
        }

        // Set loading state for this user
        setLoadingStates(prev => ({
            ...prev,
            [userId]: true
        }));

        try {
            const userRef = ref(storage, `users/${userId}`);
            const res = await listAll(userRef);
            
            let url = "";
            if (res.items.length > 0) {
                url = await getDownloadURL(res.items[0]);
            }

            // Store in cache
            setProfilePictures(prev => ({
                ...prev,
                [userId]: url
            }));

            return url;
        } catch (err) {
            console.error("Error fetching profile picture:", err);
            
            // Store empty string in cache for error cases
            setProfilePictures(prev => ({
                ...prev,
                [userId]: ""
            }));

            return "";
        } finally {
            // Clear loading state
            setLoadingStates(prev => ({
                ...prev,
                [userId]: false
            }));
        }
    };

    const clearCache = () => {
        setProfilePictures({});
        setLoadingStates({});
    };

    return (
        <ProfilePictureContext.Provider value={{
            profilePictures,
            getProfilePicture,
            loadingStates,
            clearCache
        }}>
            {children}
        </ProfilePictureContext.Provider>
    );
};

// Custom hook for easier usage
export const useProfilePicture = () => {
    const context = useContext(ProfilePictureContext);
    if (!context) {
        throw new Error("useProfilePicture must be used within a ProfilePictureProvider");
    }
    return context;
};
