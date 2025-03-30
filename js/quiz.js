/* 🤓 Meme Quiz Logic: This script controls the "Your Meme Language" quiz, managing question navigation and scoring selections. */

// Wait for the HTML to fully load
document.addEventListener('DOMContentLoaded', () => {

  /*
    Declare variables at the top for:
     1. Clarity (like a blueprint)
     2. Efficiency (single DOM queries)
     3. Maintainability (centralized updates)
  */
  // Selects all question containers (<div class="question">) and stores them in a NodeList
  const questions = document.querySelectorAll('.question');
  // Selects all "Next" buttons (<button class="next-btn">) and stores them in a list
  const nextButtons = document.querySelectorAll('.next-btn');
  // Selects all "Back" buttons (<button class="back-btn">) and stores them in a list
  const backButtons = document.querySelectorAll('.back-btn');
  // Selects the "Submit" button (<button class="submit-btn">) and stores it as a single element
  const submitButton = document.querySelector('.submit-btn');

  // Object to hold the score for each meme language category, initialized to zero for tracking selections
  const scores = {
    mystical: 0,
    cute: 0,
    chaos: 0,
    positive: 0,
    savage: 0,
    history: 0,
    tech: 0
  };

  // Object to track the last selected category for each question by index
  const lastSelections = {};

  // Updates the score for a given question based on the current radio button selection
  function updateScore(questionIndex) {
    const question = questions[questionIndex];
    const selectedRadio = question.querySelector('input[type="radio"]:checked');
    // If no radio button is selected, exit the function
    if (!selectedRadio) return;

    // Stores the string value of the currently selected radio button (e.g., "mystical")
    const newCategory = selectedRadio.value;
    // Stores the string value of the previously selected radio button for this question (e.g., "cute")
    const oldCategory = lastSelections[questionIndex];

    // If there was a previous selection different from the new one, decrease its score
    if (oldCategory && oldCategory !== newCategory) {
      scores[oldCategory]--;
    }

    // If the new selection differs from the old one, increase its score
    if (newCategory !== oldCategory) {
      scores[newCategory]++;
    }

    // Updates the lastSelections object with the new category for this question
    lastSelections[questionIndex] = newCategory;
  }

  // Adds event listeners to radio buttons to update scores when selections change
  questions.forEach((question, index) => {
    // Selects all radio buttons within the current question and stores them in a NodeList
    const radios = question.querySelectorAll('input[type="radio"]');
    // Iterates over each radio button in the NodeList to attach event listeners
    radios.forEach(radio => {
      // Attaches a change event listener to the radio button to detect selection changes
      radio.addEventListener('change', () => {
        // Updates the score for this question when a new option is selected
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
