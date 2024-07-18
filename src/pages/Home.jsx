import React from "react";
import Feed from "../components/Feed";
import Nav from "../components/Nav";
import PostForm from "../components/PostForm";

const Home = () => {

    return (
        <main className="flex h-screen max-w-7xl mx-auto py-0 px-3">
            <section id="left-sidebar" className="flex-auto min-w-60 mt-5 px-5 border">
                <Nav />
            </section>
            <section id="home-main-content" className="flex-initial w-6/12 mt-5 px-5 text-center border">
                <PostForm />
                <div>
                    <Feed />
                </div>
            </section>
            <section id="right-sidebar" className="flex-auto min-w-60 mt-5 px-5 border">
            </section>
        </main>
    )
}

export default Home