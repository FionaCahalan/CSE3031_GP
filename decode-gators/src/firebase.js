// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

//import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBWBGC0ULhNmaOg4RkBw32KpVh-hnOaXng",
  authDomain: "decodegators.firebaseapp.com",
  projectId: "decodegators",
  storageBucket: "decodegators.appspot.com",
  messagingSenderId: "469170347759",
  appId: "1:469170347759:web:e5a56212c8642158b8451a",
  measurementId: "G-LE1R78B6P4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);


// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export const db = getFirestore(app);
 