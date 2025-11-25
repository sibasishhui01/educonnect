// Demo announcements
const announcements = [
  {
    type: "alert",
    icon: "fa-triangle-exclamation",
    title: "Server Maintenance Scheduled",
    message: "Our system will be undergoing maintenance on 28 Nov from 12 AM to 4 AM. Some services may be temporarily unavailable.",
    date: "25 Nov 2025"
  },
  {
    type: "event",
    icon: "fa-calendar-days",
    title: "Workshop on Modern Web Development",
    message: "A hands-on workshop on React and Tailwind will be held on 30 Nov. Registration is open to all students.",
    date: "24 Nov 2025"
  },
  {
    type: "info",
    icon: "fa-circle-info",
    title: "New Courses Added",
    message: "Courses on AI Foundations, Data Science Essentials, and Ethical Hacking have been added to the platform.",
    date: "22 Nov 2025"
  },
  {
    type: "alert",
    icon: "fa-exclamation-circle",
    title: "Important Exam Notice",
    message: "Mid-term exams will begin from 5 Dec. Admit cards will be available from 1 Dec.",
    date: "20 Nov 2025"
  },
  {
    type: "update",
    icon: "fa-wrench",
    title: "Dashboard UI Update",
    message: "We have rolled out a new cleaner dashboard with improved navigation and dark mode polish.",
    date: "18 Nov 2025"
  }
];

// Render announcements
const list = document.getElementById("annList");

announcements.forEach((a, i) => {
  const card = document.createElement("div");
  card.className = "card";
  card.style.animationDelay = `${i * 0.15}s`;

  card.innerHTML = `
    <div class="card-header ${a.type}">
      <i class="fa-solid ${a.icon}"></i>
      <span class="card-title">${a.title}</span>
    </div>
    <div class="card-body">
      <p>${a.message}</p>
      <div class="date">Posted on ${a.date}</div>
    </div>
  `;

  list.appendChild(card);
});

// Back button
document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "dashboard.html";
});
