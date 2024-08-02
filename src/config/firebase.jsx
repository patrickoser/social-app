// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARqGC0xCN_vrcs3Q33VkekkmhGZpKJqfE",
  authDomain: "social-app-6ef03.firebaseapp.com",
  projectId: "social-app-6ef03",
  storageBucket: "social-app-6ef03.appspot.com",
  messagingSenderId: "398967320699",
  appId: "1:398967320699:web:bc212665c5f882a9b6b2de",
  measurementId: "G-10PHQ3HCMC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);