import React from "react";
import Post from "./Post";

const Feed = ({ posts }) => {

    const sortedPosts = posts.sort((a, b) => new Date(b.datetime) - new Date(a.datetime))

    return (
        /* Maps each post to the Home page of the user. */
        <div>
            {console.log('sortedPosts: ', sortedPosts)}
            {sortedPosts.map(post => (
                <Post key={post.id} post={post} />
            ))}
        </div>
    )
}

export default Feed