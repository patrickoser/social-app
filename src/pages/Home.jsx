import React, { useContext } from "react";
import Feed from "../components/Feed";
import PostForm from "../components/PostForm";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import { DataContext } from "../context/DataContext";

const Home = () => {
    const { posts, postIsLoading } = useContext(DataContext)

    return (
        <main className="flex h-screen max-w-7xl mx-auto py-0 px-3">
            <LeftSidebar />
            <section id="home-main-content" className="flex-initial w-6/12 mt-5 px-5 text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <PostForm />
                <div>
                    {postIsLoading ? <p>Loading...</p> : posts.length ? <Feed posts={posts} /> : <p>No posts to display</p>}
                </div>
            </section>
            <RightSidebar />
        </main>
    )
}

export default Home