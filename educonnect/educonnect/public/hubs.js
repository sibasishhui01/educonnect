// hubs.js (module) - Firebase v10 modular
// Make sure this file is loaded as type="module" in hubs.html

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

/* --------- paste your firebase config (you already shared it) ---------- */
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

/* UI helpers */
const loadingOverlay = document.getElementById("loadingOverlay");
const toaster = document.getElementById("toaster");
const userLabel = document.getElementById("userLabel");
const btnSignOut = document.getElementById("btnSignOut");

function showLoading() { loadingOverlay.classList.add("show"); }
function hideLoading() { loadingOverlay.classList.remove("show"); }
function toast(msg, ms = 3000) {
  toaster.textContent = msg;
  toaster.classList.add("show");
  setTimeout(()=> toaster.classList.remove("show"), ms);
}

/* auth state */
onAuthStateChanged(auth, (user) => {
  if (user) {
    userLabel.textContent = user.displayName || user.email || "Signed in";
    btnSignOut.classList.remove("hidden");
  } else {
    userLabel.textContent = "Not signed in";
    btnSignOut.classList.add("hidden");
  }
});

/* sign out */
btnSignOut?.addEventListener("click", async () => {
  try {
    showLoading();
    await signOut(auth);
    toast("Signed out");
  } catch (err) {
    console.error(err);
    toast("Error signing out");
  } finally {
    hideLoading();
  }
});

/* Courses: listen to buttons and log clicks to Firestore */
document.querySelectorAll(".course").forEach(card => {
  const launchBtn = card.querySelector(".launch");
  const enrollBtn = card.querySelector(".enroll");
  const courseId = card.dataset.courseId;

  // Launch click
  launchBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    showLoading();
    try {
      // Log click to Firestore
      await addDoc(collection(db, "analytics", "courseClicks", "entries"), {
        courseId,
        type: "launch",
        user: (auth.currentUser && auth.currentUser.uid) || null,
        ts: serverTimestamp()
      });
      // Simulate opening course (replace with real route)
      toast(`Launching ${card.querySelector(".course-title").textContent}`);
      // In a real app redirect or open modal here
    } catch (err) {
      console.error("Logging error:", err);
      toast("Could not log click (check console)");
    } finally {
      hideLoading();
    }
  });

  // Enroll click delegates to form
  enrollBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    document.getElementById("enrollCourse").value = courseId;
    document.getElementById("fullName").focus();
    window.scrollTo({ top: document.getElementById("enrollSection").offsetTop - 20, behavior: "smooth" });
  });

  // also keyboard accessibility
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      card.querySelector(".launch").click();
    }
  });
});

/* Enrollment form - writes to Firestore collection 'enrollments' */
const enrollmentForm = document.getElementById("enrollmentForm");
const confirmText = document.getElementById("confirmText");

enrollmentForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const course = document.getElementById("enrollCourse").value;
  const name = document.getElementById("fullName").value.trim();
  const contact = document.getElementById("contact").value.trim();

  if (!name || !course) {
    confirmText.textContent = "Please fill required fields.";
    return;
  }

  // require sign-in: if not signed in, ask user to sign in
  if (!auth.currentUser) {
    toast("Please sign in to enroll (you will be redirected).");
    // redirect to login page if you have one:
    setTimeout(()=> window.location.href = "login.html", 900);
    return;
  }

  showLoading();
  try {
    // create a new enrollment doc (document id auto-generated)
    await addDoc(collection(db, "enrollments"), {
      course,
      name,
      contact: contact || null,
      userId: auth.currentUser.uid,
      userEmail: auth.currentUser.email || null,
      createdAt: serverTimestamp()
    });

    confirmText.textContent = "Enrollment submitted! ✅";
    enrollmentForm.reset();
    toast("Enrollment saved.");
  } catch (err) {
    console.error("Enroll error:", err);
    confirmText.textContent = "Failed to enroll — check console.";
    toast("Error saving enrollment.", 3000);
  } finally {
    hideLoading();
  }
});

/* Optional: Pre-populate schedule / interactions (client-only demo)
   In a real app, you'd read these from Firestore and render them.
*/
document.addEventListener("DOMContentLoaded", () => {
  // simple accessibility focus
  document.querySelectorAll(".btn").forEach(b => b.setAttribute("tabindex", "0"));
});
