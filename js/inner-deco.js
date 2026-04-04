// Inject flickering grid on inner pages
(function () {
  var wrap = document.createElement('div');
  wrap.className = 'grid-canvas-wrap';
  wrap.id = 'grid-bg';
  var canvas = document.createElement('canvas');
  canvas.id = 'grid-canvas';
  wrap.appendChild(canvas);
  document.body.insertBefore(wrap, document.body.firstChild);
})();

// Must run after flickering-grid.js is loaded
window.addEventListener('DOMContentLoaded', function () {
  var canvas = document.getElementById('grid-canvas');
  if (canvas && window.FlickeringGrid) {
    var fg = new FlickeringGrid(canvas, {
      squareSize:    4,
      gridGap:       7,
      flickerChance: 0.18,
      color:         '#111111',
      maxOpacity:    0.05,
    });
    fg.start();
  }
});
