import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCPh3Gninp3iJ1_7o1OFOonOp81WBBdkE0",
  authDomain: "ewl-crm.firebaseapp.com",
  projectId: "ewl-crm",
  storageBucket: "ewl-crm.firebasestorage.app",
  messagingSenderId: "552749501687",
  appId: "1:552749501687:web:261d3ed851db59fcadd7f2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, signOut };
