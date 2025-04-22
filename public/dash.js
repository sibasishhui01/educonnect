document.addEventListener('DOMContentLoaded', function() {
    // Toggle active state for resource category buttons
    const categoryButtons = document.querySelectorAll('.resource-categories button');
    categoryButtons.forEach(button => {
      button.addEventListener('click', function() {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        // Here you would filter resources based on category
        console.log(`Showing ${this.textContent} resources`);
      });
    });
  
    // Simulate downloading a resource
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(button => {
      button.addEventListener('click', function() {
        const resourceName = this.closest('.resource-item').querySelector('h3').textContent;
        alert(`Downloading: ${resourceName}`);
        // Actual download logic would go here
      });
    });
  
    // Mark assignment as complete (simulated)
    const assignmentItems = document.querySelectorAll('.assignment-item');
    assignmentItems.forEach(item => {
      item.addEventListener('dblclick', function() {
        const assignmentName = this.querySelector('h3').textContent;
        if (confirm(`Mark "${assignmentName}" as complete?`)) {
          this.querySelector('.progress-bar').style.width = '100%';
          this.querySelector('.progress span').textContent = '100%';
        }
      });
    });
  
    // Display current date
    const currentDate = new Date();
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.querySelector('.user-profile span').textContent += ` | ${currentDate.toLocaleDateString('en-US', dateOptions)}`;
  });