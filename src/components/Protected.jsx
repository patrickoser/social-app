import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"
import { Navigate } from "react-router-dom";

const Protected = ({children}) => {
    const { user } = useContext(AuthContext)

    !user ? <Navigate to="/signup" replace /> : children
}

export default Protected