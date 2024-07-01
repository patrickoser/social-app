import React from "react";
import Feed from "./Feed";

const Home = () => {
    return (
        <main className="flex h-screen max-w-7xl mx-auto py-0 px-3">
            <section className="flex-auto min-w-60 mt-5 px-5">

            </section>
            <section className="flex-auto">
                <Feed />
            </section>
            <section className="flex-auto">
            </section>
        </main>
    )
}

export default Home

.sidebar {
    border-right: 1px solid var(--twitter-background);
    flex: 0.2;
  
    min-width: 250px;
    margin-top: 20px;
    padding-left: 20px;
    padding-right: 20px;
  }