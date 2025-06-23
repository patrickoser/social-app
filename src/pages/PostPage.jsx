import React, { useContext, useEffect } from "react";
import { DataContext } from "../context/DataContext";
import { AuthContext } from "../context/AuthContext";
import { useParams } from "react-router-dom"
import Nav from "../components/Nav";
import CurrentUserInfo from "../components/CurrentUserInfo";

const PostPage = () => {

    const { posts, deletePost, postIsLoading, likes, getLikes, addLike, removeLike, hasUserLiked } = useContext(DataContext)
    const { user } = useContext(AuthContext)
    const { id } = useParams()
    const post = posts.find(post => (post.id).toString() === id)

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
                        <div className="flex justify-end items-center p-4">
                            <button 
                                onClick={hasUserLiked(user) ? () => removeLike(id, user) : () => addLike(id, user)} 
                                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mr-2"
                            >Like</button>
                            {likes && <span className="text-gray-600 dark:text-gray-300 mr-4"> {likes?.length} </span>}
                            <button 
                                onClick={() => deletePost(post?.id)} 
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600"
                            >Delete</button>
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