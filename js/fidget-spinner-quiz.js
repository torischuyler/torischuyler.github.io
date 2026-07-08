// js/fidget-spinner-quiz.js
// Fun inline quiz for the fidget spinner print page.

document.addEventListener('DOMContentLoaded', () => {
  const teaser = document.getElementById('fidget-quiz-teaser');
  const content = document.getElementById('fidget-quiz-content');
  const form = document.getElementById('fidget-quiz-form');
  const minutesInput = document.getElementById('fidget-quiz-minutes');
  const secondsInput = document.getElementById('fidget-quiz-seconds');
  const errorEl = document.getElementById('fidget-quiz-error');
  const feedback = document.getElementById('fidget-quiz-feedback');
  const closeBtn = document.getElementById('fidget-quiz-close');
  const tryAgainBtn = document.getElementById('fidget-quiz-try-again');

  if (!teaser || !content || !form) return;

  const CORRECT_MINUTES = 30;
  const CORRECT_SECONDS = 34;
  const MIN_VALUE = 1;
  const MAX_VALUE = 60;

  const FEEDBACK_HEADER = {
    correct: 'You got it 🤩',
    incorrect: 'Not quite 😵‍💫'
  };

  const FEEDBACK_BODY = `
    <p>Ready, set…Goh!</p>
    <p>James Goh set the record in mid-December 2025 at 30 minutes, 34 seconds.<p>
    <p>Interview with him <a href="https://www.youtube.com/shorts/WwKdH2vo1YM" class="rpi-text-link" target="_blank" rel="noopener noreferrer">here</a>.</p>
  `;

  function isValidValue(value) {
    return Number.isInteger(value) && value >= MIN_VALUE && value <= MAX_VALUE;
  }

  function resetQuiz() {
    form.reset();
    form.hidden = false;

    if (errorEl) {
      errorEl.textContent = '';
      errorEl.hidden = true;
    }

    feedback.innerHTML = '';
    feedback.hidden = true;
    feedback.classList.remove('correct', 'incorrect');

    if (tryAgainBtn) tryAgainBtn.hidden = true;
  }

  function showFeedback(isCorrect) {
    feedback.hidden = false;
    feedback.classList.remove('correct', 'incorrect');
    feedback.classList.add(isCorrect ? 'correct' : 'incorrect');

    const header = isCorrect ? FEEDBACK_HEADER.correct : FEEDBACK_HEADER.incorrect;

    feedback.innerHTML = `
      <div class="feedback-body">
        <p class="feedback-header">${header}</p>
        ${FEEDBACK_BODY}
      </div>
    `;

    form.hidden = true;

    if (tryAgainBtn) tryAgainBtn.hidden = false;
  }

  function showError(message) {
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  function clearError() {
    if (!errorEl) return;
    errorEl.textContent = '';
    errorEl.hidden = true;
  }

  teaser.addEventListener('click', () => {
    const isOpen = !content.hidden;

    if (isOpen) {
      content.hidden = true;
      teaser.setAttribute('aria-expanded', 'false');
    } else {
      content.hidden = false;
      teaser.setAttribute('aria-expanded', 'true');
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearError();

    const minutes = Number(minutesInput.value);
    const seconds = Number(secondsInput.value);

    if (!isValidValue(minutes) || !isValidValue(seconds)) {
      showError('Please enter whole numbers between 1 and 60 for both minutes and seconds.');
      return;
    }

    const isCorrect = minutes === CORRECT_MINUTES && seconds === CORRECT_SECONDS;
    showFeedback(isCorrect);
  });

  if (tryAgainBtn) {
    tryAgainBtn.addEventListener('click', () => {
      tryAgainBtn.hidden = true;
      resetQuiz();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (tryAgainBtn) tryAgainBtn.hidden = true;
      content.hidden = true;
      teaser.setAttribute('aria-expanded', 'false');
      setTimeout(() => {
        resetQuiz();
      }, 250);
    });
  }
});