import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyASx50b8ROauA0M9J9dJp737QTfbdr1IAs",
    authDomain: "educonnect-57f76.firebaseapp.com",
    databaseURL: "https://educonnect-57f76-default-rtdb.firebaseio.com",
    projectId: "educonnect-57f76",
    storageBucket: "educonnect-57f76.firebasestorage.app",
    messagingSenderId: "742758782675",
    appId: "1:742758782675:web:5ebe067b5d6b725cefe626",
    measurementId: "G-5L09MFWZQ2"
  };
// 🔌 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🧾 Form elements
const registerForm = document.getElementById("registerForm");
const spinner = document.getElementById("spinner");
const errorMsg = document.getElementById("errorMsg");
const successMsg = document.getElementById("successMsg");

registerForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  spinner.style.display = "block";
  errorMsg.textContent = "";
  successMsg.style.display = "none";

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  try {
    // 🔐 Create user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 📄 Save user info to Firestore
    await setDoc(doc(db, "users", user.uid), {
      username,
      email,
      role
    });

    spinner.style.display = "none";
    successMsg.textContent = "✅ Registration complete! Please login.";
    successMsg.style.display = "block";

    // ⏳ Redirect to login after 2.5 seconds
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2500);

  } catch (error) {
    spinner.style.display = "none";
    errorMsg.textContent = `⚠️ ${error.message}`;
  }
});
