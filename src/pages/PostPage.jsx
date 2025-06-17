import React from "react";
import { useContext } from "react";
import { DataContext } from "../context/DataContext";
import { useParams } from "react-router-dom"
import Nav from "../components/Nav";
import CurrentUserInfo from "../components/CurrentUserInfo";

const PostPage = () => {
    // Pulls in the 'posts' object from 'db.json' for reference below.
    const { posts, deletePost, postIsLoading } = useContext(DataContext)

    // 'useParams' grabs the 'id' from the url for reference below.
    const { id } = useParams()

    // 'find()' loops through every post object to find the one that contains a 'post.id' that
    //  strictly equals the 'id' that is being referenced by 'useParams'. When that check comes
    // back as 'true' then the 'post' variable is assigned that object so that it can be referenced
    // below to construct the page.
    const post = posts.find(post => (post.id).toString() === id)

    // I need to add an auth check to see if the current user
    // is the one who created the post and is authorized to delete. 
    return (
        <div>
            {postIsLoading ? (
                <h1>Loading...</h1>
            ) : (    
                <main className="flex h-screen max-w-7xl mx-auto py-0 px-3">
                    <section id="left-sidebar" className="w-3/12 min-w-60 mt-5 px-5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <Nav />
                    </section>
                    <section id="main-content-post" className="flex-initial w-6/12 mt-5 px-5 text-center border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                        <div className="max-w-full text-left">
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{post.username}</h1>
                            <h2 className="text-xs text-gray-500 dark:text-gray-400">{post.datetime}</h2>
                        </div>
                        <div>
                            <p className="mt-4 text-gray-800 dark:text-gray-200 text-left">{post.content}</p>
                        </div>
                        <div>
                            <button 
                                onClick={() => deletePost(post.id)} 
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