import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns'
import { db } from "../config/firebase"
import { collection, getDocs } from "firebase/firestore"

const DataContext = createContext({})

export const DataProvider = ({ children }) => {

    const [posts, setPosts] = useState([])
    const navigate = useNavigate()
    const [postContent, setPostContent] = useState('')

    const createPost = async (e) => {
        e.preventDefault()
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

    useEffect(() => {
        const getPosts = async () => {
            try {
                const response = await api.get('/posts')
                setPosts(response.data)
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