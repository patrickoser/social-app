import { createContext, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns'
import { db } from "../config/firebase"
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from "firebase/firestore"
import { AuthContext } from "./AuthContext";
import { isGuestUser, storeGuestData, getGuestData, GUEST_KEYS, generateGuestId } from "../utils/guestUtils";

export const DataContext = createContext({})

export const DataProvider = ({ children }) => {

    const navigate = useNavigate()
    const [posts, setPosts] = useState([])
    const [postContent, setPostContent] = useState('')
    const postsCollectionRef = collection(db, "posts")
    const [postIsLoading, setPostIsLoading] = useState(true)
    
    /* This stays the same - we still use the separate likes collection */
    const likesRef = collection(db, "likes")

    const savesRef = collection(db, "saves")

    const { user } = useContext(AuthContext)

    /* Called from within 'PostForm' component. Adds a new post to the "posts" collection. */
    const createPost = async (e) => {
        e.preventDefault()
        const datetime = format(new Date(), 'MMMM dd yyyy pp')
        
        /* Handle guest post creation differently than Firebase posts */
        if (isGuestUser(user)) {
            /* Create guest post with temporary ID and store in sessionStorage */
            const guestPost = {
                id: generateGuestId(),
                username: user.username,
                userId: user.userId,
                content: postContent,
                datetime: datetime,
                likes: [],
                saves: [],
                isGuest: true
            };
            
            /* Store guest post in sessionStorage */
            const guestPosts = getGuestData(GUEST_KEYS.POSTS);
            const updatedGuestPosts = [...guestPosts, guestPost];
            storeGuestData(GUEST_KEYS.POSTS, updatedGuestPosts);
            
            /* Update local state with guest post */
            setPosts(prevPosts => [...prevPosts, guestPost]);
            setPostContent('');
        } else {
            /* Handle regular Firebase post creation */
            try {
                const docRef = await addDoc(postsCollectionRef, { 
                    username: user.username, 
                    userId: user.userId,
                    content: postContent, 
                    datetime: datetime, 
                })
                const newPost = {
                    id: docRef.id,
                    username: user.username,
                    userId: user.userId,
                    content: postContent,
                    datetime: datetime,
                }
                setPosts(prevPosts =>[...prevPosts, newPost])
                setPostContent('')
            } catch(err) {
                console.error(err)
            }
        }
    }
    
    /* Called within 'PostPage'. Takes in 'id' as a parameter and uses it to find the right
    post in firebase and remove it from the database. */
    const deletePost = async (id) => {
        
        /* Handle guest post deletion from sessionStorage */
        if (isGuestUser(user)) {
            const guestPosts = getGuestData(GUEST_KEYS.POSTS);
            const updatedGuestPosts = guestPosts.filter(post => post.id !== id);
            storeGuestData(GUEST_KEYS.POSTS, updatedGuestPosts);
            
            /* Update local state by removing guest post */
            setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
        } else {
            /* Handle regular Firebase post deletion */
            try {
                const postDoc = doc(db, "posts", id)
                await deleteDoc(postDoc)
                
                /* Also delete associated likes and saves */
                try {
                    // Delete likes for this post
                    const likesQuery = query(likesRef, where("postId", "==", id));
                    const likesSnapshot = await getDocs(likesQuery);
                    const deleteLikesPromises = likesSnapshot.docs.map(doc => deleteDoc(doc.ref));
                    await Promise.all(deleteLikesPromises);
                    
                    // Delete saves for this post
                    const savesQuery = query(savesRef, where("postId", "==", id));
                    const savesSnapshot = await getDocs(savesQuery);
                    const deleteSavesPromises = savesSnapshot.docs.map(doc => deleteDoc(doc.ref));
                    await Promise.all(deleteSavesPromises);
                } catch (err) {
                    console.error("Error deleting associated likes/saves:", err);
                }
                
                /* Update local state by removing the post */
                setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
            } catch (err) {
                console.error(err)
            }
        }
    }

    /* Fetches all posts from Firebase and combines with guest posts if needed */
    const getPosts = async () => {
        setPostIsLoading(true)
        
        try {
            /* Always fetch Firebase posts first */
            const data = await getDocs(postsCollectionRef)
            const fetchedPosts = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            
            /* Attach likes and saves to posts */
            await attachLikesToPosts(fetchedPosts)
            await attachSavesToPosts(fetchedPosts)
            
            /* Add guest posts if user is a guest */
            if (isGuestUser(user)) {
                const guestPosts = getGuestData(GUEST_KEYS.POSTS);
                const combinedPosts = [...fetchedPosts, ...guestPosts];
                setPosts(combinedPosts);
            } else {
                setPosts(fetchedPosts);
            }
        } catch(err) {
            console.log(err.message)
        } finally {
            setPostIsLoading(false)
        }
    }

    /* Takes all posts and attaches their respective likes to each post object */
    const attachLikesToPosts = async (postsToUpdate) => {
        try {
            /* Fetch ALL likes from Firebase in one query */
            const allLikes = await getDocs(likesRef)
            const likesByPost = {}
            
            /* Group likes by postId, organize likes by which post they belong to. */
            allLikes.docs.forEach(doc => {
                const like = { ...doc.data(), likeId: doc.id }
                if (!likesByPost[like.postId]) {
                    likesByPost[like.postId] = []
                }
                likesByPost[like.postId].push(like)
            })
            
            /* This transforms: [{id: 'post1', content: '...'}] 
            Into: [{id: 'post1', content: '...', likes: [like1, like2, like3]}] */
            setPosts(postsToUpdate.map(post => ({
                ...post,
                likes: likesByPost[post.id] || [] /* If no likes, use empty array */
            })))
        } catch (err) {
            console.error(err)
        }
    }

    /* Similar to attachLikesToPosts but for saves */
    const attachSavesToPosts = async (postsToUpdate) => {
        try {
            /* Fetch ALL saves from Firebase in one query */
            const allSaves = await getDocs(savesRef)
            const savesByPost = {}
            
            /* Group saves by postId, organize saves by which post they belong to. */
            allSaves.docs.forEach(doc => {
                const save = { ...doc.data(), saveId: doc.id }
                if (!savesByPost[save.postId]) {
                    savesByPost[save.postId] = []
                }
                savesByPost[save.postId].push(save)
            })
            
            /* Attach the grouped saves to each post */
            setPosts(prevPosts => prevPosts.map(post => ({
                ...post,
                saves: savesByPost[post.id] || [] /* If no saves, use empty array */
            })))
        } catch (err) {
            console.error(err)
        }
    }

    /* Updates the specific post's likes array instead of global likes state */
    const addLike = async (postId, user) => {
        /* Handle guest likes in sessionStorage */
        if (isGuestUser(user)) {
            const guestLikes = getGuestData(GUEST_KEYS.LIKES);
            const newLike = {
                likeId: generateGuestId(),
                userId: user.userId,
                username: user.username,
                postId: postId
            };
            
            const updatedGuestLikes = [...guestLikes, newLike];
            storeGuestData(GUEST_KEYS.LIKES, updatedGuestLikes);
            
            /* Update local state with guest like */
            setPosts(prevPosts => 
                prevPosts.map(post => 
                    post.id === postId 
                        ? { 
                            ...post, 
                            likes: [...(post.likes || []), newLike]
                          }
                        : post
                )
            );
        } else {
            /* Handle regular user Firebase like */
            try {
                /* Add like to Firebase (unchanged) */
                const newDoc = await addDoc(likesRef, {
                    userId: user?.userId,
                    username: user?.username,
                    postId: postId
                })
                
                if (user) {
                    /* Update the specific post's likes in local state */
                    setPosts(prevPosts => 
                        prevPosts.map(post => 
                            post.id === postId 
                                ? { 
                                    ...post, 
                                    /* Spread existing likes and add the new one */
                                    likes: [...(post.likes || []), {
                                        userId: user.userId, 
                                        username: user.username, 
                                        likeId: newDoc.id
                                    }]
                                  }
                                : post /* Else, leave other posts unchanged */
                        )
                    )
                }
            } catch (err) {
                console.error(err)
            }
        }
    }

    /* Removes from the specific post's likes array instead of global likes state */
    const removeLike = async (postId, user) => {
        /* Handle guest unlikes in sessionStorage */
        if (isGuestUser(user)) {
            const guestLikes = getGuestData(GUEST_KEYS.LIKES);
            const updatedGuestLikes = guestLikes.filter(like => 
                !(like.postId === postId && like.userId === user.userId)
            );
            storeGuestData(GUEST_KEYS.LIKES, updatedGuestLikes);
            
            /* Update local state by removing guest like */
            setPosts(prevPosts => 
                prevPosts.map(post => 
                    post.id === postId 
                        ? { 
                            ...post, 
                            likes: (post.likes || []).filter(like => 
                                !(like.userId === user.userId)
                            )
                          }
                        : post
                )
            );
        } else {
            /* Handle regular Firebase unlike */
            try {
                /* Find and delete the like from Firebase */
                const likeToDeleteQuery = query(
                    likesRef,
                    where("postId", "==", postId),
                    where("userId", "==", user?.userId)
                )

                const likeToDeleteData = await getDocs(likeToDeleteQuery)
                const likeId = likeToDeleteData.docs[0].id
                const likeToDelete = doc(db, "likes", likeId)

                await deleteDoc(likeToDelete)
                
                if (user) {
                    /* Remove the like from the specific post's likes array */
                    setPosts(prevPosts => 
                        prevPosts.map(post => 
                            post.id === postId 
                                ? { 
                                    ...post, 
                                    /* Filter out the deleted like by userId for consistency */
                                    likes: (post.likes || []).filter(like => like.userId !== user.userId)
                                  }
                                : post /* Else, leave other posts unchanged */
                        )
                    )
                }
            } catch (err) {
                console.error(err)
            }
        }
    }

    /* Checks the specific post's likes array instead of global likes state */
    const hasUserLiked = (post, user) => {
        /* Check if the user's ID exists in this specific post's likes array */
        return post.likes?.find((like) => like.userId === user?.userId)
    }

    /* Add save functionality - similar to addLike */
    const addSave = async (postId, user) => {
        /* Handle guest saves in sessionStorage */
        if (isGuestUser(user)) {
            const guestSaves = getGuestData(GUEST_KEYS.SAVES);
            const newSave = {
                saveId: generateGuestId(),
                userId: user.userId,
                username: user.username,
                postId: postId
            };
            
            const updatedGuestSaves = [...guestSaves, newSave];
            storeGuestData(GUEST_KEYS.SAVES, updatedGuestSaves);
            
            /* Update local state with guest save */
            setPosts(prevPosts => 
                prevPosts.map(post => 
                    post.id === postId 
                        ? { 
                            ...post, 
                            saves: [...(post.saves || []), newSave]
                          }
                        : post
                )
            );
        } else {
            /* Handle regular Firebase save */
            try {
                /* Add save to Firebase */
                const newDoc = await addDoc(savesRef, {
                    userId: user?.userId,
                    username: user?.username,
                    postId: postId
                })
                
                if (user) {
                    /* Update the specific post's saves in local state */
                    setPosts(prevPosts => 
                        prevPosts.map(post => 
                            post.id === postId 
                                ? { 
                                    ...post, 
                                    saves: [...(post.saves || []), {
                                        userId: user.userId, 
                                        username: user.username, 
                                        saveId: newDoc.id
                                    }]
                                  }
                                : post
                        )
                    )
                }
            } catch (err) {
                console.error(err)
            }
        }
    }

    /* Remove save functionality - similar to removeLike */
    const removeSave = async (postId, user) => {
        /* Handle guest unsaves in sessionStorage */
        if (isGuestUser(user)) {
            const guestSaves = getGuestData(GUEST_KEYS.SAVES);
            const updatedGuestSaves = guestSaves.filter(save => 
                !(save.postId === postId && save.userId === user.userId)
            );
            storeGuestData(GUEST_KEYS.SAVES, updatedGuestSaves);
            
            /* Update local state by removing guest save */
            setPosts(prevPosts => 
                prevPosts.map(post => 
                    post.id === postId 
                        ? { 
                            ...post, 
                            saves: (post.saves || []).filter(save => 
                                !(save.userId === user.userId)
                            )
                          }
                        : post
                )
            );
        } else {
            /* Handle regular Firebase unsave */
            try {
                /* Find and delete the save from Firebase */
                const saveToDeleteQuery = query(
                    savesRef,
                    where("postId", "==", postId),
                    where("userId", "==", user?.userId)
                )

                const saveToDeleteData = await getDocs(saveToDeleteQuery)
                const saveId = saveToDeleteData.docs[0].id
                const saveToDelete = doc(db, "saves", saveId)

                await deleteDoc(saveToDelete)
                
                if (user) {
                    /* Remove the save from the specific post's saves array */
                    setPosts(prevPosts => 
                        prevPosts.map(post => 
                            post.id === postId 
                                ? { 
                                    ...post, 
                                    saves: (post.saves || []).filter(save => save.saveId !== saveId)
                                  }
                                : post
                        )
                    )
                }
            } catch (err) {
                console.error(err)
            }
        }
    }

    /* Check if user has saved a post */
    const hasUserSaved = (post, user) => {
        return post.saves?.find((save) => save.userId === user?.userId)
    }

    /* Get saved posts for a user */
    const getSavedPosts = async (user) => {
        /* Handle guest saved posts from sessionStorage */
        if (isGuestUser(user)) {
            const guestSaves = getGuestData(GUEST_KEYS.SAVES);
            const savedPostIds = guestSaves.map(save => save.postId);
            return posts.filter(post => savedPostIds.includes(post.id));
        } else {
            /* Handle regular Firebase saved posts */
            try {
                const savedPostsQuery = query(
                    savesRef,
                    where("userId", "==", user?.userId)
                )
                const savedPostsData = await getDocs(savedPostsQuery)
                const savedPostIds = savedPostsData.docs.map(doc => doc.data().postId)
                
                /* Filter posts to only include saved ones */
                return posts.filter(post => savedPostIds.includes(post.id))
            } catch (err) {
                console.error(err)
                return []
            }
        }
    }

    /* useEffect hook to fetch posts when the component mounts. This should probably be moved to
    somewhere else so it only mounts when being called on the home screen. */
    useEffect(() => {
        getPosts()
    }, [user]) 

    return (
        <DataContext.Provider value={{
            posts, setPosts, navigate, postContent, setPostContent, createPost,
            deletePost, getPosts, postIsLoading, setPostIsLoading,
            addLike, removeLike, hasUserLiked,
            addSave, removeSave, hasUserSaved, getSavedPosts
        }}>
            {children}
        </DataContext.Provider>
    )
}