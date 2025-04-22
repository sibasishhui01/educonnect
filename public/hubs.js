// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyASx50b8ROauA0M9J9dJp737QTfbdr1IAs",
    authDomain: "educonnect-57f76.firebaseapp.com",
    projectId: "educonnect-57f76",
    storageBucket: "educonnect-57f76.firebasestorage.app",
    messagingSenderId: "742758782675",
    appId: "1:742758782675:web:5ebe067b5d6b725cefe626",
    measurementId: "G-5L09MFWZQ2"
  };
  
// Show loading spinner when course is clicked or form is submitted
function showLoadingSpinner() {
    const spinner = document.getElementById("loadingSpinner");
    spinner.style.display = "block";
  }
  
  // Hide loading spinner after action is complete
  function hideLoadingSpinner() {
    const spinner = document.getElementById("loadingSpinner");
    setTimeout(() => {
      spinner.style.display = "none";
    }, 1000); // Keeps spinner visible for 1 second
  }
  
  // Function to handle course selection clicks
  function handleCourseClick(courseName) {
    showLoadingSpinner();
  
    setTimeout(() => {
      alert(`Launching ${courseName}...`);
      hideLoadingSpinner();
    }, 1500); // Simulate a delay of 1.5 seconds
  }
  
  // Function to handle form submission for course enrollment
  document.getElementById("enrollmentForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const name = document.getElementById("name").value;
    const course = document.getElementById("course").value;
  
    showLoadingSpinner();
  
    setTimeout(() => {
      document.getElementById("confirmationMsg").textContent =
        `Thanks, ${name}! You've been enrolled in ${course.replace(/([A-Z])/g, ' $1')}.`;
      hideLoadingSpinner();
    }, 2000); // Simulate a delay of 2 seconds for enrollment confirmation
  });
  
  // Attach event listeners for course clicks
  document.querySelectorAll('.interactive').forEach((card) => {
    const courseName = card.querySelector('h3').textContent;
    card.addEventListener('click', () => handleCourseClick(courseName));
  });
  