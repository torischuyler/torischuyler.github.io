/* 🤓 Meme Quiz Logic: This script controls the "Your Meme Language" quiz, managing question navigation and scoring selections. */

document.addEventListener('DOMContentLoaded', () => {
  // Centralized DOM queries for clarity and efficiency
  const questions = document.querySelectorAll('.question');
  const quizWrapper = document.querySelector('.quiz-wrapper');
  const submitButton = document.querySelector('.submit-btn');

  // Score tracking for meme language categories
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

  // Track last selected category per question
  const lastSelections = {};

  // Mapping of categories to image filenames
  const categoryImages = {
    mystical: 'assets/meme-results/trigon.jpg',
    cute: 'assets/meme-results/lil-twirlip.jpg',
    chaos: 'assets/meme-results/subway-rats.jpg',
    positive: 'assets/meme-results/giggle-blossom.jpg',
    savage: 'assets/meme-results/bone-appetit.jpg',
    history: 'assets/meme-results/alexander-hamilton.jpg',
    tech: 'assets/meme-results/steve-jobs.jpg',
    renegade: 'assets/meme-results/retina-goggles.jpg'
  };

  // Emoji mapping for mobile pop-up and desktop cursor
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

  // Updates score based on dropdown selection
  function updateScore(questionIndex) {
    const select = questions[questionIndex].querySelector('select');
    const selectedOption = select.options[select.selectedIndex];
    const newCategory = selectedOption.dataset.category;

    // Exit if no valid category
    if (!newCategory) return;

    const oldCategory = lastSelections[questionIndex];
    if (oldCategory && oldCategory !== newCategory) {
      scores[oldCategory]--;
    }
    if (newCategory !== oldCategory) {
      scores[newCategory]++;
      lastSelections[questionIndex] = newCategory;
    }
  }

  // Displays quiz result based on highest score
  function displayResult() {
    let maxScore = 0;
    let memeLanguage = '';
    for (const [category, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        memeLanguage = category;
      }
    }

    if (!memeLanguage) {
      alert('Please select at least one option to get your Meme Language!');
      return;
    }

    // Add class to body to hide other elements
    document.body.classList.add('quiz-result-only');

    // Remove existing result
    const existingResult = document.querySelector('.quiz-result');
    if (existingResult) existingResult.remove();

    // Create result container
    const resultDiv = document.createElement('div');
    resultDiv.classList.add('quiz-result');

    // Add result image
    const resultImage = document.createElement('img');
    resultImage.src = categoryImages[memeLanguage];
    resultImage.alt = `Your Meme Language: ${memeLanguage.charAt(0).toUpperCase() + memeLanguage.slice(1)}`;
    resultImage.style.maxWidth = '100%';
    resultDiv.appendChild(resultImage);

    // Add share button
    const shareButton = document.createElement('button');
    shareButton.classList.add('share-quiz-btn');
    shareButton.textContent = 'Share Your Meme Language!';
    resultDiv.appendChild(shareButton);

    // Add download button
    const downloadButton = document.createElement('button');
    downloadButton.classList.add('download-scores-btn');
    downloadButton.textContent = 'Download Your Scores';
    resultDiv.appendChild(downloadButton);

    // Share button click handler
    shareButton.addEventListener('click', () => {
      const result = memeLanguage.charAt(0).toUpperCase() + memeLanguage.slice(1);
      const imageUrl = `https://torischuyler.github.io/eOS/${categoryImages[memeLanguage]}`;
      const quizLink = 'https://torischuyler.github.io/eOS/who-are-you.html#meme-quiz';
      const shareMessage = `My meme language is ${result}! Check out my meme: ${imageUrl} Discover yours here: ${quizLink}`;
      navigator.clipboard.writeText(shareMessage).then(() => {
        alert('Meme result, image, and quiz link copied to clipboard! Share it with your friends!');
      }).catch(() => {
        alert('Failed to copy result. Please try again.');
      });
    });

    // Download button click handler
    downloadButton.addEventListener('click', () => {
      window.saveScoresToCSV(JSON.stringify(scores));
    });

    // Append result to quiz wrapper and hide last question
    quizWrapper.appendChild(resultDiv);
    questions[questions.length - 1].classList.remove('active');
  }

  // Set up dropdown and navigation event listeners
  questions.forEach((question, index) => {
    const select = question.querySelector('select');
    const mobileEmojiPop = document.getElementById('mobile-emoji-pop');
    let currentCursorClass = '';

    // Handle dropdown changes (scoring and UI effects)
    select.addEventListener('change', () => {
      updateScore(index); // Update score
      const option = select.options[select.selectedIndex];
      const category = option.dataset.category;

      if (category) {
        // Update cursor for desktop
        if (currentCursorClass) {
          document.body.classList.remove(currentCursorClass);
        }
        currentCursorClass = `cursor-${category}`;
        document.body.classList.add(currentCursorClass);

        // Mobile emoji pop-up
        if (window.innerWidth <= 768) {
          mobileEmojiPop.textContent = emojiMap[category];
          mobileEmojiPop.classList.add('active');
          setTimeout(() => {
            mobileEmojiPop.classList.remove('active');
            mobileEmojiPop.textContent = '';
          }, 1000);
        }
      } else {
        // Reset cursor and pop-up
        if (currentCursorClass) {
          document.body.classList.remove(currentCursorClass);
          currentCursorClass = '';
        }
        mobileEmojiPop.textContent = '';
        mobileEmojiPop.classList.remove('active');
      }
    });

    // Handle cursor reset on mouseleave
    select.addEventListener('mouseleave', () => {
      select.style.cursor = select.options[select.selectedIndex].dataset.category ? '' : 'default';
    });

    // Handle navigation buttons
    const nextButton = question.querySelector('.next-btn');
    const backButton = question.querySelector('.back-btn');

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        updateScore(index);
        questions[index].classList.remove('active');
        questions[index + 1].classList.add('active');
      });
    }

    if (backButton) {
      backButton.addEventListener('click', () => {
        if (index > 0) {
          questions[index].classList.remove('active');
          questions[index - 1].classList.add('active');
        }
      });
    }
  });

  // Handle submit button
  submitButton.addEventListener('click', () => {
    updateScore(questions.length - 1);
    displayResult();
  });
});
