import React from "react";
import CurrentUserInfo from "./CurrentUserInfo";

const RightSidebar = () => {
    return (
        <section id="right-sidebar" className="w-3/12 min-w-60 mt-5 px-5 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
            <CurrentUserInfo />
        </section>
    )
}

export default RightSidebar 