import React from "react";
import Feed from "../components/Feed";
import CreatePost from "../components/CreatePost";

const Profile = () => {

    return (
        <main className="flex h-screen max-w-7xl mx-auto py-0 px-3">
            <section id="left-sidebar" className="flex-auto min-w-60 mt-5 px-5 border">
            </section>
            <section id="profile-main-content">
                <CreatePost />
                <div>
                    <Feed />
                </div>
            </section>
            <section id="right-sidebar" className="flex-auto min-w-60 mt-5 px-5 border"></section>
        </main>
    )
}

export default Profile