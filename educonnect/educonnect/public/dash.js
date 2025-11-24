// ----------------------------------------------------------
// FIREBASE IMPORTS
// ----------------------------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// ----------------------------------------------------------
// FIREBASE CONFIG
// ----------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyASx50b8ROauA0M9J9dJp737QTfbdr1IAs",
  authDomain: "educonnect-57f76.firebaseapp.com",
  projectId: "educonnect-57f76",
  storageBucket: "educonnect-57f76.appspot.com",
  messagingSenderId: "742758782675",
  appId: "1:742758782675:web:5ebe067b5d6b725cefe626"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// ----------------------------------------------------------
// DOM ELEMENTS
// ----------------------------------------------------------
const loadingOverlay = document.getElementById("loadingOverlay");
const toaster = document.getElementById("toaster");

const displayName = document.getElementById("displayName");
const displayRole = document.getElementById("displayRole");
const avatar = document.getElementById("avatar");

const scheduleBody = document.getElementById("scheduleBody");
const assignmentList = document.getElementById("assignmentList");
const announcementList = document.getElementById("announcementList");


// ----------------------------------------------------------
// LOADING OVERLAY
// ----------------------------------------------------------
function showLoader() {
  loadingOverlay.classList.remove("hidden");
}
function hideLoader() {
  loadingOverlay.classList.add("hidden");
}


// ----------------------------------------------------------
// TOASTER
// ----------------------------------------------------------
function toast(msg) {
  toaster.textContent = msg;
  toaster.classList.add("show");
  setTimeout(() => toaster.classList.remove("show"), 3000);
}


// ----------------------------------------------------------
// AUTH STATE CHECK
// ----------------------------------------------------------
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // 1️⃣ Fetch user profile from Firestore
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  let username = user.email.split("@")[0];
  let role = "Student";

  if (snap.exists()) {
    username = snap.data().username || username;
    role = snap.data().role || "Student";
  }

  // 2️⃣ Update UI
  displayName.textContent = username;
  displayRole.textContent = role;
  avatar.textContent = username.charAt(0).toUpperCase();

  hideLoader();

  // Load dashboard data
  loadSchedule();
  loadAssignments();
  loadAnnouncements();
});


// ----------------------------------------------------------
// LOAD SCHEDULE
// ----------------------------------------------------------
async function loadSchedule() {
  scheduleBody.innerHTML = `<tr><td colspan='4'>Loading...</td></tr>`;

  const ref = collection(db, "schedule");
  const snapshot = await getDocs(ref);

  scheduleBody.innerHTML = "";

  snapshot.forEach((doc) => {
    const data = doc.data();
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${data.time}</td>
      <td>${data.subject}</td>
      <td>${data.teacher}</td>
      <td>${data.room}</td>
    `;

    scheduleBody.appendChild(tr);
  });

  if (!snapshot.size) {
    scheduleBody.innerHTML = `<tr><td colspan="4">No schedule available</td></tr>`;
  }
}


// ----------------------------------------------------------
// LOAD ASSIGNMENTS
// ----------------------------------------------------------
async function loadAssignments() {
  assignmentList.innerHTML = "<p>Loading...</p>";

  const ref = collection(db, "assignments");
  const snapshot = await getDocs(ref);

  assignmentList.innerHTML = "";

  snapshot.forEach((doc) => {
    const data = doc.data();
    const item = document.createElement("div");
    item.classList.add("item");

    item.innerHTML = `
      <div>
        <strong>${data.title}</strong>
        <div class="meta">${data.description}</div>
      </div>
      <div class="meta">Due: ${data.due}</div>
    `;

    assignmentList.appendChild(item);
  });

  if (!snapshot.size) {
    assignmentList.innerHTML = "<p>No assignments found</p>";
  }
}


// ----------------------------------------------------------
// LOAD ANNOUNCEMENTS
// ----------------------------------------------------------
async function loadAnnouncements() {
  announcementList.innerHTML = "<p>Loading...</p>";

  const ref = collection(db, "announcements");
  const snapshot = await getDocs(ref);

  announcementList.innerHTML = "";

  snapshot.forEach((doc) => {
    const data = doc.data();
    const item = document.createElement("div");
    item.classList.add("item");

    item.innerHTML = `
      <div>
        <strong>${data.title}</strong>
        <div class="meta">${data.message}</div>
      </div>
      <div class="meta">${data.date}</div>
    `;

    announcementList.appendChild(item);
  });

  if (!snapshot.size) {
    announcementList.innerHTML = "<p>No announcements available</p>";
  }
}


// ----------------------------------------------------------
// SEARCH
// ----------------------------------------------------------
document.getElementById("searchBtn").addEventListener("click", () => {
  const q = document.getElementById("searchInput").value.trim();
  if (!q) return;
  toast("Search coming soon…");
});


// ----------------------------------------------------------
// LOGOUT
// ----------------------------------------------------------
document.getElementById("logoutBtn").addEventListener("click", () => {
  showLoader();
  signOut(auth)
    .then(() => {
      setTimeout(() => (window.location.href = "login.html"), 800);
    })
    .catch(() => {
      toast("Error logging out!");
      hideLoader();
    });
});
