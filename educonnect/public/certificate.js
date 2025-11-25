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
  // Using the storageBucket from the second version (more common format)
  storageBucket: "educonnect-57f76.appspot.com", 
  messagingSenderId: "742758782675",
  appId: "1:742758782675:web:5ebe067b5d6b725cefe626"
};

// 🔥 INITIALIZE FIREBASE
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ----------------------------------------------------
// GLOBAL USER STATE
// ----------------------------------------------------
let currentUser = null;

onAuthStateChanged(auth, (user) => {
  currentUser = user || null;
});

// ----------------------------------------------------
// ENROLL BUTTON LOGIC (Database Interaction + Redirection)
// ----------------------------------------------------
document.querySelectorAll(".enroll").forEach(btn => {
  btn.addEventListener("click", async () => {
    const card = btn.closest(".course-card");
    const courseName = card.querySelector("h3").textContent.trim();
    
    // 1. Check Auth Status
    if (!currentUser) {
      alert("Please log in before enrolling.");
      window.location.href = "login.html"; // Redirect to login
      return;
    }

    // 2. Perform Database Enrollment
    try {
      await addDoc(collection(db, "course_enrollments"), {
        uid: currentUser.uid,
        email: currentUser.email,
        course: courseName,
        enrolledAt: serverTimestamp()
      });

      showToast(`Successfully enrolled in ${courseName}! Redirecting...`);
      
      // 3. Redirect to enroll page after successful DB entry
      window.location.href = `enroll.html?course=${encodeURIComponent(courseName)}`;

    } catch (err) {
      console.error("Enroll ERROR:", err);
      showToast("Failed to enroll—check console.", true);
    }
  });
});

// ----------------------------------------------------
// TOAST MESSAGE FUNCTION
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

// ----------------------------------------------------
// FILTER + SEARCH LOGIC
// ----------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {

  const filters = document.querySelectorAll(".filter");
  const cards = document.querySelectorAll(".course-card");

  // FILTERS
  filters.forEach(btn => {
    btn.addEventListener("click", () => {
      // Deactivate current active filter
      const activeFilter = document.querySelector(".filter.active");
      if (activeFilter) {
          activeFilter.classList.remove("active");
      }
      // Activate clicked filter
      btn.classList.add("active");

      const category = btn.dataset.filter;

      cards.forEach(card => {
        const isMatch = (category === "all" || card.dataset.category === category);
        
        if (isMatch) {
          card.style.display = "block";
          card.style.opacity = "1";
        } else {
          card.style.opacity = "0";
          // Hide card after transition
          setTimeout(() => card.style.display = "none", 200);
        }
      });
    });
  });

  // SEARCH
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
      searchInput.addEventListener("input", (e) => {
          const value = e.target.value.toLowerCase();

          cards.forEach(card => {
              const title = card.querySelector("h3").textContent.toLowerCase();
              
              // Only hide/show if the current filter is 'all' or if the card matches the active filter
              const activeCategory = document.querySelector(".filter.active").dataset.filter;
              const isCategoryMatch = (activeCategory === "all" || card.dataset.category === activeCategory);
              
              // If title matches AND it matches the current filter, show it. Otherwise, hide it.
              if (title.includes(value) && isCategoryMatch) {
                  card.style.display = "block";
              } else {
                  card.style.display = "none";
              }
          });
      });
  }
});