import React, { useContext } from "react";
import Feed from "../components/Feed";
import Nav from "../components/Nav";
import PostForm from "../components/PostForm";
import CurrentUserInfo from "../components/CurrentUserInfo";
import { DataContext } from "../context/DataContext";

const Home = () => {

    const { posts, postIsLoading } = useContext(DataContext)

    return (
        <main className="flex h-screen max-w-7xl mx-auto py-0 px-3">
            <div id="left-sidebar" className="w-3/12 min-w-60 mt-5 px-5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <Nav />
            </div>
            <div id="home-main-content" className="flex-initial w-6/12 mt-5 px-5 text-center border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <PostForm />
                <div>
                    {postIsLoading ? <p>Loading...</p> : posts.length ? <Feed posts={posts} /> : <p>No posts to display</p>}
                </div>
            </div>
            <div id="right-sidebar" className="w-3/12 min-w-60 mt-5 px-5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <CurrentUserInfo />
            </div>
        </main>
    )
}

export default Home