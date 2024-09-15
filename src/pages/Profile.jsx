import React, { useContext, useState } from "react";
import Feed from "../components/Feed";
import Nav from "../components/Nav";
import PostForm from "../components/PostForm";
import DataContext from "../context/DataContext"
import { AuthContext } from "../context/AuthContext";
import firebase from "firebase/compat/app";

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
        /* Refrencing firebase in this way isn't how I want to do it. Might be 
        casuing issue elsewhere as well. */
      const uploadTask = storage.ref(`images/${image.name}`).put(image);
  
      uploadTask.on(
        "state_changed",
        snapshot => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        err => {
          console.log(err);
        },
        async () => {
            try {
              const url = await firebase.storage()
                .ref("images")
                .child(image.name)
                .getDownloadURL();
              setUrl(url);
            } catch (error) {
              console.log(error);
            } finally {
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
                    <div>Posts</div>
                    <div>Likes</div>
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