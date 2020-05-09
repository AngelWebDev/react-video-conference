import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";
import "firebase/storage";
import "firebase/functions";
import { functions } from "firebase";

var firebaseApp = firebase;

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};
// Initialize Firebase
firebaseApp.initializeApp(firebaseConfig);
export default firebaseApp;

const functionsApp = functions();
const loginInEvent = functionsApp.httpsCallable("loginInEvent");

// if (process.env.NODE_ENV === "development") {
//   functionsApp.useFunctionsEmulator("http://localhost:5001")
// }

const getTimestampFromDate = (date) => {
  return firebaseApp.firestore.Timestamp.fromDate(date);
};

export {
  loginInEvent,
  getTimestampFromDate,
}


