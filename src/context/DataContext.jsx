import { createContext, useEffect, useState } from "react";
import api from '../api/postsAxios'
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns'

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
            navigate('/')
        } catch(err) {
            console.log(`Error: ${err}`)
        }
    }

    return (
        <DataContext.Provider value={{
            posts, setPosts, navigate, postContent, setPostContent
        }}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContext