import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBzVFLPdmDWO7yw7yTj2DwWJzeGVpSM4h8",
  authDomain: "react-netflix-clone-a6fb4.firebaseapp.com",
  projectId: "react-netflix-clone-a6fb4",
  storageBucket: "react-netflix-clone-a6fb4.appspot.com",
  messagingSenderId: "353435261786",
  appId: "1:353435261786:web:2356aa7f41b9dde32bf163",
  measurementId: "G-4W6V8QJSZ3"
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
