import React, { useContext } from "react";
import Feed from "../components/Feed";
import Nav from "../components/Nav";
import PostForm from "../components/PostForm";
import DataContext from "../context/DataContext"
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
    const { posts } = useContext(DataContext)
    const { user } = useContext(AuthContext)

    return (
        <main className="flex h-screen max-w-7xl mx-auto py-0 px-3">
            <div id="left-sidebar" className="flex-auto min-w-60 mt-5 px-5 border">
                <Nav />
            </div>
            <div id="profile-main-content">
                <div id="prfile-bio">
                    <div id="prfile-pfp">image</div>
                    <div id="profile-username">{user.username}</div>
                    <div id="bio">
                        <p>
                        About me section that gives a brief description about the user 
                        and what they want to tell other people about them.
                        </p>
                    </div>
                </div>
                {/* Add two tabs that switch between the users posts and likes. */}
                <div id="profile-tabs">
                    <div>Posts</div>
                    <div>Likes</div>
                </div>
                <PostForm />
                <div>
                    <Feed posts={posts} />
                </div>
            </div>
            <div id="right-sidebar" className="flex-auto min-w-60 mt-5 px-5 border"></div>
        </main>
    )
}

export default Profile