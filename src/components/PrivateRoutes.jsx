import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoutes = () => {
    const { user } = useContext(AuthContext)

    /* Auth check. If user is not logged in, redirect to signup page. If they
    they are logged in, show the protected page they are requesting.
    Replace is used to prevent the user from going back to the protected page. */
    return (
        !user ? <Navigate to="/signup" replace /> : <Outlet />
    )
}