import React from "react";
import Feed from "./Feed";

const Home = () => {
    return (
        <main className="flex h-screen max-w-7xl mx-auto py-0 px-3">
            <section className="flex-auto min-w-60 mt-5 px-5 border">
            </section>
            <section className="flex-auto text-center border">
                <Feed />
            </section>
            <section className="flex-auto min-w-60 mt-5 px-5 border">
            </section>
        </main>
    )
}

export default Home