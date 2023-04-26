import { Navigate, Outlet } from "react-router-dom";
import React from "react";

const PrivateRoutes = () => {
    let auth = {'token': localStorage.getItem('token') !== null}
    return(
        auth.token ? <Outlet/> : <Navigate to="/" />
    )
}

export default PrivateRoutes