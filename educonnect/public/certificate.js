// FILTER HANDLING
const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".course-card");

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

// SEARCH FUNCTION
document.getElementById("searchInput").addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();

  cards.forEach(card => {
    const title = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = title.includes(value) ? "block" : "none";
  });
});
