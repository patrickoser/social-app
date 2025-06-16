import React from "react";
import { Link } from 'react-router-dom'
import { addDoc, getDocs, collection, query, where, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState, useContext } from "react";
import { db } from "../config/firebase"
import { AuthContext } from "../context/AuthContext";

const Post = ({ post }) => {
    /* useAuthState gives information about current user */
    const { user } = useContext(AuthContext)

    /* Used to hold and set the state of the number of likes. */
    const [likes, setLikes] = useState(null)

    /* Reference the likes collection in firestore */
    const likesRef = collection(db, "likes")

    /* Reference the 'likes' collection, using the 'likesRef'. 'where()' then loops
    through searching for the postId, in the 'likes' collection that matches the
    'post.id' of each individual post. */
    const likesDoc = query(likesRef, where("postId", "==", post.id))

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

    /* Creates a new doc within the 'likes' collection, taking the 'user.userId' and 
    'post.id' and storing it for reference. */
    const addLike = async () => {
        try {
            const newDoc = await addDoc(likesRef, {
                userId: user?.userId,
                username: user?.username,
                postId: post.id
            })
            /* Checks the 'user' auth and sets the state of the likes. If there was 
            already likes in the array those are set first with the new like data 
            added to the end of the array. */
            if (user) {
                setLikes((prev) => 
                    prev
                        ?[...prev, {userId: user.userId, username: user.username, likeId: newDoc.id }]
                        : [{ userId: user.userId, username: user.username, likeId: newDoc.id }]
                )
            }
        /* Catch block for potential errors. */ 
        } catch (err) {
            console.error(err)
        }
    }

    /* Deletes likes from the 'likes' collection array. */
    const removeLike = async () => {
        /* Query the 'likes' collection to find the doc that holds a 'postId'/'userId 
        that matches the current users 'user.userId' and 'post.id' */ 
        try {
            const likeToDeleteQuery = query(
                likesRef,
                where("postId", "==", post.id),
                where("userId", "==", user?.userId)
            )

            /* Call 'getDocs' on the query and assign data to 'likeToDeleteData'. */
            const likeToDeleteData = await getDocs(likeToDeleteQuery)

            /* Get the doc id associated with the like and assign to 'likeId'. */
            const likeId = likeToDeleteData.docs[0].id

            /* Use 'likeId' to refernce the specific like you want to delete in the 
            'likes' collection. */
            const likeToDelete = doc(db, "likes", likeId)

            /* Pass the specified like to 'deleteDoc' function to remove it from 
            the 'likes' firestore collection. */
            await deleteDoc(likeToDelete)
            /* Check for user auth, if true... */
            if (user) {
                /* Loop through 'likes' state array and remove the like that matches 
                the 'likeId'. */
                setLikes(
                    (prev) => prev && prev.filter((like) => like.likeId !== likeId)
                )
            }
        /* Catch block for potential errors. */
        } catch (err) {
            console.error(err)
        }
    }

    /* Loop through 'likes' state array and check if the current user.userId matches any 
    user id associated with the post. If no match is found then that means the user 
    hasn't liked that post. */
    const hasUserLiked = likes?.find((like) => like.userId === user?.userId)

    /* Calls 'getLikes' function on page load or change to dependent variables. */ 
    useEffect(() => {
        getLikes()
    }, [post.id, user?.userId])

    return (
        <div className="max-w-full border-b border-gray-200 dark:border-gray-700 text-left bg-white dark:bg-gray-800 p-4">
            <Link to={`/post/${post.id}`}>
                <h2 className="font-bold">{post.username}</h2>
                <h5 className="text-xs text-gray-500 dark:text-gray-400">{post.datetime}</h5>
            </Link>
            <p className="text-gray-800 dark:text-gray-200 mt-2">{
                (post.content).length <= 100
                ? post.content
                : `${(post.content).slice(0, 100)}...`
            }</p>
            <div className="flex justify-end mt-2">
                <button 
                    onClick={hasUserLiked ? removeLike : addLike} 
                    className="pr-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >Like</button>
                {likes && <p className="text-gray-600 dark:text-gray-300"> {likes?.length} </p>}
                <button className="pr-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Share</button>
                <button className="pr-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Save</button>
            </div>
        </div>
    )
}

export default Post