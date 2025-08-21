import React, { useContext, useState, useEffect } from "react";
import { DataContext } from "../context/DataContext";
import { AuthContext } from "../context/AuthContext";
import Feed from "../components/Feed";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import MobileNav from "../components/MobileNav";
import GuestIndicator from "../components/GuestIndicator";

const SavedPosts = () => {
    const { getSavedPosts } = useContext(DataContext);
    const { user } = useContext(AuthContext);
    const [savedPosts, setSavedPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadSavedPosts = async () => {
            setIsLoading(true);
            try {
                const posts = await getSavedPosts(user);
                setSavedPosts(posts);
            } catch (error) {
                console.error('Error loading saved posts:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            loadSavedPosts();
        }
    }, [user, getSavedPosts]);

    return (
        <>
            <main className="flex flex-col md:flex-row max-w-7xl mx-auto py-0 px-3">
                <LeftSidebar />
                <section className="flex-1 w-full md:w-6/12 mt-5 px-3 md:px-5 text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-t border-gray-300 dark:border-gray-700 pb-20 md:pb-0">
                    {/* Guest mode comment: Show guest indicator when in guest mode */}
                    <GuestIndicator />
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
                </section>
                <RightSidebar />
            </main>
            <MobileNav />
        </>
    );
};

export default SavedPosts;
