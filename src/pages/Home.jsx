import React, { useContext } from "react";
import Feed from "../components/Feed";
import Nav from "../components/Nav";
import PostForm from "../components/PostForm";
import DataContext from "../context/DataContext";

const Home = () => {

    const { posts } = useContext(DataContext)

    return (
        <main className="flex h-screen max-w-7xl mx-auto py-0 px-3">
            <section id="left-sidebar" className="flex-auto min-w-60 mt-5 px-5 border">
                <Nav />
            </section>
            <section id="home-main-content" className="flex-initial w-6/12 mt-5 px-5 text-center border">
                <PostForm />
                <div>
                    {posts. length ? <Feed posts={posts} /> : <p>No posts to display</p>}
                </div>
            </section>
            <section id="right-sidebar" className="flex-auto min-w-60 mt-5 px-5 border">
            </section>
        </main>
    )
}

export default Home