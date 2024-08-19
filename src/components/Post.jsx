import React from "react";
import { Link } from 'react-router-dom'
import { addDoc, getDocs, collection, query, where, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../config/firebase"

const Post = ({ post }) => {
    /* useAuthState gives information about current user */
    const [user] = useAuthState(auth)

    /* Used hold and set the state of the number of likes. */
    const [likes, setLikes] = useState(null)

    /* Reference the likes collection in firestore */
    const likesRef = collection(db, "likes")

    /* Reference the 'likes' collection, using the 'likesRef'. 'where()' then loops
    through searching for the postId, in the 'likes' collection that matches the
    'post.id' of each individual post. */
    const likesDoc = query(likesRef, where("postid", "==", post.id))

    /* Updates the 'likes' state by referencing the likes collection docs using the
    variables defined above. */
    const getLikes = async () => {
        try {
            /* 'getDocs' references pulls data from 'likesDoc' and stores it in 'data' */
            const data = await getDocs(likesDoc)

            /*  */
            setLikes(data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id})))
        } catch (err) {
            console.error(err)
        } 
    }

    /* Creates a new doc within the 'likes' collection, taking the 'user.uid' and 
    'post.id' and storing it for reference. */
    const addLike = async () => {
        try {
            const newDoc = await addDoc(likesRef, {
                userId: user?.uid,
                postId: post.id
            })
            /* Checks the 'user' auth and sets the state of the likes. If there was 
            already likes in the array those are set first with the new like data 
            added to the end of the array. */
            if (user) {
                setLikes((prev) => 
                    prev
                        ?[...prev, {userId: user.uid, likeId: newDoc.id }]
                        : [{ userId: user.uid, likeId: newDoc.id }]
                )
            }
        /* Catch block for potential errors. */ 
        } catch (err) {
            console.error(err)
        }
    }

    const removeLike = async () => {
        try {
            const likeToDeleteQuery = query(
                likesRef,
                where("postId", "==", post.id),
                where("userId", "==", user?.uid)
            )

            const likeToDeleteData = await getDocs(likeToDeleteQuery)
            const likeId = likeToDeleteData.docs[0].id
            const likeToDelete = doc(db, "likes", likeId)
            await deleteDoc(likeToDelete)
            if (user) {
                setLikes(
                    (prev) => prev && prev.filter((like) => like.likeId !== likeId)
                )
            }
        } catch (err) {
            console.error(err)
        }
    }

    /* Loop through 'likes' state array and check if the current user.uid matches any 
    user id associated with the post. If no match is found then that means the user 
    hasn't liked that post */
    const hasUserLiked = likes?.find((like) => like.userId === user?.uid)

    useEffect(() => {
        getLikes()
    }, [])

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
                <button onClick={hasUserLiked ? removeLike : addLike} className="pr-1">Like</button>
                {likes && <p> {likes?.length} </p>}
                <button className="pr-1">Share</button>
                <button className="pr-1">Save</button>
            </div>
        </div>
    )
}

export default Post