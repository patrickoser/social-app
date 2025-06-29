import React, { useContext } from "react";
import { DataContext } from "../context/DataContext";
import { AuthContext } from "../context/AuthContext";
import { useParams } from "react-router-dom"
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import ProfilePicture from "../components/ProfilePicture";

const PostPage = () => {
    const { posts, deletePost, postIsLoading, addLike, removeLike, hasUserLiked } = useContext(DataContext)
    const { user } = useContext(AuthContext)
    const { id } = useParams()
    const post = posts.find(post => (post.id).toString() === id)

    return (
        <div>
            {postIsLoading ? (
                <h1 className="text-center text-gray-900 dark:text-white">Loading...</h1>
            ) : (
                <main className="flex max-w-7xl mx-auto py-0 px-3">
                    <LeftSidebar />
                    <section id="main-content-post" className="flex-initial w-6/12 mt-5 px-5 text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-t border-b border-gray-300 dark:border-gray-700">
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
            )}
        </div>
    );
}

export default PostPage