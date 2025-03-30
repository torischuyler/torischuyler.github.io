/*
  🤓 Meme Quiz Magic: This script powers the "Your Meme Language" quiz by toggling between questions one at a time.
*/

// Wait for the HTML to fully load
document.addEventListener('DOMContentLoaded', () => {
  // Grab all the question divs (<div class="question">s) and store them in a list
  const questions = document.querySelectorAll('.question');
  // Snag all the "Next" buttons (<button class="next-btn">s) so we can make them do stuff
  const nextButtons = document.querySelectorAll('.next-btn');

  // Loop through each "Next" button and give it a job
  nextButtons.forEach((button, index) => {
    // When someone clicks a "Next" button, here’s what happens...
    button.addEventListener('click', () => {
      // Hide the current question by yeeting the "active" class off it
      questions[index].classList.remove('active');
      // Show the next question by slapping the "active" class on it
      questions[index + 1].classList.add('active');
    });
  });
});
