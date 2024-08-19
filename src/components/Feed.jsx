import React from "react";
import Post from "./Post";

const Feed = () => {
    return (
        //Maps each post to the Home page of the user.
        <div>
            {posts.map(post => (
                <Post key={post.id} post={post} />
            ))}
        </div>
    )
}

export default Feed