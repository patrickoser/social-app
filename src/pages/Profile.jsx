import React from "react";
import Feed from "../components/Feed";

const Profile = () => {

    return (
        <main className="flex h-screen max-w-7xl mx-auto py-0 px-3">
            
            <section id="profile-main-content">
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
        </main>
    )
}

export default Profile