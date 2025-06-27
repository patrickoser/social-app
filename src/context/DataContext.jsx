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
            const fetchedPosts = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            setPosts(fetchedPosts)
            
            // Fetch all likes and attach to posts
            await attachLikesToPosts(fetchedPosts)
        } catch(err) {
            console.log(err.message)
        } finally {
            setPostIsLoading(false)
        }
    }

    const attachLikesToPosts = async (postsToUpdate) => {
        try {
            const allLikes = await getDocs(likesRef)
            const likesByPost = {}
            
            allLikes.docs.forEach(doc => {
                const like = { ...doc.data(), likeId: doc.id }
                if (!likesByPost[like.postId]) {
                    likesByPost[like.postId] = []
                }
                likesByPost[like.postId].push(like)
            })
            
            setPosts(postsToUpdate.map(post => ({
                ...post,
                likes: likesByPost[post.id] || []
            })))
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
                setPosts(prevPosts => 
                    prevPosts.map(post => 
                        post.id === postId 
                            ? { 
                                ...post, 
                                likes: [...(post.likes || []), {
                                    userId: user.userId, 
                                    username: user.username, 
                                    likeId: newDoc.id
                                }]
                              }
                            : post
                    )
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
                setPosts(prevPosts => 
                    prevPosts.map(post => 
                        post.id === postId 
                            ? { 
                                ...post, 
                                likes: (post.likes || []).filter(like => like.likeId !== likeId)
                              }
                            : post
                    )
                )
            }
        } catch (err) {
            console.error(err)
        }
    }

    const hasUserLiked = (post, user) => {
        return post.likes?.find((like) => like.userId === user?.userId)
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
            addLike, removeLike, hasUserLiked
        }}>
            {children}
        </DataContext.Provider>
    )
}