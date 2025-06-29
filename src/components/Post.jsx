import React, { useContext } from "react";
import { Link } from 'react-router-dom'
import { AuthContext } from "../context/AuthContext";
import { DataContext } from "../context/DataContext";
import ProfilePicture from "./ProfilePicture";

const Post = ({ post }) => {
    const { user } = useContext(AuthContext)
    const { addLike, removeLike, hasUserLiked } = useContext(DataContext)

    return (
        <div className="max-w-full border-b border-gray-300 dark:border-gray-700 text-left bg-white dark:bg-gray-800 p-4">
            <Link to={`/post/${post.id}`} className="block hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 rounded-lg p-2 -m-2">
                <div className="flex items-center space-x-3">
                    <ProfilePicture userId={post.userId} size="sm" />
                    <div className="flex flex-col">
                        <Link 
                            to={`/profile/${post.username}`} 
                            className="font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {post.username}
                        </Link>
                        <h5 className="text-xs text-gray-500 dark:text-gray-400">{post.datetime}</h5>
                    </div>
                </div>
                <p className="text-gray-800 dark:text-gray-200 mt-2">{
                    (post.content).length <= 100
                    ? post.content
                    : `${(post.content).slice(0, 140)}...`
                }</p>
            </Link>
            <div className="flex justify-end mt-2 space-x-4">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={hasUserLiked(post, user) ? () => removeLike(post.id, user) : () => addLike(post.id, user)}
                        className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >Like</button>
                    {post.likes && <p className="text-gray-600 dark:text-gray-300"> {post.likes.length} </p>}
                </div>
                <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Share</button>
                <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Save</button>
            </div>
        </div>
    )
}

export default Post