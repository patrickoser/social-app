import React from "react";
import Feed from "../components/Feed";

const Profile = () => {

    return (
        <main className="flex h-screen max-w-7xl mx-auto py-0 px-3">
            
            <section>
                <form action="POST">
                    <input 
                        type="text"
                        name="post"
                        placeholder="What's on your mind?"
                    />
                    <button type="submit">Send</button>
                </form>
            </section>
            <section>
                <div>
                    <Feed />
                </div>
            </section>
        </main>
    )
}

export default Profile