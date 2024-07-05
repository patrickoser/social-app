import React from "react";
import Feed from "../components/Feed";
import Nav from "../components/Nav";

const Home = () => {
    // Need to space the Home sections out more to give more room for Feed to display
    // posts. Should probably be about twice as big as either individual sidebar.
    return (
        <main className="flex h-screen max-w-7xl mx-auto py-0 px-3">
            <section id="left-sidebar" className="flex-auto min-w-60 mt-5 px-5 border">
                <Nav />
            </section>
            <section id="home-main-content" className="flex-initial w-6/12 mt-5 px-5 text-center border">
                <div>
                    <form action="POST">
                        <input 
                            type="text"
                            name="post"
                            placeholder="What's on your mind?"
                        />
                        <button type="submit">Send</button>
                    </form>
                </div>
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