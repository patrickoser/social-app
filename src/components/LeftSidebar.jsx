import React from "react";
import Nav from "./Nav";

const LeftSidebar = () => {
    return (
        <section id="left-sidebar" className="hidden md:block w-3/12 min-w-60 mt-5 px-5 bg-white dark:bg-gray-800">
            <Nav />
        </section>
    )
}

export default LeftSidebar