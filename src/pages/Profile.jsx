import React, { useContext, useState } from "react";
import Feed from "../components/Feed";
import Nav from "../components/Nav";
import PostForm from "../components/PostForm";
import DataContext from "../context/DataContext"
import { AuthContext } from "../context/AuthContext";
import { storage } from "../config/firebase";   
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const Profile = () => {
    const { posts } = useContext(DataContext)
    const { user } = useContext(AuthContext) 

    const [image, setImage] = useState(null);
    const [url, setUrl] = useState(""); 
    const [progress, setProgress] = useState(0);
  
    const handleChange = e => {
      if (e.target.files[0]) {
        setImage(e.target.files[0]);
      }
    };
  
    const handleUpload = async () => {
        /* This line creates a reference to the location where the image will be stored in Firebase Storage. 
        The ref() function takes two arguments: the storage instance and the path where the file will be 
        stored. In this case, the image will be stored in the "images" folder and the name of the image 
        will be the original name of the file. */
        console.log(user)
        const storageRef = ref(storage, `users/${user.uid}/${image.name}`)

        /* This line starts the upload of the image to Firebase Storage. The uploadBytesResumable() 
        function takes two arguments: the storage reference and the file to be uploaded. It returns 
        an UploadTask that you can use to manage and monitor the upload. */
        const uploadTask = uploadBytesResumable(storageRef, image)

        /* This line adds event listeners for the state_changed, error, and complete events of the upload task. */
        uploadTask.on(
            "state_changed",
            snapshot => {
                /* This line calculates the progress of the upload as a percentage. snapshot.bytesTransferred 
                is the number of bytes that have been uploaded so far, and snapshot.totalBytes is the total 
                number of bytes to be uploaded. */
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(progress);
            },
            err => {
                console.log(err);
            },
            async () => {
                try {
                    /* This line gets the download URL of the uploaded image. The getDownloadURL() function 
                    takes a storage reference as its argument and returns a promise that resolves with 
                    the download URL of the file. */
                    const url = await getDownloadURL(ref(storage, `users/${user.uid}/${image.name}`));

                    /* This line updates the url state with the download URL of the uploaded image. */
                    setUrl(url);
                } catch (err) {
                    console.error(err);
                } finally {
                    /* These lines reset the progress and image states after the upload is complete. 
                    This is done in a finally block to ensure that it happens whether the upload 
                    succeeds or fails.*/
                    setProgress(0);
                    setImage(null);
                }
            }
        );
    };
  

    return (
        <main className="flex h-screen max-w-7xl mx-auto py-0 px-3">
            <div id="left-sidebar" className="flex-auto min-w-60 mt-5 px-5 border">
                <Nav />
            </div>
            <div id="profile-main-content">
                <div id="profile-bio">
                    <div id="img-con">
                        {progress > 0 && progress < 100 && <progress value={progress} max="100" />}
                        <input type="file" onChange={handleChange} />
                        <button onClick={handleUpload}>Upload</button>
                        {url && <img src={url} alt="uploaded" />}
                    </div>
                    <div id="profile-username">{user.username}</div>
                    <div id="bio">
                        <p>
                            About me section that gives a brief description about the user 
                            and what they want to tell other people about them. 
                        </p>
                    </div>
                </div>
                {/* Add two tabs that switch between the users posts and likes. */}
                <div id="profile-tabs">
                    <button>Posts</button>
                    <button>Likes</button>
                </div>
                <PostForm />
                <div>
                    <Feed posts={posts} />
                </div>
            </div>
            <div id="right-sidebar" className="flex-auto min-w-60 mt-5 px-5 border"></div>
        </main>
    )
}

export default Profile