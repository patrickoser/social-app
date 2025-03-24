import React from "react";
import Post from "./Post";

const Feed = ({ posts }) => {

    const sortedPosts = posts.sort((a, b) => { return b.datetime - a.datetime })

    return (
        /* Maps each post to the Home page of the user. */
        <div>
            {posts.map(post => (
                <Post key={post.id} post={post} />
            ))}
        </div>
    )
}

export default Feed