// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const environment = {
  firebaseConfig: {
    apiKey: "AIzaSyABcNrtRUCkp7F94sW9VKF2vhH0zgjY2BE",
    authDomain: "trivigame-a2461.firebaseapp.com",
    databaseURL: "https://trivigame-a2461-default-rtdb.firebaseio.com",
    projectId: "trivigame-a2461",
    storageBucket: "trivigame-a2461.appspot.com",
    messagingSenderId: "75448870363",
    appId: "1:75448870363:web:5c920712b497f26091f3fe",
    measurementId: "G-KJ3R14G36Z"
  }
};
// Initialize Firebase
const app = initializeApp(environment.firebaseConfig);