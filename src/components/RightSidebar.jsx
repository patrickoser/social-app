import React from "react";
import CurrentUserInfo from "./CurrentUserInfo";

const RightSidebar = () => {
    return (
        <section id="right-sidebar" className="hidden md:block w-3/12 min-w-60 mt-5 px-5 bg-white dark:bg-gray-800">
            <CurrentUserInfo />
        </section>
    )
}

export default RightSidebar