import React from "react";

const CreatePost = () => {
    return (
        <div className="p-2">
            <form action="POST" className="flex">
                <input 
                    type="text"
                    name="post"
                    placeholder="What's on your mind?"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
                <button type="submit" className="ml-2">Send</button>
            </form>
        </div>
    )
}

export default CreatePost