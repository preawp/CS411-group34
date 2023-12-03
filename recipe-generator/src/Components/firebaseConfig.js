import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'


const firebaseConfig = {
  apiKey: "AIzaSyCFrOG32mS7D090UVLdUcGM4PdCAOBskDg",
  authDomain: "userprof-96e2d.firebaseapp.com",
  projectId: "userprof-96e2d",
  storageBucket: "userprof-96e2d.appspot.com",
  messagingSenderId: "789122171568",
  appId: "1:789122171568:web:22bbf102acf704b640b175"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)