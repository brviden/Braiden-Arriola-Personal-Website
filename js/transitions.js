document.addEventListener('DOMContentLoaded', function () {
  // Fade in on load
  requestAnimationFrame(function () {
    document.body.classList.add('visible');
  });

  // Fade out before navigating away
  document.querySelectorAll('a[href]').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
        href.startsWith('http') || link.target === '_blank') return;

    link.addEventListener('click', function (e) {
      e.preventDefault();
      document.body.classList.remove('visible');
      setTimeout(function () {
        window.location.href = href;
      }, 150);
    });
  });
});

// Fix back/forward cache: page may be restored with opacity 0
window.addEventListener('pageshow', function () {
  document.body.classList.add('visible');
});
