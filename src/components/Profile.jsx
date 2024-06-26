import React from "react";

const Profile = () => {

    return (
        <main>
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
        </main>
    )
}

export default Profile