// Demo Resources (W3Schools + GeeksForGeeks)
const resourceData = [
  {
    title: "HTML",
    icon: "fa-brands fa-html5",
    links: [
      { name: "W3Schools HTML Tutorial", url: "https://www.w3schools.com/html/" },
      { name: "GeeksForGeeks HTML Guide", url: "https://www.geeksforgeeks.org/html-tutorials/" }
    ]
  },
  {
    title: "CSS",
    icon: "fa-brands fa-css3-alt",
    links: [
      { name: "W3Schools CSS Tutorial", url: "https://www.w3schools.com/css/" },
      { name: "GeeksForGeeks CSS Guide", url: "https://www.geeksforgeeks.org/css-tutorials/" }
    ]
  },
  {
    title: "JavaScript",
    icon: "fa-brands fa-js",
    links: [
      { name: "W3Schools JS Tutorial", url: "https://www.w3schools.com/js/" },
      { name: "GeeksForGeeks JS Guide", url: "https://www.geeksforgeeks.org/javascript/" }
    ]
  },
  {
    title: "Python",
    icon: "fa-brands fa-python",
    links: [
      { name: "W3Schools Python", url: "https://www.w3schools.com/python/" },
      { name: "GeeksForGeeks Python", url: "https://www.geeksforgeeks.org/python-programming-language/" }
    ]
  },
  {
    title: "SQL",
    icon: "fa-solid fa-database",
    links: [
      { name: "W3Schools SQL Tutorial", url: "https://www.w3schools.com/sql/" },
      { name: "GeeksForGeeks SQL Guide", url: "https://www.geeksforgeeks.org/dbms/" }
    ]
  },
  {
    title: "DSA",
    icon: "fa-solid fa-code",
    links: [
      { name: "W3Schools DSA Basics", url: "https://www.w3schools.com/dsa/" },
      { name: "GeeksForGeeks DSA Full Guide", url: "https://www.geeksforgeeks.org/data-structures/" }
    ]
  }
];

const container = document.getElementById("resourceContainer");

// Create Cards
resourceData.forEach(res => {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <div class="icon"><i class="${res.icon}"></i></div>
    <h3>${res.title}</h3>
    <div class="links">
      ${res.links
        .map(link => `<a href="${link.url}" target="_blank">${link.name}</a>`)
        .join("")}
    </div>
  `;

  container.appendChild(card);
});

// Back Button
document.getElementById("backBtn")?.addEventListener("click", () => {
  window.location.href = "dashboard.html";
});
