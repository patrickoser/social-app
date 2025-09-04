import { createContext, useState, useContext } from "react";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";
import { logger } from "../utils/logger";

export const ProfilePictureContext = createContext({});

export const ProfilePictureProvider = ({ children }) => {
    const [profilePictures, setProfilePictures] = useState({});
    const [loadingStates, setLoadingStates] = useState({});

    const getProfilePicture = async (userId) => {
        /* Check if we already have this user's picture cached */
        if (profilePictures[userId] !== undefined) {
            return profilePictures[userId];
        }

        /* Check if we're already loading this user's picture */
        if (loadingStates[userId]) {
            return null; /* Return null while loading */
        }

        /* Set loading state for this user. This is to prevent multiple requests for the same user. */
        setLoadingStates(prev => ({
            ...prev,
            [userId]: true
        }));

        try {
            /* Point to this user's folder in Firebase Storage.
            List all items in this user's folder */
            const userRef = ref(storage, `users/${userId}`);
            const res = await listAll(userRef);

            /* If there are any items, get the first one's URL */
            let url = "";
            if (res.items.length > 0) {
                url = await getDownloadURL(res.items[0]);
            }

            /* Store in cache */
            setProfilePictures(prev => ({
                ...prev,
                [userId]: url
            }));

            return url;
        } catch (err) {
            logger.error("Error fetching profile picture:", err);
            
            /* For permission errors or any other errors, store empty string.
            This prevents repeated failed requests for the same user. */
            setProfilePictures(prev => ({
                ...prev,
                [userId]: ""
            }));

            return "";
        } finally {
            /* Set loading state to false. */
            setLoadingStates(prev => ({
                ...prev,
                [userId]: false
            }));
        }
    };

    const refreshProfilePicture = async (userId) => {
        /* Remove the cached image for this user to force a fresh fetch */
        setProfilePictures(prev => {
            const newState = { ...prev };
            delete newState[userId];
            return newState;
        });

        /* Also clear any loading state */
        setLoadingStates(prev => {
            const newState = { ...prev };
            delete newState[userId];
            return newState;
        });

        /* Fetch the updated profile picture */
        return await getProfilePicture(userId);
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
            clearCache,
            refreshProfilePicture
        }}>
            {children}
        </ProfilePictureContext.Provider>
    );
};

/* Custom hook that wraps useContext for better error handling. 
   Throws a clear error if used outside ProfilePictureProvider scope. */
export const useProfilePicture = () => {
    const context = useContext(ProfilePictureContext);
    if (!context) {
        throw new Error("useProfilePicture must be used within a ProfilePictureProvider");
    }
    return context;
};
