function fitHomeName(nameEl) {
  const padding = window.innerWidth <= 768 ? 24 : 42;
  const available = window.innerWidth - padding * 2;
  let lo = 1, hi = 25, mid;
  while (lo < hi - 0.05) {
    mid = (lo + hi) / 2;
    nameEl.style.fontSize = mid + 'vw';
    const textWidth = Array.from(nameEl.children).reduce(function (w, s) { return w + s.offsetWidth; }, 0);
    if (textWidth <= available) lo = mid;
    else hi = mid;
  }
  nameEl.style.fontSize = lo + 'vw';
}

document.addEventListener('DOMContentLoaded', function () {
  const nameEl = document.querySelector('.home-name');
  if (!nameEl) return;

  const text = nameEl.textContent.trim();
  nameEl.textContent = '';
  nameEl.style.cursor = 'default';

  text.split('').forEach(function (char, index) {
    const span = document.createElement('span');
    span.className = 'wave-char';
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.setProperty('--i', index);
    nameEl.appendChild(span);
  });

  fitHomeName(nameEl);
  window.addEventListener('resize', function () { fitHomeName(nameEl); });

  nameEl.addEventListener('mouseenter', function () {
    nameEl.querySelectorAll('.wave-char').forEach(function (span, index) {
      span.style.transitionDelay = (index * 0.03) + 's';
      span.classList.add('wave-active');
    });
  });

  nameEl.addEventListener('mouseleave', function () {
    nameEl.querySelectorAll('.wave-char').forEach(function (span, index) {
      span.style.transitionDelay = (index * 0.03) + 's';
      span.classList.remove('wave-active');
    });
  });
});
