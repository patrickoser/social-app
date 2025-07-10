import React, { useContext } from "react";
import Feed from "../components/Feed";
import PostForm from "../components/PostForm";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import MobileNav from "../components/MobileNav";
// Guest mode comment: Guest indicator component for showing guest status
import GuestIndicator from "../components/GuestIndicator";
import { DataContext } from "../context/DataContext";

const Home = () => {
    const { posts, postIsLoading } = useContext(DataContext)

    return (
        <>
            <main className="flex flex-col md:flex-row max-w-7xl mx-auto py-0 px-3">
                <LeftSidebar />
                <section className="flex-1 w-full md:w-6/12 mt-5 px-3 md:px-5 text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-t border-gray-300 dark:border-gray-700 pb-20 md:pb-0">
                    {/* Guest mode comment: Show guest indicator when in guest mode */}
                    <GuestIndicator />
                    <PostForm />
                    <div>
                        {postIsLoading ? <p>Loading...</p> : posts.length ? <Feed posts={posts} /> : <p>No posts to display</p>}
                    </div>
                </section>
                <RightSidebar />
            </main>
            <MobileNav />
        </>
    )
}

export default Home