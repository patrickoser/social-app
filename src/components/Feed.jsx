import React from "react";
import Post from "./Post";

const Feed = ({ posts }) => {
    /* Sorts the posts by date and time. Newest to oldest. */
    const sortedPosts = posts.sort((a, b) => new Date(b.datetime) - new Date(a.datetime))

    return (
        /* Maps each post to the Home page of the user. */
        <div>
            {sortedPosts.map(post => (
                <Post key={post.id} post={post} />
            ))}
        </div>
    )
}

export default Feed