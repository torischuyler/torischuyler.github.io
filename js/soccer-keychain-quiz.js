// js/soccer-keychain-quiz.js
// Fun inline quizzes for the soccer ball keychain print page.

document.addEventListener('DOMContentLoaded', () => {
  initPeleQuiz();
  initPanelsQuiz();
});

function initPeleQuiz() {
  const teaser = document.getElementById('soccer-quiz-teaser');
  const content = document.getElementById('soccer-quiz-content');
  const optionsContainer = document.getElementById('soccer-quiz-options');
  const feedback = document.getElementById('soccer-quiz-feedback');
  const closeBtn = document.getElementById('soccer-quiz-close');
  const tryAgainBtn = document.getElementById('soccer-quiz-try-again');

  if (!teaser || !content) return;

  const CORRECT_ANSWER = 'B';

  const FEEDBACK_BODY = `Pelé did not deliberately choose number 10 for any special symbolic reason.

At the 1958 World Cup in Sweden, Brazil had not submitted their roster numbers in advance. As a result, numbers were randomly assigned to their players. The teenage Pelé was given #10 purely by chance.`;

  const FEEDBACK = {
    correct: `Exactly, ${FEEDBACK_BODY}`,
    incorrect: `Actually no, ${FEEDBACK_BODY}`
  };

  function resetQuiz() {
    const opts = optionsContainer.querySelectorAll('.tug-option');
    opts.forEach((opt) => {
      opt.disabled = false;
      opt.classList.remove('selected', 'correct', 'incorrect', 'revealed');
    });

    feedback.innerHTML = '';
    feedback.hidden = true;
    feedback.classList.remove('correct', 'incorrect');

    optionsContainer.hidden = false;

    if (tryAgainBtn) tryAgainBtn.hidden = true;
  }

  function showFeedback(isCorrect) {
    feedback.hidden = false;
    feedback.classList.remove('correct', 'incorrect');
    feedback.classList.add(isCorrect ? 'correct' : 'incorrect');

    const text = isCorrect ? FEEDBACK.correct : FEEDBACK.incorrect;

    feedback.innerHTML = `
      <div class="feedback-body">
        ${text.split('\n\n').map(p => `<p>${p}</p>`).join('')}
      </div>
    `;

    optionsContainer.hidden = true;

    if (tryAgainBtn) tryAgainBtn.hidden = false;
  }

  function selectAnswer(optionEl) {
    const answer = optionEl.dataset.answer;
    const isCorrect = answer === CORRECT_ANSWER;

    const allOptions = optionsContainer.querySelectorAll('.tug-option');
    allOptions.forEach((opt) => {
      opt.disabled = true;
      opt.classList.add('revealed');
    });

    optionEl.classList.add('selected', isCorrect ? 'correct' : 'incorrect');

    const correctEl = optionsContainer.querySelector(`[data-answer="${CORRECT_ANSWER}"]`);
    if (correctEl) {
      correctEl.classList.add('correct');
    }

    showFeedback(isCorrect);
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

  optionsContainer.addEventListener('click', (e) => {
    const option = e.target.closest('.tug-option');
    if (!option || option.disabled) return;
    selectAnswer(option);
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
}

function initPanelsQuiz() {
  const teaser = document.getElementById('soccer-panels-quiz-teaser');
  const content = document.getElementById('soccer-panels-quiz-content');
  const form = document.getElementById('soccer-panels-quiz-form');
  const answerInput = document.getElementById('soccer-panels-quiz-answer');
  const errorEl = document.getElementById('soccer-panels-quiz-error');
  const feedback = document.getElementById('soccer-panels-quiz-feedback');
  const closeBtn = document.getElementById('soccer-panels-quiz-close');
  const tryAgainBtn = document.getElementById('soccer-panels-quiz-try-again');

  if (!teaser || !content || !form) return;

  const CORRECT_ANSWER = 32;
  const MIN_VALUE = 10;
  const MAX_VALUE = 40;

  const FEEDBACK_BODY = `
    <p>A traditional soccer ball has <strong>32 panels</strong> in total. The iconic black and white design (originally made famous by the Adidas Telstar in the 1970s) is geometrically known as a <strong>truncated isocahedron</strong>. The <strong>32 panels</strong> are broken down into two distinct shapes:</p>
    <ul>
      <li><strong>12 black pentagons</strong> (five-sided polygons)</li>
      <li><strong>20 white hexagons</strong> (six-sided polygons)</li>
    </ul>
    <img class="rpi-centered-img" src="/assets/images/3d-printing/soccer-keychain/soccer-ball-combinatorics.png" alt="Diagram showing the combinatorics of a soccer ball with pentagons and hexagons">
    <p>Credit: <a href="https://www.americanscientist.org/article/the-topology-and-combinatorics-of-soccer-balls" class="rpi-text-link" target="_blank" rel="noopener noreferrer">Combinatorics of Soccer Balls</a></p>
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

    feedback.innerHTML = `
      <div class="feedback-body">
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

    const answer = Number(answerInput.value);

    if (!isValidValue(answer)) {
      showError('Please enter a whole number between 10 and 40.');
      return;
    }

    const isCorrect = answer === CORRECT_ANSWER;
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
}