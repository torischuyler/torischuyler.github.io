/*
  🤓 Meme Quiz Magic: This script powers the "Your Meme Language" quiz by toggling between questions one at a time.
*/

// Wait for the HTML to fully load
document.addEventListener('DOMContentLoaded', () => {
  // Grab all the question divs (<div class="question">s) and store them in a list
  const questions = document.querySelectorAll('.question');
  // Snag all the "Next" buttons (<button class="next-btn">s) so we can make them do stuff
  const nextButtons = document.querySelectorAll('.next-btn');
  // Scoop up all the "Back" buttons (<button class="back-btn">s) for reverse action
  const backButtons = document.querySelectorAll('.back-btn');

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

  // Loop through each "Back" button and give it a reverse mission
  backButtons.forEach((button, index) => {
    // When someone clicks a "Back" button, time to rewind...
    button.addEventListener('click', () => {
      // Hide the current question by tossing the "active" class away
      questions[index + 1].classList.remove('active');
      // Show the previous question by bringing "active" back to it
      questions[index].classList.add('active');
    });
  });
});
