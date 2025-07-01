import React from "react";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import Nav from "../components/Nav";

const Contact = () => {
    return (
        <>
            <main className="flex flex-col md:flex-row max-w-7xl mx-auto py-0 px-3">
                <LeftSidebar />
                <section className="flex-1 w-full md:w-6/12 mt-5 px-3 md:px-5 pt-3 text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-t border-b border-gray-300 dark:border-gray-700 pb-20 md:pb-6">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Need to get in touch?</h1>
                        <p className="text-gray-700 dark:text-gray-300">Notice something about the site that isn't working 
                            the way it should, have an idea how it could be better, 
                            or just need to talk? Send me a message with your contact
                            information I will get back to you ASAP.
                        </p>
                    </div>
                    <div>
                        <form action="https://formsubmit.co/patrick.oser1@gmail.com" method="POST" className="max-w-lg mx-auto">
                            <div id="nameCon" className="mb-4">
                                <label className="block text-left mb-2 text-gray-900 dark:text-white">Name:</label>
                                <input 
                                    type="text"
                                    name="name"
                                    placeholder="Your name"
                                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                                    required
                                />
                            </div>
                            <div id="emailCon" className="mb-4">
                                <label className="block text-left mb-2 text-gray-900 dark:text-white">Email</label>
                                <input 
                                    type="text"
                                    name="email"
                                    placeholder="Your email"
                                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                                    required
                                />
                            </div>
                            <div id="messageCon" className="mb-4">
                                <label className="block text-left mb-2 text-gray-900 dark:text-white">Message</label>
                                <textarea 
                                    type="textarea"
                                    name="message"
                                    id="message"
                                    placeholder="Your message"
                                    cols="30"
                                    rows="10"
                                    className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                                    required
                                />
                            </div>
                            <input type="hidden" name="_captcha" value={false} />
                            <button 
                                type="submit"
                                className="text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 ml-2"
                            >Submit</button>
                        </form>
                    </div>
                </section>
                <RightSidebar />
            </main>
            <Nav mobileOnly={true} />
        </>
    )
}

export default Contact