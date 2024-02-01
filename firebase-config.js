
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc,  updateDoc, collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";


const firebaseConfig = {
  apiKey: "AIzaSyBAeTPf9GDOKc81v6avBMykYElJp2zBvgk",
  authDomain: "data-base-151c7.firebaseapp.com",
  projectId: "data-base-151c7",
  storageBucket: "data-base-151c7.appspot.com",
  messagingSenderId: "637878582535",
  appId: "1:637878582535:web:8fe1b4e35b5444172cd9a2",
  measurementId: "G-7JBPL4E9J1"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  const db = getFirestore(app);
  const storage = getStorage();



  export {auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, db, doc, setDoc, getDoc,  updateDoc, storage, ref, uploadBytesResumable, getDownloadURL, reauthenticateWithCredential, EmailAuthProvider, updatePassword, collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc };

  