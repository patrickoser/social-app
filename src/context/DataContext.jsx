import { createContext, useEffect, useState } from "react";
import api from '../api/postsAxios'
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns'

const DataContext = createContext({})

export const DataProvider = ({ children }) => {
    return (
        <DataContext.Provider value={{
            posts, setPosts
        }}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContext