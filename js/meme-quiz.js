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
  // Selects the quiz wrapper container (<div class="quiz-wrapper">) to append quiz results
  const quizWrapper = document.querySelector('.quiz-wrapper');

  // Object to hold the score for each meme language category, initialized to zero for tracking selections
  const scores = {
    mystical: 0,
    cute: 0,
    chaos: 0,
    positive: 0,
    savage: 0,
    history: 0,
    tech: 0,
    renegade: 0
  };

  // Object to track the last selected category for each question by index
  const lastSelections = {};

  // Mapping of meme categories to image filenames
  const categoryImages = {
    mystical: 'images/meme-results/trigon.jpg',
    cute: 'images/meme-results/lil-twirlip.jpg',
    chaos: 'images/meme-results/subway-rats.jpg',
    positive: 'images/meme-results/giggleblossom.jpg',
    savage: 'images/meme-results/bone-appetit.jpg',
    history: 'images/meme-results/alexander-hamilton.jpg',
    tech: 'images/meme-results/steve-jobs.jpg',
    renegade: 'images/meme-results/retina-goggles.jpg'
  };

  // Updates the score for a given question based on the current dropdown selection
  function updateScore(questionIndex) {
    const question = questions[questionIndex];
    // Find the <select> element
    const select = question.querySelector('select');
    // Get the value of the selected option
    const selectedOption = select.value;
    // If no valid option is selected (e.g., the placeholder), exit
    if (!selectedOption) return;

    // Stores the string value of the currently selected dropdown option (e.g., "mystical")
    const newCategory = selectedOption;
    // Stores the string value of the previously selected dropdown option for this question (e.g., "cute")
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
    // Find the <select> element
    const select = question.querySelector('select');
    // Attaches a change event listener dropdown selection to detect changes
    select.addEventListener('change', () => {
      // Updates the score for this question when a new option is selected
      updateScore(index);
    });
  });

  // Adds event listeners to "Next" buttons to navigate to the next question
  nextButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      // Updates the score for the current question before proceeding
      updateScore(index);
      // Removes "active" class from current question to hide it
      questions[index].classList.remove('active');
      // Adds "active" class to next question to show it
      questions[index + 1].classList.add('active');
    });
  });

  // Adds event listeners to "Back" buttons to navigate to the previous question
  backButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      // Removes "active" class from current question to hide it
      questions[index + 1].classList.remove('active');
      // Adds "active" class to previous question to show it
      questions[index].classList.add('active');
      // Score remains unchanged as it’s already tracked on selection
    });
  });

  // Adds event listener to "Submit" button to calculate and display the result
  submitButton.addEventListener('click', () => {
    // Updates the score for the final question before calculating
    updateScore(questions.length - 1);

    // Finds the meme language category with the highest score from selections
    // Sets initial maximum score to 0 for comparison
    let maxScore = 0;
    // Sets initial meme language to an empty string as a placeholder
    let memeLanguage = '';
    // Loops through each category and its score in the scores object
    for (const [category, score] of Object.entries(scores)) {
      // Checks if the current score exceeds the maximum score found so far
      if (score > maxScore) {
        // Updates the maximum score to the current score if it’s higher
        maxScore = score;
        // Updates the meme language to the current category if its score is higher
        memeLanguage = category;
      }
    }

    // Handle case where no selections were made
    if (memeLanguage === '') {
      alert('Please select at least one option to get your Meme Language!');
    } else {
      // Remove any previous result image
      const existingResult = document.querySelector('.quiz-result');
      if (existingResult) existingResult.remove();

      // Creates a new <div> element to serve as a container for the result image
      const resultDiv = document.createElement('div');
      // Attaches the 'quiz-result' class to the div’s class list for styling and easy removal
      resultDiv.classList.add('quiz-result');
      // Creates a new <img> element to store the image result
      const resultImage = document.createElement('img');
      // Sets the image source to the meme language’s matching file
      resultImage.src = categoryImages[memeLanguage];
      // Adds alternative (alt) text like "Your Meme Language: Chaos" for accessibility
      resultImage.alt = `Your Meme Language: ${memeLanguage.charAt(0).toUpperCase() + memeLanguage.slice(1)}`;
      // Sets the image’s max width to 100% of its container
      resultImage.style.maxWidth = '100%';
      // Adds the result image to the result div container
      resultDiv.appendChild(resultImage);

      // Creates button for sharing the quiz result
      const shareButton = document.createElement('button');
      // Adds the 'share-quiz-btn' class to apply existing CSS styling to the button
      shareButton.classList.add('share-quiz-btn');
      // Sets the button text to "Share Your Meme Language!" for visitor interaction
      shareButton.textContent = 'Share Your Meme Language!';
      // Adds the button to the result div, placing it underneath the image
      resultDiv.appendChild(shareButton);

      // Adds a click event listener to the share button to copy the user's meme result with image and quiz link
      shareButton.addEventListener('click', function() {
        const result = memeLanguage.charAt(0).toUpperCase() + memeLanguage.slice(1);
        const imageUrl = `https://torischuyler.github.io/eos/${categoryImages[memeLanguage]}`;
        const quizLink = 'https://torischuyler.github.io/eos/who-are-you.html#meme-quiz';
        const shareMessage = `My meme language is ${result}! Check out my meme: ${imageUrl} Discover yours here: ${quizLink}`;
        navigator.clipboard.writeText(shareMessage).then(() => {
          alert('Meme result, image, and quiz link copied to clipboard! Share it with your friends!');
        }).catch(err => {
          alert('Failed to copy result. Please try again.');
        });
      });

      // Adds the result div to the quiz wrapper to display it on the page
      quizWrapper.appendChild(resultDiv);

      // Hides the last question to show only the result after submission
      questions[questions.length - 1].classList.remove('active');
    }
  });

  // Handle quiz dropdown selections
  document.querySelectorAll('.quiz-wrapper .question select').forEach(select => {
    // Stores the emoji pop-up element for later use
    const mobileEmojiPop = document.getElementById('mobile-emoji-pop');

    // Adds event listener for when a dropdown option is chosen
    select.addEventListener('change', () => {
      // Grabs the chosen dropdown option
      const option = select.options[select.selectedIndex];
      // Gets the category from the chosen option
      const category = option.dataset.category;

      // Runs if a category is picked
      if (category) {
        // Desktop - Swaps the body’s cursor class to match the category
        document.body.classList.remove('cursor-mystical', 'cursor-cute', 'cursor-chaos', 'cursor-positive', 'cursor-savage', 'cursor-history', 'cursor-tech', 'cursor-renegade');
        document.body.classList.add(`cursor-${category}`);

        // Mobile: Trigger pop-up
        if (window.innerWidth <= 768) {
          // Sets the pop-up to show the category’s emoji
          mobileEmojiPop.textContent = emojiMap[category];
          //Turns on the pop-up by adding the active class
          mobileEmojiPop.classList.add('active');
          // Hides the pop-up after 1 second by removing active and clearing text
          setTimeout(() => {
            mobileEmojiPop.classList.remove('active');
            mobileEmojiPop.textContent = '';
          }, 1000);
        }
      // Resets the pop-up if no category is picked
      } else {
        mobileEmojiPop.textContent = '';
        mobileEmojiPop.classList.remove('active');
      }
    });

    // Desktop only - adds event listener for when the mouse leaves the dropdown
    select.addEventListener('mouseleave', () => {
      // Runs if no category is selected
      if (!select.options[select.selectedIndex].dataset.category) {
        // Sets the dropdown cursor to default
        select.style.cursor = 'default';
      // Clears the dropdown cursor to use the body’s style
      } else {
        select.style.cursor = '';
      }
    });
  });

  // Maps categories to emojis for mobile pop-up and desktop cursor classes
  const emojiMap = {
    mystical: '🧙‍♂️',
    cute: '🐾',
    chaos: '💥',
    positive: '🌟',
    savage: '💀',
    history: '📜',
    tech: '🤖',
    renegade: '🪩'
  };
});
