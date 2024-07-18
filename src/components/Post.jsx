import React from "react";


const Post = () => {
    return (
        <div>
            <Link to={`/post/${post.id}`}>
                <h2>Username</h2>
                <h5>{post.datetime}</h5>
            </Link>
            <p>{
                (post.content).length <= 100
                ? post.content
                : `${(post.content).slice(0, 100)}...`
            }</p>
        </div>
    )
}