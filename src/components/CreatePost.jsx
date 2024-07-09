import React from "react";

const CreatePost = () => {
    return (
        <div className="py-2 border-b border-black">
            <form action="POST" className="flex">
                <input 
                    type="text"
                    name="post"
                    placeholder="What's on your mind?"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                />
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 ml-2">Send</button>
            </form>
        </div>
    )
}

export default CreatePost