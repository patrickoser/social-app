import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoutes = () => {
    const { user } = useContext(AuthContext)

    /* 'Navigate' will direct the page anywhere specified by the
    'to' prop. 'Replace' makes sure the history stack is
    altered in a way so that the user can't press the back
    button and return to the protected page. */
    return (
        !user ? <Navigate to="/signup" replace /> : <Outlet />
    )
}