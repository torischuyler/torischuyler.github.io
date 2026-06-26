// js/soccer-keychain-quiz.js
// Fun inline quiz for the soccer ball keychain print page.

document.addEventListener('DOMContentLoaded', () => {
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
});