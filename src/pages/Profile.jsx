import React, { useContext, useState, useEffect } from "react";
import Nav from "../components/Nav";
import PostForm from "../components/PostForm";
import { DataContext } from "../context/DataContext";
import { AuthContext } from "../context/AuthContext";
import { storage, db } from "../config/firebase"; 
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, listAll } from "firebase/storage";
import { useParams } from "react-router-dom";
import Post from "../components/Post";

const Profile = () => {
    const { user } = useContext(AuthContext) 
    const { posts } = useContext(DataContext)

    const [image, setImage] = useState(null)
    const [url, setUrl] = useState("")
    const [progress, setProgress] = useState(0)
    const [bio, setBio] = useState("")
    const [postIsLoading, setPostIsLoading] = useState(true)
    const [userIsLoading, setUserIsLoading] = useState(true)
    const [userData, setUserData] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [userPosts, setUserPosts] = useState([])
    const [error, setError] = useState(null)

    const { username } = useParams()
  
    const handleImageChange = e => {
      if (e.target.files[0]) {
        setImage(e.target.files[0])
      }
    };

    const handleBioChange = (e) => {
        setBio(e.target.value)
    }

    const handleBioUpload = async () => {
        try {
            const userDoc = doc(db, 'usernames', username);
            await updateDoc(userDoc, { bio });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating bio:', error);
        }
    }

    /* If userPosts is not empty then map over the posts and display them */
    const handlePosts = () => {
        {userPosts.length === 0 ? (
            <p>You have not created any posts yet.</p>
            ) : (
            userPosts.map((post) => <Post key={post.id} post={post} />)
            )}
    }
  
    const handleImageUpload = async () => {
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

    /* Use posts context to pull in posts and filter for the user's posts. */
    const getUserPosts = () => {
        return posts.filter(post => post.userId === user.userId)
    }

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
            setUserIsLoading(true)
            setError(null)
            console.log('Fetching data for username:', username);
            /* Get the user document from Firestore using the username */
            try {
                const userDocRef = doc(db, 'usernames', username);
                const userDoc = await getDoc(userDocRef);
                console.log('User document exists:', userDoc.exists());
                /* If the document exists, update the userData state with the fetched data */
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    console.log('User data:', data);
                    setUserData(data);
                    setBio(data.bio || 'Add bio here...');
                } else {
                    /* If the document doesn't exist, log an error message */
                    console.log('No user document found for username:', username);
                    setUserData(null)
                }
            } catch (error) {
                /* If there is an error, log the error message */
                console.log('Error getting document:', error);
                setUserData(null)
            } finally {
                setUserIsLoading(false)
            }
        };
        /* Call the fetchData function */
        if (username) {
            fetchData()
        }
        /* Dependency array ensures this runs when the username changes */
    }, [username]);

    /* useEffect hook to fetch user posts when the user/posts state changes */
    useEffect(() => {
        if (user) {
            const userPosts = getUserPosts()
            setUserPosts(userPosts)
        }
    }, [user, posts])
  
    return (
        <main className="flex h-screen max-w-7xl mx-auto py-0 px-3">
            {userIsLoading || postIsLoading ? (
                <h3>Loading...</h3>
            ) : error ? (
                <h3>{error}</h3>
            ) : userData ? (
                <>
                    <div id="left-sidebar" className="flex-auto min-w-60 mt-5 px-5 border">
                        <Nav />
                    </div>
                    <div id="profile-main-content">
                        <div id="profile-bio">
                            <div id="img-con">
                                {progress > 0 && progress < 100 && <progress value={progress} max="100" />}
                                <input type="file" onChange={handleImageChange} />
                                <button onClick={handleImageUpload}>Upload</button>
                                {url && <img src={url} className="w-24 h-24 rounded-full" alt="uploaded" />}
                            </div>
                            <div id="profile-username">{username}</div>
                            <div id="bio-edit">
                                {isEditing ? (
                                    <div>
                                        <textarea value={bio} onChange={handleBioChange} />
                                        <button onClick={handleBioUpload}>Save</button>
                                    </div>
                                ) : (
                                    <div>
                                        <p>{bio}</p>
                                        <button onClick={() => setIsEditing(true)}>Edit</button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <PostForm />
                        {/* Add two tabs that switch between the users posts and likes. */}
                        <div id="profile-tabs" className="flex justify-evenly border-b border-black">
                            <button onClick={handlePosts()}>Posts</button>
                            <button>Likes</button>
                        </div>
                            {/* I need the Feed component to display only the posts made by the user associated 
                            with the profile. Mya need a seperate Feed component if I can't get it to dynamically
                            adjust. */}
                        <div>
                            {userPosts ? userPosts.map(post => (<Post key={post.id} post={post} />)) : <p>No posts to display</p>}
                        </div>
                    </div>
                    <div id="right-sidebar" className="flex-auto min-w-60 mt-5 px-5 border"></div>
                </>
            ) : (
                <h3>User not found...</h3>
            )}
        </main> 
    )
}

export default Profile