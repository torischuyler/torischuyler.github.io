// Load desktop ASCII art
fetch('assets/ascii/life-branch-desktop.txt')
  .then(response => response.text())
  .then(data => {
      document.getElementById('life-branch-desktop').textContent = data;
  })
  .catch(error => console.error('Error loading desktop ASCII art:', error));

// Load mobile ASCII art
fetch('assets/ascii/life-branch-mobile.txt')
  .then(response => response.text())
  .then(data => {
      document.getElementById('life-branch-mobile').textContent = data;
  })
  .catch(error => console.error('Error loading mobile ASCII art:', error));
