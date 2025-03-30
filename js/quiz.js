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
  // Nab the "Submit" button (that lone <button class="submit-btn">) to wrap things up
  const submitButton = document.querySelector('.submit-btn');

  // Object to tally up the vibe points for each meme language
  const scores = {
    mystical: 0,
    cute: 0,
    chaos: 0,
    positive: 0,
    savage: 0,
    history: 0,
    tech: 0
  };

  // Listen for radio button clicks and tally the scores
  questions.forEach(question => {
    const radios = question.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
      radio.addEventListener('change', () => {
        // Grab the value (mystical, cute, etc.)
        const category = radio.value;
        // Add a point to that category
        scores[category]++;
      });
    });
  });

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

  // When they hit "Submit", let’s see what meme language they’ve got
  submitButton.addEventListener('click', () => {
    // Find the category with the most points
    let maxScore = 0;
    let memeLanguage = '';
    for (const [category, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        memeLanguage = category;
      }
    }
    // For now, just alert the result
    alert(`Your Meme Language is: ${memeLanguage.charAt(0).toUpperCase() + memeLanguage.slice(1)}!`);
  });
});
