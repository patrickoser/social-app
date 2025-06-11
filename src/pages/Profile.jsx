import React, { useContext, useState, useEffect } from "react";
import Nav from "../components/Nav";
import PostForm from "../components/PostForm";
import CurrentUserInfo from "../components/CurrentUserInfo";
import { DataContext } from "../context/DataContext";
import { AuthContext } from "../context/AuthContext";
import { storage, db } from "../config/firebase"; 
import { doc, getDoc, updateDoc, collection, getDocs, query, where } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, listAll } from "firebase/storage";
import { useParams } from "react-router-dom";
import Post from "../components/Post";

const Profile = () => {
    const { user } = useContext(AuthContext) 
    const { posts, postIsLoading } = useContext(DataContext)
    const [activeTab, setActiveTab] = useState("posts")
    const [image, setImage] = useState(null)
    const [url, setUrl] = useState("")
    const [progress, setProgress] = useState(0)
    const [bio, setBio] = useState("")
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
            setError(null)
            /* Get the user document from Firestore using the username */
            try {
                const userDocRef = doc(db, 'usernames', username);
                const userDoc = await getDoc(userDocRef);
                /* If the document exists, update the userData state with the fetched data */
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setUserData(data);
                    setBio(data.bio || 'Add bio here...');
                } else {
                    /* If the document doesn't exist, log an error message */
                    setUserData(null)
                    setError('User not found')
                }
            } catch (error) {
                /* If there is an error, log the error message */
                setUserData(null)
                setError('Error fetching user data')
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
            {postIsLoading ? (
                <h3>Loading...</h3>
            ) : error ? (
                <h3>{error}</h3>
            ) : userData ? (
                <>
                    <div id="left-sidebar" className="w-3/12 min-w-60 mt-5 px-5 border">
                        <Nav />
                    </div>
                    <div id="profile-main-content"  >
                        <div id="profile-bio" className="flex flex-col items-center p-4 border-b border-black">
                            <div id="img-con" className="flex flex-col items-center mb-4">
                                {progress > 0 && progress < 100 && (
                                    <div className="w-full mb-2">
                                        <progress value={progress} max="100" />
                                    </div>
                                )}
                                <div className="flex items-center gap-4 mb-4">
                                    <input 
                                        type="file" 
                                        onChange={handleImageChange} 
                                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    <button 
                                        onClick={handleImageUpload}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
                                    >
                                        Upload
                                    </button>
                                </div>
                                {url && (
                                    <img 
                                        src={url} 
                                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-200" 
                                        alt="uploaded" 
                                    />
                                )}
                            </div>
                            <div id="profile-username" className="text-2xl font-bold mb-4">
                                {username}
                            </div>
                            <div id="bio-edit" className="w-full max-w-2xl">
                                {isEditing ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <textarea 
                                            value={bio} 
                                            onChange={handleBioChange} 
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            rows="4"
                                            placeholder="Tell us about yourself..."
                                        />
                                        <button 
                                            onClick={handleBioUpload}
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
                                        >
                                            Save Bio
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-4">
                                        <p className="text-gray-700 whitespace-pre-wrap">{bio}</p>
                                        <button 
                                            onClick={() => setIsEditing(true)}
                                            className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 focus:ring-4 focus:ring-blue-300"
                                        >
                                            Edit
                                        </button>
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
                    <div id="right-sidebar" className="w-3/12 min-w-60 mt-5 px-5 border">
                        <CurrentUserInfo />
                    </div>
                </>
            ) : (
                <h3>User not found...</h3>
            )}
        </main> 
    )
}

export default Profile