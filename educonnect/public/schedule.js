// Simple interactivity: show alert on subject click

document.addEventListener("DOMContentLoaded", () => {
  const subjects = document.querySelectorAll(".subject");

  subjects.forEach(item => {
    item.addEventListener("click", () => {
      alert("Class: " + item.textContent);
    });
  });
});
