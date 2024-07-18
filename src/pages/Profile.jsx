import React from "react";
import Feed from "../components/Feed";
import Nav from "../components/Nav";
import CreatePost from "../components/PostForm";

const Profile = () => {

    return (
        <main className="flex h-screen max-w-7xl mx-auto py-0 px-3">
            <div id="left-sidebar" className="flex-auto min-w-60 mt-5 px-5 border">
                <Nav />
            </div>
            <div id="profile-main-content">
                <CreatePost />
                <div>
                    <Feed />
                </div>
            </div>
            <div id="right-sidebar" className="flex-auto min-w-60 mt-5 px-5 border"></div>
        </main>
    )
}

export default Profile