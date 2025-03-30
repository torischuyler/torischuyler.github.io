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

  // Object to track the last selected category per question
  const lastSelections = {};

  // Function to update the score for a specific question
  function updateScore(questionIndex) {
    const question = questions[questionIndex];
    const selectedRadio = question.querySelector('input[type="radio"]:checked');
    // No selection yet, skip it
    if (!selectedRadio) return;

    const newCategory = selectedRadio.value;
    const oldCategory = lastSelections[questionIndex];

    // If there was a previous selection, subtract its point
    if (oldCategory && oldCategory !== newCategory) {
      scores[oldCategory]--;
    }

    // Add a point to the new selection (if it’s not already counted)
    if (newCategory !== oldCategory) {
      scores[newCategory]++;
    }

    // Update the last selection for this question
    lastSelections[questionIndex] = newCategory;
  }

  // Listen for radio button changes and update scores immediately
  questions.forEach((question, index) => {
    const radios = question.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
      radio.addEventListener('change', () => {
        // Update score when they change their answer
        updateScore(index);
      });
    });
  });

  // Handle "Next" button clicks
  nextButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      // Update the score for the current question before moving on
      updateScore(index);
      // Hide current question, show next
      questions[index].classList.remove('active');
      questions[index + 1].classList.add('active');
    });
  });

  // Handle "Back" button clicks
  backButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      questions[index + 1].classList.remove('active');
      questions[index].classList.add('active');
      // No need to update score here since it’s already tracked
    });
  });

  // Handle "Submit" button click
  submitButton.addEventListener('click', () => {
    // Update the score for the last question
    updateScore(questions.length - 1);

    // Find the category with the most points
    let maxScore = 0;
    let memeLanguage = '';
    for (const [category, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        memeLanguage = category;
      }
    }
    alert(`Your Meme Language is: ${memeLanguage.charAt(0).toUpperCase() + memeLanguage.slice(1)}!`);
  });
});
