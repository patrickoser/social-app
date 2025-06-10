import React from "react";
import Nav from "../components/Nav";
import CurrentUserInfo from "../components/CurrentUserInfo";

const Contact = () => {
    return (
        <main className="flex h-screen max-w-7xl mx-auto py-0 px-3">
            <div id="left-sidebar" className="flex-auto min-w-60 mt-5 px-5 border">
                <Nav />
            </div>
            <div id="contact-main-content" className="flex-initial w-6/12 mt-5 px-5 text-center border">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-4">Need to get in touch?</h1>
                    <p className="text-gray-700">Notice something about the site that isn't working 
                        the way it should, have an idea how it could be better, 
                        or just need to talk? Send me a message with your contact
                        information I will get back to you ASAP.
                    </p>
                </div>
                <div>
                    <form action="https://formsubmit.co/patrick.oser1@gmail.com" method="POST" className="max-w-lg mx-auto">
                        <div id="nameCon" className="mb-4">
                            <label className="block text-left mb-2">Name:</label>
                            <input 
                                type="text"
                                name="name"
                                placeholder="Your name"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                                required
                            />
                        </div>
                        <div id="emailCon" className="mb-4">
                            <label className="block text-left mb-2">Email</label>
                            <input 
                                type="text"
                                name="email"
                                placeholder="Your email"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                                required
                            />
                        </div>
                        <div id="messageCon" className="mb-4">
                            <label className="block text-left mb-2">Message</label>
                            <textarea 
                                type="textarea"
                                name="message"
                                id="message"
                                placeholder="Your message"
                                cols="30"
                                rows="10"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5"
                                required
                            />
                        </div>
                        <input type="hidden" name="_captcha" value={false} />
                        <button 
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 ml-2"
                        >Submit</button>
                    </form>
                </div>
            </div>
            <div id="right-sidebar" className="flex-auto min-w-60 mt-5 px-5 border">
                <CurrentUserInfo />
            </div>
        </main>
    )
}

export default Contact