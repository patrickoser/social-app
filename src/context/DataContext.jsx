import { createContext, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns'
import { db } from "../config/firebase"
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore"
import { AuthContext } from "./AuthContext";

export const DataContext = createContext({})

export const DataProvider = ({ children }) => {

    const navigate = useNavigate()
    const [posts, setPosts] = useState([])
    const [postContent, setPostContent] = useState('')
    const postsCollectionRef = collection(db, "posts")
    const [isLoading, setIsLoading] = useState(true)

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
        setIsLoading(true)
        try {
            const data = await getDocs(postsCollectionRef)
            setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        } catch(err) {
            console.log(err.message)
        } finally {
            setIsLoading(false)
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
            deletePost, getPosts
        }}>
            {children}
        </DataContext.Provider>
    )
}