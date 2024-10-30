import { createContext, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns'
import { db } from "../config/firebase"
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore"
import { AuthContext } from "./AuthContext";

const DataContext = createContext({})

export const DataProvider = ({ children }) => {

    const navigate = useNavigate()
    const [posts, setPosts] = useState([])
    const [postContent, setPostContent] = useState('')
    const postsCollectionRef = collection(db, "posts")

    const { user } = useContext(AuthContext)

    const createPost = async (e) => {
        e.preventDefault()
        // id may not be needed anymore
        const id = posts.length ? posts[posts.length - 1].id + 1 : 1
        const datetime = format(new Date(), 'MMMM dd yyyy pp')
        try {
            await addDoc(postsCollectionRef, { 
                username: user.username, 
                content: postContent, 
                datetime: datetime, 
                id: id
            })
        } catch(err) {
            console.error(err)
        }
    }

    const deletePost = async (id) => {
        console.log(id)
        try {
            const postDoc = doc(db, "posts", id)
            await deleteDoc(postDoc)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        const getPosts = async () => {
            try {
                const data = await getDocs(postsCollectionRef)
                setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            } catch(err) {
                console.log(err.message)
            }
        }

        getPosts()
    }, [])

    return (
        <DataContext.Provider value={{
            posts, setPosts, navigate, postContent, setPostContent, createPost,
            deletePost
        }}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContext

/*  const createPost = async () => {
        const id = posts.length ? posts[posts.length - 1].id + 1 : 1
        const datetime = format(new Date(), 'MMMM dd yyyy pp')
        const newPost = { id, content: postContent, datetime }
        try {
            const response = await api.post('/posts', newPost)
            const allPosts = [...posts, response.data]
            setPosts(allPosts)
            setPostContent('')
        } catch(err) {
            console.log(`Error: ${err}`)
        }
    }    

    const deletePost = async (id) => {
        console.log(id)
        try {
            await api.delete(`/posts/${id}`)
            setPosts(posts.filter((post) => post.id !== id))
            navigate('/home')
        } catch(err) {
            console.log(err)
        }
    }
*/