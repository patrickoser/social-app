import React from "react";
import { useContext } from "react";
import DataContext from "../context/DataContext";
import { Link, useParams } from "react-router-dom"

const PostPage = () => {
    const { posts } = useContext(DataContext)
    const { id } = useParams()
    // 
    const post = posts.find(post => (post.id).toString() === id)

    return (
        <main>
            <div>
                <h1>Username</h1>
                <h2>{post.datetime}</h2>
            </div>
        </main>
    )
}

export default PostPage