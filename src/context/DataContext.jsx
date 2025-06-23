import { createContext, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns'
import { db } from "../config/firebase"
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from "firebase/firestore"
import { AuthContext } from "./AuthContext";

export const DataContext = createContext({})

export const DataProvider = ({ children }) => {

    const navigate = useNavigate()
    const [posts, setPosts] = useState([])
    const [postContent, setPostContent] = useState('')
    const postsCollectionRef = collection(db, "posts")
    const [postIsLoading, setPostIsLoading] = useState(true)
    const [likes, setLikes] = useState(null)
    const likesRef = collection(db, "likes")

    const { user } = useContext(AuthContext)

    /* Called from within 'PostForm' component. Adds a new post to the "posts" collection. */
    const createPost = async (e) => {
        e.preventDefault()
        console.log('user createPost: ', user)
        const datetime = format(new Date(), 'MMMM dd yyyy pp')
        console.log('datetime: ', datetime)
        try {
            const docRef = await addDoc(postsCollectionRef, { 
                username: user.username, 
                userId: user.userId,
                content: postContent, 
                datetime: datetime, 
            })
            const newPost = {
                id: docRef.id,
                username: user.username,
                userId: user.userId,
                content: postContent,
                datetime: datetime,
            }
            setPosts(prevPosts =>[...prevPosts, newPost])
            setPostContent('')
        } catch(err) {
            console.error(err)
        }
    }
    
    /* Called within 'PostPage'. Takes in 'id' as a parameter and uses it to find the right
    post in firebase and remove it from the database. */
    const deletePost = async (id) => {
        console.log(id)
        try {
            const postDoc = doc(db, "posts", id)
            await deleteDoc(postDoc)
        } catch (err) {
            console.error(err)
        }
    }

    /* Called below in a useEffect. References the "posts" collection in firebase, then uses
    'setPosts' to update the current state of the 'posts' object.. */
    const getPosts = async () => {
        setPostIsLoading(true)
        try {
            const data = await getDocs(postsCollectionRef)
            setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        } catch(err) {
            console.log(err.message)
        } finally {
            setPostIsLoading(false)
        }
    }

    const getLikes = async (postId) => {
        try {
            const likesDoc = query(likesRef, where("postId", "==", postId))
            const data = await getDocs(likesDoc)
            setLikes(data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id})))
        } catch (err) {
            console.error(err)
        }
    }

    const addLike = async (postId, user) => {
        try {
            const newDoc = await addDoc(likesRef, {
                userId: user?.userId,
                username: user?.username,
                postId: postId
            })
            if (user) {
                setLikes((prev) => 
                    prev
                        ?[...prev, {userId: user.userId, username: user.username, likeId: newDoc.id }]
                        : [{ userId: user.userId, username: user.username, likeId: newDoc.id }]
                )
            }
        } catch (err) {
            console.error(err)
        }
    }

    const removeLike = async (postId, user) => {
        try {
            const likeToDeleteQuery = query(
                likesRef,
                where("postId", "==", postId),
                where("userId", "==", user?.userId)
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

    const hasUserLiked = (user) => {
        return likes?.find((like) => like.userId === user?.userId)
    }

    /* useEffect hook to fetch posts when the component mounts. This should probably be moved to
    somewhere else so it only mounts when being called on the home screen. */
    useEffect(() => {
        getPosts()
    }, [])

    return (
        <DataContext.Provider value={{
            posts, setPosts, navigate, postContent, setPostContent, createPost,
            deletePost, getPosts, postIsLoading, setPostIsLoading,
            likes, getLikes, addLike, removeLike, hasUserLiked
        }}>
            {children}
        </DataContext.Provider>
    )
}