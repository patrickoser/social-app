import React, { useContext, useEffect } from "react";
import { DataContext } from "../context/DataContext";
import { AuthContext } from "../context/AuthContext";
import { useParams } from "react-router-dom"
import Nav from "../components/Nav";
import CurrentUserInfo from "../components/CurrentUserInfo";

const PostPage = () => {
    // Original: Only DataContext for posts
    // Changed to: Add AuthContext and like functions
    const { posts, deletePost, postIsLoading, likes, getLikes, addLike, removeLike, hasUserLiked } = useContext(DataContext)
    const { user } = useContext(AuthContext)
    const { id } = useParams()
    const post = posts.find(post => (post.id).toString() === id)

    // Original: No useEffect
    // Changed to: Add useEffect to load likes
    useEffect(() => {
        getLikes(id)
    }, [id, user?.userId])

    return (
        <div>
            {postIsLoading ? (
                <h1 className="text-center text-gray-900 dark:text-white">Loading...</h1>
            ) : (    
                <main className="flex h-screen max-w-7xl mx-auto py-0 px-3">
                    <section id="left-sidebar" className="w-3/12 min-w-60 mt-5 px-5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <Nav />
                    </section>
                    <section id="main-content-post" className="flex-initial w-6/12 mt-5 px-5 text-center border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                        <div className="max-w-full text-left p-4">
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{post?.username}</h1>
                            <h2 className="text-xs text-gray-500 dark:text-gray-400">{post?.datetime}</h2>
                        </div>
                        <div className="p-4">
                            <p className="mt-4 text-gray-800 dark:text-gray-200 text-left">{post?.content}</p>
                        </div>
                        {/* Original: Only delete button */}
                        {/* Changed to: Add like button */}
                        <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-4">
                                {/* Original: No like button */}
                                {/* Changed to: Add like button */}
                                <button 
                                    onClick={hasUserLiked(user) ? () => removeLike(id, user) : () => addLike(id, user)} 
                                    className="pr-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                >Like</button>
                                {likes && <p className="text-gray-600 dark:text-gray-300"> {likes?.length} </p>}
                            </div>
                            <div>
                                <button 
                                    onClick={() => deletePost(post?.id)} 
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600"
                                >Delete</button>
                            </div>
                        </div>
                    </section>
                    <section id="right-sidebar" className="w-3/12 min-w-60 mt-5 px-5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <CurrentUserInfo />
                    </section>
                </main>
            )}
        </div>
    );
}

export default PostPage