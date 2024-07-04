import React from "react";
import Feed from "../components/Feed";

const Home = () => {
    // Need to space the Home sections out more to give more room for Feed to display
    // posts. Should probably be about twice as big as either individual sidebar.
    return (
        <main className="flex h-screen max-w-7xl mx-auto py-0 px-3">
            <section className="flex-auto min-w-60 mt-5 px-5 border">
            </section>
            <section className="flex-initial w-6/12 mt-5 px-5 text-center border">
                <Feed />
            </section>
            <section className="flex-auto min-w-60 mt-5 px-5 border">
            </section>
        </main>
    )
}

export default Home