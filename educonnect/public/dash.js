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
// FIREBASE CONFIG (keep your existing config)
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

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const logoutBtn = document.getElementById("logoutBtn");

// ----------------------------------------------------------
// UTILS
// ----------------------------------------------------------
function showLoader() {
  if (!loadingOverlay) return;
  loadingOverlay.classList.remove("hidden");
  loadingOverlay.setAttribute("aria-hidden", "false");
}
function hideLoader() {
  if (!loadingOverlay) return;
  loadingOverlay.classList.add("hidden");
  loadingOverlay.setAttribute("aria-hidden", "true");
}

function toast(msg, type = "info") {
  if (!toaster) return;
  toaster.textContent = msg;
  toaster.className = `toaster show ${type}`;
  setTimeout(() => {
    toaster.classList.remove("show");
  }, 3000);
}

function safeText(node, text) {
  if (!node) return;
  node.textContent = text ?? "";
}

function firstLetter(text) {
  if (!text) return "U";
  return String(text).trim().charAt(0).toUpperCase();
}

// small debounce to prevent spam clicking
function debounce(fn, ms = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

// ----------------------------------------------------------
// AUTH STATE CHECK & USER UI
// ----------------------------------------------------------
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  hideLoader(); // Make sure loader hides even if Firestore fails

  try {
    const userRef = doc(db, "users", user.uid);

console.log("User UID:", user.uid);
console.log("Fetching Firestore document…");

const snap = await getDoc(userRef);

console.log("Doc Exists?:", snap.exists());
console.log("Doc Data:", snap.data());


    let username = user.email.split("@")[0];
    let role = "Student";

    if (snap.exists()) {
      const data = snap.data();
      username = data.username || username;
      role = data.role || "Student";
    }

    displayName.textContent = username;
    displayRole.textContent = role;
    avatar.textContent = username.charAt(0).toUpperCase();

  } catch (error) {
    console.log("Error fetching user:", error);

    displayName.textContent = user.email.split("@")[0];
    displayRole.textContent = "Student";
    avatar.textContent = user.email[0].toUpperCase();

    toast("⚠️ Problem loading profile, using defaults");
  }

  loadSchedule();
  loadAssignments();
  loadAnnouncements();
});


// ----------------------------------------------------------
// LOAD SCHEDULE
// ----------------------------------------------------------
async function loadSchedule() {
  if (!scheduleBody) return;
  scheduleBody.innerHTML = `<tr><td colspan='4'>Loading...</td></tr>`;

  try {
    const ref = collection(db, "schedule");
    const snapshot = await getDocs(ref);

    scheduleBody.innerHTML = "";

    snapshot.forEach((d) => {
      const data = d.data() || {};
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${data.time ?? "-"}</td>
        <td>${data.subject ?? "-"}</td>
        <td>${data.teacher ?? "-"}</td>
        <td>${data.room ?? "-"}</td>
      `;
      scheduleBody.appendChild(tr);
    });

    if (!snapshot.size) {
      scheduleBody.innerHTML = `<tr><td colspan="4">No schedule available</td></tr>`;
    }
  } catch (err) {
    console.error("loadSchedule:", err);
    scheduleBody.innerHTML = `<tr><td colspan="4">Unable to load schedule</td></tr>`;
    toast("Failed to load schedule");
  }
}

// ----------------------------------------------------------
// LOAD ASSIGNMENTS
// ----------------------------------------------------------
async function loadAssignments() {
  if (!assignmentList) return;
  assignmentList.innerHTML = "<p>Loading...</p>";

  try {
    const ref = collection(db, "assignments");
    const snapshot = await getDocs(ref);

    assignmentList.innerHTML = "";
    snapshot.forEach((d) => {
      const data = d.data() || {};
      const item = document.createElement("div");
      item.className = "item";
      item.innerHTML = `
        <div>
          <strong>${data.title ?? "Untitled"}</strong>
          <div class="meta">${data.description ?? ""}</div>
        </div>
        <div class="meta">Due: ${data.due ?? "-"}</div>
      `;
      assignmentList.appendChild(item);
    });

    if (!snapshot.size) {
      assignmentList.innerHTML = "<p>No assignments found</p>";
    }
  } catch (err) {
    console.error("loadAssignments:", err);
    assignmentList.innerHTML = "<p>Unable to load assignments</p>";
    toast("Failed to load assignments");
  }
}

// ----------------------------------------------------------
// LOAD ANNOUNCEMENTS
// ----------------------------------------------------------
async function loadAnnouncements() {
  if (!announcementList) return;
  announcementList.innerHTML = "<p>Loading...</p>";

  try {
    const ref = collection(db, "announcements");
    const snapshot = await getDocs(ref);

    announcementList.innerHTML = "";
    snapshot.forEach((d) => {
      const data = d.data() || {};
      const item = document.createElement("div");
      item.className = "item";
      item.innerHTML = `
        <div>
          <strong>${data.title ?? "Announcement"}</strong>
          <div class="meta">${data.message ?? ""}</div>
        </div>
        <div class="meta">${data.date ?? ""}</div>
      `;
      announcementList.appendChild(item);
    });

    if (!snapshot.size) {
      announcementList.innerHTML = "<p>No announcements available</p>";
    }
  } catch (err) {
    console.error("loadAnnouncements:", err);
    announcementList.innerHTML = "<p>Unable to load announcements</p>";
    toast("Failed to load announcements");
  }
}

// ----------------------------------------------------------
// SEARCH (debounced)
// ----------------------------------------------------------
const doSearch = debounce(() => {
  const q = (searchInput?.value || "").trim();
  if (!q) {
    toast("Please type a search term");
    return;
  }
  // implement your search logic here (filtering client-side or query firestore)
  toast(`Search not implemented yet — you searched for "${q}"`);
}, 250);

if (searchBtn) searchBtn.addEventListener("click", doSearch);
if (searchInput) searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") doSearch();
});

// ----------------------------------------------------------
// LOGOUT
// ----------------------------------------------------------
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    showLoader();
    try {
      await signOut(auth);
      toast("Logged out");
      setTimeout(() => (window.location.href = "login.html"), 700);
    } catch (err) {
      console.error("logout error:", err);
      toast("Error logging out");
      hideLoader();
    }
  });
}
