import React from "react";
import { useContext } from "react";
import DataContext from "../context/DataContext";
import { Link, useParams } from "react-router-dom"

const PostPage = () => {
    const { posts } = useContext(DataContext)
    const { id } = useParams()
    // 'find()' loops through every post object to find the one that contains a 'post.id' that
    //  strictly equals the 'id' that is being referenced by 'useParams'. When that check comes
    // back as 'true' then the 'post' variable is assigned that object so that it can be referenced
    // below to construct the page.
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