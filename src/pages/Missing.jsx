import React from "react";
import { Link } from "react-router-dom";
import Home from "./Home";

const Missing = () => {
    return (
        <div>
            <h1>Something went wrong.</h1>
            <h3>Return <Link to={<Home />}>home</Link></h3>
        </div>
    )
}

export default Missing