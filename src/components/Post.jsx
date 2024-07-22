import React from "react";
import { Link } from 'react-router-dom'

const Post = ({ post }) => {
    return (
        <div className="max-w-full border-b border-black text-left">
            <Link to={`/post/${post.id}`}>
                <h2 className="font-bold">Username</h2>
                <h5 className="text-xs">{post.datetime}</h5>
            </Link>
            <p>{
                (post.content).length <= 100
                ? post.content
                : `${(post.content).slice(0, 100)}...`
            }</p>
            <div className="flex justify-end">
                <button className="pr-1">Like</button>
                <button className="pr-1">Share</button>
                <button className="pr-1">Save</button>
            </div>
        </div>
    )
}

export default Post