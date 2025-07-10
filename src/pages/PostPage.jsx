import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { DataContext } from "../context/DataContext";
import { AuthContext } from "../context/AuthContext";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import MobileNav from "../components/MobileNav";
// Guest mode comment: Guest indicator component for showing guest status
import GuestIndicator from "../components/GuestIndicator";
import ProfilePicture from "../components/ProfilePicture";
// Guest mode comment: Import guest utilities for guest data handling
import { isGuestUser, getGuestData, GUEST_KEYS } from "../utils/guestUtils";

const PostPage = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const { hasUserLiked, addLike, removeLike, deletePost } = useContext(DataContext);
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            setIsLoading(true);
            try {
                // Guest mode comment: Check guest posts first before Firebase
                if (isGuestUser(user)) {
                    const guestPosts = getGuestData(GUEST_KEYS.POSTS);
                    const guestPost = guestPosts.find(p => p.id === id);
                    
                    if (guestPost) {
                        setPost(guestPost);
                        setIsLoading(false);
                        return;
                    }
                }
                
                // Fetch from Firebase
                const postsRef = collection(db, "posts");
                const q = query(postsRef, where("__name__", "==", id));
                const querySnapshot = await getDocs(q);
                
                if (!querySnapshot.empty) {
                    const postData = { ...querySnapshot.docs[0].data(), id: querySnapshot.docs[0].id };
                    setPost(postData);
                }
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchPost();
        }
    }, [id, user]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-800">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-800">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Post Not Found</h1>
                    <p className="text-gray-600 dark:text-gray-400">The post you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <main className="flex flex-col md:flex-row max-w-7xl mx-auto py-0 px-3">
                <LeftSidebar />
                <section className="flex-1 w-full md:w-6/12 mt-5 px-3 md:px-5 text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-t border-b border-gray-300 dark:border-gray-700 pb-5 md:pb-0">
                    {/* Guest mode comment: Show guest indicator when in guest mode */}
                    <GuestIndicator />
                    <div className="max-w-full text-left p-4">
                        <div className="flex items-center space-x-3">
                            <ProfilePicture userId={post?.userId} size="lg" />
                            <div className="flex flex-col">
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{post?.username}</h1>
                                <h2 className="text-xs text-gray-500 dark:text-gray-400">{post?.datetime}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="p-4">
                        <p className="text-gray-800 dark:text-gray-200 text-left">{post?.content}</p>
                    </div>
                    <div className="flex justify-end items-center px-4 pb-4">
                        <button 
                            onClick={hasUserLiked(post, user) ? () => removeLike(id, user) : () => addLike(id, user)} 
                            className="px-4 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mr-2"
                        >Like</button>
                        {post?.likes && <span className="text-base text-gray-600 dark:text-gray-300 mr-4"> {post.likes.length} </span>}
                        {post?.username === user?.username && (
                            <button 
                                onClick={() => deletePost(post?.id)} 
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600"
                            >Delete</button>
                        )}
                    </div>
                </section>
                <RightSidebar />
            </main>
            <MobileNav />
        </>
    );
}

export default PostPage