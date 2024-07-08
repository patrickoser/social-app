import React from "react";

const CreatePost = () => {
    return (
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
    )
}

export default CreatePost