import React, { useContext, useState, useEffect } from "react";
import PostForm from "../components/PostForm";
import { DataContext } from "../context/DataContext";
import { AuthContext } from "../context/AuthContext";
import { storage, db } from "../config/firebase"; 
import { doc, getDoc, updateDoc, collection, getDocs, query, where } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useParams } from "react-router-dom";
import Post from "../components/Post";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import MobileNav from "../components/MobileNav";
import ProfilePicture from "../components/ProfilePicture";
import { useProfilePicture } from "../context/ProfilePictureContext";
import GuestIndicator from "../components/GuestIndicator";
import { isGuestUser, getGuestData, GUEST_KEYS } from "../utils/guestUtils";

const Profile = () => {
    const { user } = useContext(AuthContext) 
    const { posts, postIsLoading } = useContext(DataContext)
    const { getProfilePicture } = useProfilePicture();
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)
    const [bio, setBio] = useState("")
    const [userData, setUserData] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [userPosts, setUserPosts] = useState([])
    const [error, setError] = useState(null)
    const [likedPosts, setLikedPosts] = useState([])
    const [activeTab, setActiveTab] = useState("posts")
    const [uploadError, setUploadError] = useState('')

    const { username } = useParams()

    /* File upload restrictions */
    const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
    const MAX_DIMENSIONS = { width: 2048, height: 2048 }

    const validateFile = (file) => {
        setUploadError('')
        
        /* Check file type */
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            setUploadError('Please select a valid image file (JPEG, PNG, GIF, or WebP).')
            return false
        }
        
        /* Check file extension */
        const fileName = file.name.toLowerCase()
        const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext))
        
        if (!hasValidExtension) {
            setUploadError('File must have a valid image extension (.jpg, .jpeg, .png, .gif, .webp).')
            return false
        }
        
        /* Check file size */
        if (file.size > MAX_FILE_SIZE) {
            setUploadError(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB.`)
            return false
        }
        
        /* Check image dimensions (optional - for performance) */
        return new Promise((resolve) => {
            const img = new Image()
            img.onload = () => {
                if (img.width > MAX_DIMENSIONS.width || img.height > MAX_DIMENSIONS.height) {
                    setUploadError(`Image dimensions must be ${MAX_DIMENSIONS.width}x${MAX_DIMENSIONS.height} or smaller.`)
                    resolve(false)
                } else {
                    resolve(true)
                }
            }
            img.onerror = () => {
                setUploadError('Invalid image file. Please select a valid image.')
                resolve(false)
            }
            img.src = URL.createObjectURL(file)
        })
    }

    const handleImageChange = async (e) => {
        const file = e.target.files[0]
        if (file) {
            const isValid = await validateFile(file)
            if (isValid) {
                setImage(file)
            } else {
                /* Clear the file input */
                e.target.value = ''
                setImage(null)
            }
        }
    }

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
                    
                    // Update the profile picture cache after upload
                    await getProfilePicture(user.userId);
                    
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

    const getProfilePosts = () => {
        /* For guest users, get posts from sessionStorage */
        if (isGuestUser(user) && username === user?.username) {
            const guestPosts = getGuestData(GUEST_KEYS.POSTS, []);
            setUserPosts(guestPosts);
        } else {
            const profilePosts = posts.filter(post => post.username === username)
            setUserPosts(profilePosts)
        }
    }

    const getProfileLikes = async () => {
        /* For guest users, get likes from sessionStorage */
        if (isGuestUser(user) && username === user?.username) {
            const guestLikes = getGuestData(GUEST_KEYS.LIKES, []);
            
            // Get the posts that were liked (from both regular posts and guest posts)
            const likedPostIds = guestLikes.map(like => like.postId);
            const guestPosts = getGuestData(GUEST_KEYS.POSTS, []);
            const allPosts = [...posts, ...guestPosts];
            const likedPostsData = allPosts.filter(post => likedPostIds.includes(post.id));
            setLikedPosts(likedPostsData);
        } else {
            try {
                const likesRef = collection(db, "likes")
                const q = query(likesRef, where("username", "==", username))
                const querySnapshot = await getDocs(q)
                
                const likes = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    likeId: doc.id
                }))

                // Get the posts that were liked
                const likedPostIds = likes.map(like => like.postId)
                const likedPostsData = posts.filter(post => likedPostIds.includes(post.id))
                setLikedPosts(likedPostsData)
            } catch (err) {
                console.error("Error fetching likes:", err)
            }
        }
    }

    /* useEffect hook to fetch user data when the component mounts or when the username changes */
    useEffect(() => {
        /* Define an asynchronous function to fetch user data */
        const fetchData = async () => {
            setError(null)
            
            /* Check if this is a guest user trying to access their own profile */
            if (isGuestUser(user) && username === user?.username) {
                /* For guest users, create mock user data */
                const guestData = {
                    userId: user.userId,
                    username: user.username,
                    bio: 'This is a guest account. Sign up to create a permanent profile!',
                    isGuest: true
                };
                setUserData(guestData);
                setBio(guestData.bio);
                return;
            }
            
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
    }, [username, user]);

    useEffect(() => {
        if (username && posts) {
            getProfilePosts()
            getProfileLikes()
        }
    }, [username, posts])

    return (
        <>
            <main className="flex flex-col md:flex-row max-w-7xl mx-auto py-0 px-3">
                {postIsLoading ? (
                    <h3 className="text-gray-900 dark:text-white">Loading...</h3>
                ) : error ? (
                    <h3 className="text-red-600 dark:text-red-400">{error}</h3>
                ) : userData ? (
                    <>
                        <LeftSidebar />
                        <section className="flex-1 w-full md:w-6/12 mt-5 px-3 md:px-5 text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-t border-gray-300 dark:border-gray-700 pb-20 md:pb-0">
                            {/* Guest mode comment: Show guest indicator when in guest mode */}
                            <GuestIndicator />
                            <div id="profile-bio" className="flex flex-col items-center p-4 border-b border-gray-300 dark:border-gray-700">
                                <div id="img-con" className="flex flex-col items-center mb-4">
                                    {progress > 0 && progress < 100 && (
                                        <div className="w-full mb-2">
                                            <progress value={progress} max="100" />
                                        </div>
                                    )}
                                    {username === user?.username && !isGuestUser(user) && (
                                        <div className="flex items-center gap-4 mb-4">
                                            <input 
                                                type="file" 
                                                onChange={handleImageChange} 
                                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                                className="text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
                                            />
                                            <button 
                                                onClick={handleImageUpload}
                                                disabled={!image}
                                                className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Upload
                                            </button>
                                        </div>
                                    )}
                                    {uploadError && (
                                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                            <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>
                                        </div>
                                    )}
                                    <ProfilePicture userId={userData.userId} size="2xl" />
                                </div>
                                <div id="profile-username" className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                                    {username}
                                </div>
                                <div id="bio-edit" className="w-full max-w-2xl">
                                    {isEditing ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <textarea 
                                                value={bio} 
                                                onChange={handleBioChange} 
                                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                rows="4"
                                                placeholder="Tell us about yourself..."
                                            />
                                            <button 
                                                onClick={handleBioUpload}
                                                className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700"
                                            >
                                                Save Bio
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-4">
                                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{bio}</p>
                                            {username === user?.username && !isGuestUser(user) && (
                                                <button 
                                                    onClick={() => setIsEditing(true)}
                                                    className="px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 focus:ring-4 focus:ring-blue-300"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                {username === user?.username && <PostForm />}
                            </div>
                            <div id="profile-tabs" className="flex justify-evenly border-b border-gray-300 dark:border-gray-700">
                                <button 
                                    onClick={() => setActiveTab('posts')}
                                    className={`px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white ${
                                        activeTab === 'posts' ? 'border-b-2 border-blue-500 dark:border-blue-400' : ''
                                    }`}
                                >
                                    Posts
                                </button>
                                <button 
                                    onClick={() => setActiveTab('likes')}
                                    className={`px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white ${
                                        activeTab === 'likes' ? 'border-b-2 border-blue-500 dark:border-blue-400' : ''
                                    }`}
                                >
                                    Likes
                                </button>
                            </div>
                            <div className="mt-4">
                                {activeTab === 'posts' ? (
                                    userPosts.length > 0 ? (
                                        userPosts.map(post => <Post key={post.id} post={post} />)
                                    ) : (
                                        <p className="text-gray-700 dark:text-gray-300">No posts to display</p>
                                    )
                                ) : (
                                    likedPosts.length > 0 ? (
                                        likedPosts.map(post => <Post key={post.id} post={post} />)
                                    ) : (
                                        <p className="text-gray-700 dark:text-gray-300">No liked posts to display</p>
                                    )
                                )}
                            </div>
                        </section>
                        <RightSidebar />
                    </>
                ) : (
                    <h3 className="text-gray-900 dark:text-white">User not found...</h3>
                )}
            </main>
            <MobileNav />
        </>
    )
}

export default Profile