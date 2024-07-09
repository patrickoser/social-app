import React from "react";

const Contact = () => {
    return (
        <main className="flex justify-center max-w-7xl">
            <section className="w-6/12">
                <h1>Need to get in touch?</h1>
                <p>Notice something about the site that isn't working 
                    the way it should, have an idea how it could be better, 
                    or just need to talk? Send me a message with your contact
                    information I will get back to you ASAP.
                </p>
            </section>
            <section className="w-6/12">
                <form action="https://formsubmit.co/patrick.oser1@gmail.com" method="POST">
                    <div className="nameCon">
                        <label>Name:</label>
                        <input 
                            type="text"
                            name="name"
                            placeholder="Your name"
                            required
                        />
                    </div>
                    <div className="emailCon">
                        <label>Email</label>
                        <input 
                            type="text"
                            name="email"
                            placeholder="Your email"
                            required
                        />
                    </div>
                    <div className="messageCon">
                        <label>Message</label>
                        <input 
                            type="textarea"
                            name="message"
                            id="message"
                            placeholder="Your message"
                            cols="30"
                            rows="10"
                            required
                        />
                    </div>
                    <input type="hidden" name="_captcha" value={false} />
                    <button type="submit">Submit</button>
                </form>
            </section>
        </main>
    )
}

export default Contact