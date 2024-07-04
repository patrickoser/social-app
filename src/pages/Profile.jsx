import React from "react";
import Feed from "./Feed";

const Profile = () => {

    return (
        <main>
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