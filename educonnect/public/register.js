import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyASx50b8ROauA0M9J9dJp737QTfbdr1IAs",
  authDomain: "educonnect-57f76.firebaseapp.com",
  projectId: "educonnect-57f76",
  storageBucket: "educonnect-57f76.appspot.com",
  messagingSenderId: "742758782675",
  appId: "1:742758782675:web:5ebe067b5d6b725cefe626"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const spinner = document.getElementById("spinner");
  const errorMsg = document.getElementById("errorMsg");

  spinner.style.display = "block";
  errorMsg.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  // Generate username from email
  const username = email.split("@")[0];

  try {
    // 1️⃣ Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2️⃣ Save user data in Firestore using UID
  await setDoc(doc(db, "users", user.uid), {
    email,
    role,
    username: email.split("@")[0]
});

    // 3️⃣ Redirect
    setTimeout(() => {
      window.location.href = "success.html";
    }, 500);

  } catch (error) {
    spinner.style.display = "none";
    errorMsg.textContent = "⚠️ " + error.message;
  }
});
