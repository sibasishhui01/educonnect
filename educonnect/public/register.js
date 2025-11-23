import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyASx50b8ROauA0M9J9dJp737QTfbdr1IAs",
  authDomain: "educonnect-57f76.firebaseapp.com",
  projectId: "educonnect-57f76",
  storageBucket: "educonnect-57f76.appspot.com",
  messagingSenderId: "742758782675",
  appId: "1:742758782675:web:5ebe067b5d6b725cefe626",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const spinner = document.getElementById("spinner");
  spinner.style.display = "block";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      email,
      role
    });

    window.location.href = "success.html";

  } catch (error) {
    spinner.style.display = "none";
    document.getElementById("errorMsg").textContent = "⚠️ " + error.message;
  }
});

async function loadUserInfo(user) {
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    displayName.textContent = user.email.split("@")[0];
    displayRole.textContent = "Student";
    return;
  }

  const data = snap.data();

  displayName.textContent = data.name || user.email.split("@")[0];
  displayRole.textContent = data.role || "Student";
  avatar.textContent = displayName.textContent.charAt(0).toUpperCase();
}
