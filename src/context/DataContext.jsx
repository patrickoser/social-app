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
    
    // LIKES REFERENCE: Points to the likes collection in Firebase
    // This stays the same - we still use the separate likes collection
    const likesRef = collection(db, "likes")
    
    // SAVES REFERENCE: Points to the saves collection in Firebase
    const savesRef = collection(db, "saves")

    const { user } = useContext(AuthContext)

    /* Called from within 'PostForm' component. Adds a new post to the "posts" collection. */
    const createPost = async (e) => {
        e.preventDefault()
        const datetime = format(new Date(), 'MMMM dd yyyy pp')
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
            
            // NEW: After fetching posts, we now attach likes to each post
            // This is the key change - instead of separate likes state, likes become part of each post
            await attachLikesToPosts(fetchedPosts)
            // NEW: Also attach saves to each post
            await attachSavesToPosts(fetchedPosts)
        } catch(err) {
            console.log(err.message)
        } finally {
            setPostIsLoading(false)
        }
    }

    // NEW FUNCTION: This is the core of our fix
    // Takes all posts and attaches their respective likes to each post object
    const attachLikesToPosts = async (postsToUpdate) => {
        try {
            // Step 1: Fetch ALL likes from Firebase in one query
            const allLikes = await getDocs(likesRef)
            const likesByPost = {}
            
            // Step 2: Group likes by postId (organize likes by which post they belong to)
            allLikes.docs.forEach(doc => {
                const like = { ...doc.data(), likeId: doc.id }
                if (!likesByPost[like.postId]) {
                    likesByPost[like.postId] = []
                }
                likesByPost[like.postId].push(like)
            })
            
            // Step 3: Attach the grouped likes to each post
            // This transforms: [{id: 'post1', content: '...'}] 
            // Into: [{id: 'post1', content: '...', likes: [like1, like2, like3]}]
            setPosts(postsToUpdate.map(post => ({
                ...post,
                likes: likesByPost[post.id] || [] // If no likes, use empty array
            })))
        } catch (err) {
            console.error(err)
        }
    }

    // NEW FUNCTION: Similar to attachLikesToPosts but for saves
    const attachSavesToPosts = async (postsToUpdate) => {
        try {
            // Step 1: Fetch ALL saves from Firebase in one query
            const allSaves = await getDocs(savesRef)
            const savesByPost = {}
            
            // Step 2: Group saves by postId (organize saves by which post they belong to)
            allSaves.docs.forEach(doc => {
                const save = { ...doc.data(), saveId: doc.id }
                if (!savesByPost[save.postId]) {
                    savesByPost[save.postId] = []
                }
                savesByPost[save.postId].push(save)
            })
            
            // Step 3: Attach the grouped saves to each post
            setPosts(prevPosts => prevPosts.map(post => ({
                ...post,
                saves: savesByPost[post.id] || [] // If no saves, use empty array
            })))
        } catch (err) {
            console.error(err)
        }
    }

    // UPDATED: Now updates the specific post's likes array instead of global likes state
    const addLike = async (postId, user) => {
        try {
            // Step 1: Add like to Firebase (unchanged)
            const newDoc = await addDoc(likesRef, {
                userId: user?.userId,
                username: user?.username,
                postId: postId
            })
            
            if (user) {
                // Step 2: Update the specific post's likes in local state
                // This is the key change - we update the post's likes array, not global likes
                setPosts(prevPosts => 
                    prevPosts.map(post => 
                        post.id === postId 
                            ? { 
                                ...post, 
                                // Spread existing likes and add the new one
                                likes: [...(post.likes || []), {
                                    userId: user.userId, 
                                    username: user.username, 
                                    likeId: newDoc.id
                                }]
                              }
                            : post // Leave other posts unchanged
                    )
                )
            }
        } catch (err) {
            console.error(err)
        }
    }

    // UPDATED: Now removes from the specific post's likes array instead of global likes state
    const removeLike = async (postId, user) => {
        try {
            // Step 1: Find and delete the like from Firebase (unchanged)
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
                // Step 2: Remove the like from the specific post's likes array
                // This is the key change - we filter the post's likes, not global likes
                setPosts(prevPosts => 
                    prevPosts.map(post => 
                        post.id === postId 
                            ? { 
                                ...post, 
                                // Filter out the deleted like
                                likes: (post.likes || []).filter(like => like.likeId !== likeId)
                              }
                            : post // Leave other posts unchanged
                    )
                )
            }
        } catch (err) {
            console.error(err)
        }
    }

    // UPDATED: Now checks the specific post's likes array instead of global likes state
    // Changed from: hasUserLiked(user) to hasUserLiked(post, user)
    const hasUserLiked = (post, user) => {
        // Check if the user's ID exists in this specific post's likes array
        return post.likes?.find((like) => like.userId === user?.userId)
    }

    // NEW: Add save functionality - similar to addLike
    const addSave = async (postId, user) => {
        try {
            // Step 1: Add save to Firebase
            const newDoc = await addDoc(savesRef, {
                userId: user?.userId,
                username: user?.username,
                postId: postId
            })
            
            if (user) {
                // Step 2: Update the specific post's saves in local state
                setPosts(prevPosts => 
                    prevPosts.map(post => 
                        post.id === postId 
                            ? { 
                                ...post, 
                                saves: [...(post.saves || []), {
                                    userId: user.userId, 
                                    username: user.username, 
                                    saveId: newDoc.id
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

    // NEW: Remove save functionality - similar to removeLike
    const removeSave = async (postId, user) => {
        try {
            // Step 1: Find and delete the save from Firebase
            const saveToDeleteQuery = query(
                savesRef,
                where("postId", "==", postId),
                where("userId", "==", user?.userId)
            )

            const saveToDeleteData = await getDocs(saveToDeleteQuery)
            const saveId = saveToDeleteData.docs[0].id
            const saveToDelete = doc(db, "saves", saveId)

            await deleteDoc(saveToDelete)
            
            if (user) {
                // Step 2: Remove the save from the specific post's saves array
                setPosts(prevPosts => 
                    prevPosts.map(post => 
                        post.id === postId 
                            ? { 
                                ...post, 
                                saves: (post.saves || []).filter(save => save.saveId !== saveId)
                              }
                            : post
                    )
                )
            }
        } catch (err) {
            console.error(err)
        }
    }

    // NEW: Check if user has saved a post
    const hasUserSaved = (post, user) => {
        return post.saves?.find((save) => save.userId === user?.userId)
    }

    // NEW: Get saved posts for a user
    const getSavedPosts = async (user) => {
        try {
            const savedPostsQuery = query(
                savesRef,
                where("userId", "==", user?.userId)
            )
            const savedPostsData = await getDocs(savedPostsQuery)
            const savedPostIds = savedPostsData.docs.map(doc => doc.data().postId)
            
            // Filter posts to only include saved ones
            return posts.filter(post => savedPostIds.includes(post.id))
        } catch (err) {
            console.error(err)
            return []
        }
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
            // REMOVED: likes, getLikes (no longer needed)
            // ADDED: addLike, removeLike, hasUserLiked (updated versions)
            addLike, removeLike, hasUserLiked,
            // NEW: Save functionality
            addSave, removeSave, hasUserSaved, getSavedPosts
        }}>
            {children}
        </DataContext.Provider>
    )
}