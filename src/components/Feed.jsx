import React, { useContext } from "react";
import { DataContext } from "../context/DataContext"
import Post from "./Post";

const Feed = () => {
    const { posts } = useContext(DataContext)
    
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