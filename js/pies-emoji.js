/*
  Pies list emoji: On Windows, the US flag emoji often fails to render,
  so swap it for bald eagle + Statue of Liberty. Other platforms keep 🇺🇸.
*/

document.addEventListener('DOMContentLoaded', () => {
  const emoji = document.getElementById('fourth-of-july-pie-emoji');
  if (!emoji) return;

  if (navigator.userAgent.includes('Windows')) {
    emoji.textContent = '🦅🗽';
  }
});
