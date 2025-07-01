import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../context/DataContext";
import { AuthContext } from "../context/AuthContext";
import Feed from "../components/Feed";

const SavedPosts = () => {
    const { getSavedPosts } = useContext(DataContext);
    const { user } = useContext(AuthContext);
    const [savedPosts, setSavedPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSavedPosts = async () => {
            setIsLoading(true);
            const posts = await getSavedPosts(user);
            setSavedPosts(posts);
            setIsLoading(false);
        };
        fetchSavedPosts();
    }, [user, getSavedPosts]);

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Saved Posts</h1>
            {isLoading ? (
                <div className="text-center text-gray-600 dark:text-gray-400">Loading...</div>
            ) : savedPosts.length === 0 ? (
                <div className="text-center text-gray-600 dark:text-gray-400">
                    <p>No saved posts yet.</p>
                    <p className="text-sm mt-2">Save posts you like to see them here!</p>
                </div>
            ) : (
                <Feed posts={savedPosts} />
            )}
        </div>
    );
};

export default SavedPosts;
