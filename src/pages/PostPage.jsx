import React from "react";
import { useContext } from "react";
import DataContext from "../context/DataContext";
import { useParams } from "react-router-dom"

const PostPage = () => {
    // Pulls in the 'posts' object from 'db.json' for reference below.
    const { posts, deletePost } = useContext(DataContext)

    // 'useParams' grabs the 'id' from the url for reference below.
    const { id } = useParams()

    // 'find()' loops through every post object to find the one that contains a 'post.id' that
    //  strictly equals the 'id' that is being referenced by 'useParams'. When that check comes
    // back as 'true' then the 'post' variable is assigned that object so that it can be referenced
    // below to construct the page.
    const post = posts.find(post => (post.id).toString() === id)

    // I need to add an auth check to see if the current user
    // is the one who created the post and is authorized to delete.
    return (
        <main>
            <div>
                <h1>Username</h1>
                <h2>{post.datetime}</h2>
            </div>
            <div>
                <p>{post.content}</p>
            </div>
            <div>
                <button onClick={() => deletePost(post.id)}>Delete</button>
            </div>
        </main>
    )
}

export default PostPage