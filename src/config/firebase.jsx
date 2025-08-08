import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics"
import { getStorage } from "firebase/storage"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyARqGC0xCN_vrcs3Q33VkekkmhGZpKJqfE",
  authDomain: "social-app-6ef03.firebaseapp.com",
  projectId: "social-app-6ef03",
  storageBucket: "social-app-6ef03.appspot.com",
  messagingSenderId: "398967320699",
  appId: "1:398967320699:web:bc212665c5f882a9b6b2de",
  measurementId: "G-10PHQ3HCMC"
};

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
export const storage = getStorage(app)