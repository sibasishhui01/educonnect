// ----------------------------------------------------
// FIREBASE IMPORTS
// ----------------------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// ----------------------------------------------------
// FIREBASE CONFIG
// ----------------------------------------------------
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

// ----------------------------------------------------
// GLOBAL USER
// ----------------------------------------------------
let currentUser = null;

onAuthStateChanged(auth, (user) => {
  currentUser = user || null;
});

// ----------------------------------------------------
// ENROLL BUTTONS
// ----------------------------------------------------
document.querySelectorAll(".enroll").forEach(btn => {
  btn.addEventListener("click", async () => {
    if (!currentUser) {
      alert("Please log in before enrolling.");
      window.location.href = "login.html";
      return;
    }

    const card = btn.closest(".course-card");
    const courseName = card.querySelector("h3").textContent.trim();

    try {
      await addDoc(collection(db, "course_enrollments"), {
        uid: currentUser.uid,
        email: currentUser.email,
        course: courseName,
        enrolledAt: serverTimestamp()
      });

      showToast(`Enrolled in ${courseName}!`);

    } catch (err) {
      console.error("Enroll ERROR:", err);
      showToast("Failed to enroll — check console.", true);
    }
  });
});

// ----------------------------------------------------
// TOAST MESSAGE
// ----------------------------------------------------
function showToast(msg, error = false) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = msg;

  if (error) toast.style.background = "#c0392b";

  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 20);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
