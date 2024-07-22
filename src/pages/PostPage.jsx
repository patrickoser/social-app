import React from "react";
import { useContext } from "react";
import DataContext from "../context/DataContext";
import { Link, useParams } from "react-router-dom"

const PostPage = () => {
    const { posts } = useContext(DataContext)
    const { id } = useParams()
    const post = posts.find(post => (post.id).toString() === id)

    return (
        <main>
            
        </main>
    )
}

export default PostPage