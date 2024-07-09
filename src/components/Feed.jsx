import React from "react";

const Feed = () => {
    return (
        //Maps each post to the Home page of the user.
        <div>
            <div className="max-w-full border-b border-red-500 text-left">
                <h1 className="font-bold">Username</h1>
                <h3 className="text-xs">Date of post</h3>
                <p>This the content of the post. Where stuff will be written</p>
                <div className="flex justify-end">
                    <button className="pr-1">Like</button>
                    <button className="pr-1">Share</button>
                    <button className="pr-1">Save</button>
                </div>
            </div>
            <div className="max-w-full border-b border-red-500 text-left">
                <h1 className="font-bold">Username</h1>
                <h3 className="text-xs">Date of post</h3>
                <p>This is some more content to use as an example and figure out spacing</p>
                <div className="flex justify-end">
                    <button className="pr-1">Like</button>
                    <button className="pr-1">Share</button>
                    <button className="pr-1">Save</button>
                </div>
            </div>
            <div className="max-w-full border-b border-red-500 text-left">
                <h1 className="font-bold">Username</h1>
                <h3 className="text-xs">Date of post</h3>
                <p>Once again I will be writing more content because I am.</p>
                <div className="flex justify-end">
                    <button className="pr-1">Like</button>
                    <button className="pr-1">Share</button>
                    <button className="pr-1">Save</button>
                </div>
            </div>  
        </div>
    )
}

export default Feed