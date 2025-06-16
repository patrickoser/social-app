import React from "react";
import { useContext } from "react";
import { DataContext } from "../context/DataContext";

const PostForm = () => {
    const { createPost, postContent, setPostContent } = useContext(DataContext)
    
    return (
        <div className="py-2 border-b border-t border-gray-200 dark:border-gray-700">
            <form action="POST" onSubmit={createPost} className="flex">
                <label 
                    htmlFor="postContent" 
                    className="absolute left-[-10000px]"
                >Post Content</label>
                <input 
                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                    type="text"
                    value={postContent}
                    name="postContent"
                    placeholder="What's on your mind?"
                    onChange={(e) => setPostContent(e.target.value)}
                    required
                />
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 ml-2">Post</button>
            </form>
        </div>
    )
}

export default PostForm