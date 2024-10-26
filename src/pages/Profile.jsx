import React, { useContext, useState, useEffect } from "react";
import Feed from "../components/Feed";
import Nav from "../components/Nav";
import PostForm from "../components/PostForm";
import DataContext from "../context/DataContext"
import { AuthContext } from "../context/AuthContext";
import { storage } from "../config/firebase";   
import { ref, uploadBytesResumable, getDownloadURL, listAll } from "firebase/storage";
import { useParams } from "react-router-dom";
import Post from "../components/Post";

const Profile = () => {
    const { posts } = useContext(DataContext)
    const { user } = useContext(AuthContext) 

    const [image, setImage] = useState(null)
    const [url, setUrl] = useState("")
    const [progress, setProgress] = useState(0)
    const [bio, setBio] = useState("")
    const [userData, setUserData] = useState({})
    const [isEditing, setIsEditing] = useState(false)

    const { username } = useParams()
  
    const handleImageChange = e => {
      if (e.target.files[0]) {
        setImage(e.target.files[0])
      }
    };

    const handleBioChange = (e) => {
        setBio(e.target.value)
    }
  
    const handleUpload = async () => {
        /* This line creates a reference to the location where the image will be stored in Firebase Storage. 
        The ref() function takes two arguments: the storage instance and the path where the file will be 
        stored. In this case, the image will be stored in the "images" folder and the name of the image 
        will be the original name of the file. */
        console.log(user.userId)
        const storageRef = ref(storage, `users/${user.userId}/${image.name}`)
        console.log(storageRef)

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
                    const url = await getDownloadURL(ref(storage, `users/${user.userId}/${image.name}`));

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

    const getImageUrl = async () => {
        const userRef = ref(storage, `users/${user.userId}`)

        try {
            const res = await listAll(userRef)
            if (res.items.length > 0) {
                const url = await getDownloadURL(res.items[0])
                setUrl(url)
            } else {
                /* This should return a default pic. */
                return null
            }
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        if (user) {
            getImageUrl()
        }
    }, [user])

    /* useEffect hook to fetch user data when the component mounts or when the username changes */
    useEffect(() => {
        /* Define an asynchronous function to fetch user data */
        const fetchData = async () => {
            /* Get the user document from Firestore using the username */
            const userDoc = await firestore.collection('usernames').doc(username).get()
            /* If the document exists, update the userData state with the fetched data */
            if (userDoc.exists) {
                const data = userDoc.data()
                console.log(userDoc.data())
                setUserData(data)
                setBio(data.bio)
            } else {
                /* If the document doesn't exist, log an error message */
                console.log('No such document!')
            }
        };
        /* Call the fetchData function */
        fetchData()
        /* Dependency array ensures this runs when the username changes */
    }, [username])
      
        /* If the userData state is null, display a loading message */
    if (!userData) {
        return <div>Loading...</div>
    }
  
    return (
        <main className="flex h-screen max-w-7xl mx-auto py-0 px-3">
            <div id="left-sidebar" className="flex-auto min-w-60 mt-5 px-5 border">
                <Nav />
            </div>
            <div id="profile-main-content">
                <div id="profile-bio">
                    <div id="img-con">
                        {progress > 0 && progress < 100 && <progress value={progress} max="100" />}
                        <input type="file" onChange={handleImageChange} />
                        <button onClick={handleUpload}>Upload</button>
                        {url && <img src={url} className="w-24 h-24 rounded-full" alt="uploaded" />}
                    </div>
                    <div id="profile-username">{user.username}</div>
                    {/* Add a bio section that allows the user to write a brief description about themselves. 
                    Also needs to pull in the users bio information from firebase if there is any. */}
                    <div id="bio">
                        <p>
                            {userData.bio ? userData.bio : "No bio available"}
                        </p>
                    </div>
                </div>
                <PostForm />
                {/* Add two tabs that switch between the users posts and likes. */}
                <div id="profile-tabs" className="flex justify-evenly border-b border-black">
                    <button>Posts</button>
                    <button>Likes</button>
                </div>
                {/* I need the Feed component to display only the posts made by the user associated 
                with the profile. Mya need a seperate Feed component if I can't get it to dynamically
                adjust. */}
                <div>
                    {userData?.posts.map(post => (<Post key={post.id} post={post} />)) || <p>No posts yet</p>}
                </div>
            </div>
            <div id="right-sidebar" className="flex-auto min-w-60 mt-5 px-5 border"></div>
        </main>
    )
}

export default Profile