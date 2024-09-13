import React, { useContext } from "react";
import Feed from "../components/Feed";
import Nav from "../components/Nav";
import PostForm from "../components/PostForm";
import DataContext from "../context/DataContext"
import { AuthContext } from "../context/AuthContext";

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
  
    const handleUpload = () => {
      const uploadTask = firebase.storage().ref(`images/${image.name}`).put(image);
  
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
        () => {
          firebase.storage()
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then(url => {
              setUrl(url);
            });
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
                    <progress value={progress} max="100" />
                    <input type="file" onChange={handleChange} />
                    <button onClick={handleUpload}>Upload</button>
                    {url && <img src={url} alt="uploaded" />}
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