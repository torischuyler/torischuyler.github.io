// js/tugboat-quiz.js
// Fun inline quiz for the tugboat print page.

document.addEventListener('DOMContentLoaded', () => {
  const teaser = document.getElementById('tug-quiz-teaser');
  const content = document.getElementById('tug-quiz-content');
  const optionsContainer = document.getElementById('tug-quiz-options');
  const feedback = document.getElementById('tug-quiz-feedback');
  const closeBtn = document.getElementById('tug-quiz-close');
  const tryAgainBtn = document.getElementById('tug-quiz-try-again');

  if (!teaser || !content) return;

  const CORRECT_ANSWER = 'D';

  const FEEDBACK = {
    correct: `Ding ding ding! Jonathan Hulls, an English inventor from the early 1700s, who patented the first known design for a steam-powered tugboat in 1736. Ironically enough, yes, his last name was Hulls. He proposed a small paddle-wheel vessel powered by a Newcomen atmospheric engine that could tow larger ships in and out of harbors against wind, tide, or in a calm, essentially inventing the concept of the helper tug we know today.

Rumor has it people at the time thought he was pretty ridiculous for it; locals even made up a mocking rhyme calling him an ass who couldn’t make his “paper skull” machine work, and his ideas largely got dismissed or forgotten despite his detailed plans and patent.`,
    incorrect: `Wah-wah-waah… It was actually Jonathan Hulls, an English inventor from the early 1700s, who patented the first known design for a steam-powered tugboat in 1736. Ironically enough, yes, his last name was Hulls. He proposed a small paddle-wheel vessel powered by a Newcomen atmospheric engine that could tow larger ships in and out of harbors against wind, tide, or in a calm, essentially inventing the concept of the helper tug we know today.

Rumor has it people at the time thought he was pretty ridiculous for it; locals even made up a mocking rhyme calling him an ass who couldn’t make his “paper skull” machine work, and his ideas largely got dismissed or forgotten despite his detailed plans and patent.`
  };

  function resetQuiz() {
    // Reset options
    const opts = optionsContainer.querySelectorAll('.tug-option');
    opts.forEach((opt) => {
      opt.disabled = false;
      opt.classList.remove('selected', 'correct', 'incorrect', 'revealed');
    });

    // Clear feedback
    feedback.innerHTML = '';
    feedback.hidden = true;
    feedback.classList.remove('correct', 'incorrect');

    // Show options again
    optionsContainer.hidden = false;

    if (tryAgainBtn) tryAgainBtn.hidden = true;
  }

  function showFeedback(isCorrect) {
    feedback.hidden = false;
    feedback.classList.remove('correct', 'incorrect');
    feedback.classList.add(isCorrect ? 'correct' : 'incorrect');

    const text = isCorrect ? FEEDBACK.correct : FEEDBACK.incorrect;

    // Render user-provided response text exactly (already contains the ding / wah lead-in)
    feedback.innerHTML = `
      <div class="feedback-body">
        ${text.split('\n\n').map(p => `<p>${p}</p>`).join('')}
      </div>
    `;

    // Hide the option buttons after answering (keeps context clean)
    optionsContainer.hidden = true;

    // Show try again
    if (tryAgainBtn) tryAgainBtn.hidden = false;
  }

  function selectAnswer(optionEl) {
    const answer = optionEl.dataset.answer;
    const isCorrect = answer === CORRECT_ANSWER;

    // Disable all
    const allOptions = optionsContainer.querySelectorAll('.tug-option');
    allOptions.forEach((opt) => {
      opt.disabled = true;
      opt.classList.add('revealed');
    });

    // Mark selection
    optionEl.classList.add('selected', isCorrect ? 'correct' : 'incorrect');

    // Reveal the true correct answer
    const correctEl = optionsContainer.querySelector(`[data-answer="${CORRECT_ANSWER}"]`);
    if (correctEl) {
      correctEl.classList.add('correct');
    }

    showFeedback(isCorrect);
  }

  // Teaser click: toggle the content
  teaser.addEventListener('click', () => {
    const isOpen = !content.hidden;

    if (isOpen) {
      // Close it
      content.hidden = true;
      teaser.setAttribute('aria-expanded', 'false');
    } else {
      // Open / ensure visible
      content.hidden = false;
      teaser.setAttribute('aria-expanded', 'true');
      // If they had answered before and closed, let them reset on reopen if needed
      // For simplicity we leave previous state; user can use close button inside
    }
  });

  // Option clicks
  optionsContainer.addEventListener('click', (e) => {
    const option = e.target.closest('.tug-option');
    if (!option || option.disabled) return;
    selectAnswer(option);
  });

  // Try again: reset without collapsing the panel
  if (tryAgainBtn) {
    tryAgainBtn.addEventListener('click', () => {
      tryAgainBtn.hidden = true;
      resetQuiz();
    });
  }

  // Close button inside: collapse the panel and reset so it can be reopened fresh
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (tryAgainBtn) tryAgainBtn.hidden = true;
      content.hidden = true;
      teaser.setAttribute('aria-expanded', 'false');
      // Reset for a fresh try next time
      setTimeout(() => {
        resetQuiz();
      }, 250);
    });
  }

  // Keyboard support for options (enter/space already works on buttons)
  // Bonus: allow "c" etc? Nah, keep simple.
});