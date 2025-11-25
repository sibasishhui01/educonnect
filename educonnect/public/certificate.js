// IMPORT FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyASx50b8ROauA0M9J9dJp737QTfbdr1IAs",
  authDomain: "educonnect-57f76.firebaseapp.com",
  projectId: "educonnect-57f76",
  storageBucket: "educonnect-57f76.firebasestorage.app",
  messagingSenderId: "742758782675",
  appId: "1:742758782675:web:5ebe067b5d6b725cefe626"
};

// 🔥 INITIALIZE FIREBASE FIRST
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// NOW YOU CAN USE onAuthStateChanged SAFELY
onAuthStateChanged(auth, (user) => {
  const enrollButtons = document.querySelectorAll(".enroll");

  enrollButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const courseTitle = btn.parentElement.querySelector("h3").textContent.trim();

      if (!user) {
        window.location.href = "login.html";
      } else {
        window.location.href = `enroll.html?course=${encodeURIComponent(courseTitle)}`;
      }
    });
  });
});


// FILTER + SEARCH
document.addEventListener("DOMContentLoaded", () => {

  const filters = document.querySelectorAll(".filter");   // ✅ FIXED
  const cards = document.querySelectorAll(".course-card");

  // FILTERS
  filters.forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector(".filter.active").classList.remove("active");
      btn.classList.add("active");

      const category = btn.dataset.filter;

      cards.forEach(card => {
        if (category === "all" || card.dataset.category === category) {
          card.style.display = "block";
          card.style.opacity = "1";
        } else {
          card.style.opacity = "0";
          setTimeout(() => card.style.display = "none", 200);
        }
      });
    });
  });

  // SEARCH
  document.getElementById("searchInput").addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();

    cards.forEach(card => {
      const title = card.querySelector("h3").textContent.toLowerCase();
      card.style.display = title.includes(value) ? "block" : "none";
    });
  });

});
