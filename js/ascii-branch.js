// Render an ASCII branch into a <pre>, bolding state names
// (lines that don't start with tree-drawing characters or whitespace)
function renderBranch(id, text) {
  const pre = document.getElementById(id);
  pre.textContent = '';
  const lines = text.split('\n');
  lines.forEach((line, index) => {
    const isState = line.trim() !== '' && !/^[\s├└│─]/.test(line);
    if (isState) {
      const strong = document.createElement('strong');
      strong.textContent = line;
      pre.appendChild(strong);
    } else {
      pre.appendChild(document.createTextNode(line));
    }
    if (index < lines.length - 1) {
      pre.appendChild(document.createTextNode('\n'));
    }
  });
}

// Load desktop ASCII branch
fetch('/assets/ascii/branch-desktop.txt')
  .then(response => response.text())
  .then(data => renderBranch('branch-desktop', data))
  .catch(error => console.error('Error loading desktop ASCII branch:', error));

// Load mobile ASCII branch
fetch('/assets/ascii/branch-mobile.txt')
  .then(response => response.text())
  .then(data => renderBranch('branch-mobile', data))
  .catch(error => console.error('Error loading mobile ASCII branch:', error));
