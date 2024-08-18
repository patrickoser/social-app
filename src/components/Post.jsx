import React from "react";
import { Link } from 'react-router-dom'
import { addDoc, getDocs, collection, query, where, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../config/firebase"

const Post = ({ post }) => {
    const [user] = useAuthState(auth)
    const [likes, setLikes] = useState(null)

    // Reference the likes collection in firestore
    const likesRef = collection(db, "likes")

    // Reference the likes doc, using the 'likesRef' to target, 'where()' then loops
    // through searching for the post id that matches.
    const likesDoc = query(likesRef, where("postid", "==", post.id))

    // Updates the 'likes' state by referencing the likes collection docs using the
    // variables defined above.
    const getLikes = async () => {
        try {
            const data = await getDocs(likesDoc)
            setLikes(data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id})))
        } catch (err) {
            console.error(err)
        } 
    }

    const addLike = async () => {
        try {
            const newDoc = await addDoc(likesRef, {
                userId: user?.uid,
                postId: 
            })
            if (user) {
                setLikes((prev) => 
                    prev
                        ?[...prev, {userId: user.uid, likeId: newDoc.id }]
                        : [{ userId: user.uid, likeId: newDoc.id }]
                )
            }
        } catch (err) {
            console.error(err)
        }
    }

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