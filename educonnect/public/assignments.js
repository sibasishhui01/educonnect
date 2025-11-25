// Demo assignments
const assignments = [
  {
    title: "Mathematics — Algebra Worksheet",
    description: "Solve 20 algebra problems from chapter 3.",
    due: "2025-02-20",
    status: "pending"
  },
  {
    title: "Computer Science — JavaScript Project",
    description: "Build a simple To-Do application using DOM.",
    due: "2025-02-18",
    status: "completed"
  },
  {
    title: "English — Essay Writing",
    description: "Write an essay about the impact of technology in education.",
    due: "2025-02-16",
    status: "overdue"
  },
  {
    title: "Physics — Numericals Set",
    description: "Complete the numerical problems from chapter 5.",
    due: "2025-02-22",
    status: "pending"
  }
];

const list = document.getElementById("assignmentList");

// Load Assignments
assignments.forEach((a) => {
  const card = document.createElement("div");
  card.className = "assignment-card";

  card.innerHTML = `
    <div class="assignment-title">${a.title}</div>
    <div class="assignment-meta">${a.description}</div>
    <div class="assignment-meta">Due Date: ${a.due}</div>
    <span class="status ${a.status}">${a.status.toUpperCase()}</span>
    <br>
    <button class="view-btn">View Details</button>
  `;

  list.appendChild(card);
});

// Back Button
document.getElementById("backBtn")?.addEventListener("click", () => {
  window.location.href = "dashboard.html";
});
