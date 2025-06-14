import React from "react";
import { useContext } from "react";
import { DataContext } from "../context/DataContext";
import { useParams } from "react-router-dom"
import Nav from "../components/Nav";
import CurrentUserInfo from "../components/CurrentUserInfo";

const PostPage = () => {
    // Pulls in the 'posts' object from 'db.json' for reference below.
    const { posts, deletePost, postIsLoading } = useContext(DataContext)

    // 'useParams' grabs the 'id' from the url for reference below.
    const { id } = useParams()

    // 'find()' loops through every post object to find the one that contains a 'post.id' that
    //  strictly equals the 'id' that is being referenced by 'useParams'. When that check comes
    // back as 'true' then the 'post' variable is assigned that object so that it can be referenced
    // below to construct the page.
    const post = posts.find(post => (post.id).toString() === id)

    // I need to add an auth check to see if the current user
    // is the one who created the post and is authorized to delete. 
    return (
        <div>
            {postIsLoading ? (
                <h1>Loading...</h1>
            ) : (    
                <main className="flex h-screen max-w-7xl mx-auto py-0 px-3">
                    <section id="left-sidebar" className="w-3/12 min-w-60 mt-5 px-5 border">
                        <Nav />
                    </section>
                    <section className="flex-initial w-6/12 mt-5 px-5 text-center border-b border-t border-black">
                        <div className="max-w-full text-left">
                            <h1 className="font-bold">{post.username}</h1>
                            <h2 className="text-xs">{post.datetime}</h2>
                        </div>
                        <div>
                            <p>{post.content}</p>
                        </div>
                        <div>
                            <button className="pr-1" onClick={() => deletePost(post.id)}>Delete</button>
                        </div>
                    </section>
                    <section id="right-sidebar" className="w-3/12 min-w-60 mt-5 px-5 border">
                        <CurrentUserInfo />
                    </section>
                </main>
            )}
        </div>
    );
}

export default PostPage