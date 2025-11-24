import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyASx50b8ROauA0M9J9dJp737QTfbdr1IAs",
  authDomain: "educonnect-57f76.firebaseapp.com",
  projectId: "educonnect-57f76",
  storageBucket: "educonnect-57f76.firebasestorage.app",
  messagingSenderId: "742758782675",
  appId: "1:742758782675:web:5ebe067b5d6b725cefe626",
  measurementId: "G-5L09MFWZQ2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Keep user logged in
setPersistence(auth, browserLocalPersistence);

document.getElementById("showPassword").addEventListener("change", function () {
  const passwordField = document.getElementById("password");
  passwordField.type = this.checked ? "text" : "password";
});

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const email = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);

    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (!userDoc.exists()) {
      alert("⚠️ User data missing in Firestore.");
      return;
    }

    const role = userDoc.data().role;

    if (role === "admin") {
      window.location.href = "dashboard.html";
    } else {
      window.location.href = "index.html";
    }

  } catch (error) {
    document.getElementById("errorMsg").textContent = "❌ " + error.message;
  }
});
