/**
 * FlickeringGrid — vanilla JS canvas port of the React component.
 * Attach to any <canvas> element.
 *
 * Usage:
 *   const fg = new FlickeringGrid(canvas, { color: '#f0ece4', maxOpacity: 0.18, flickerChance: 0.25 });
 *   fg.start();
 *   // fg.stop() to pause
 */
class FlickeringGrid {
  constructor(canvas, opts = {}) {
    this.canvas  = canvas;
    this.ctx     = canvas.getContext('2d');
    this.opts    = Object.assign({
      squareSize:    4,
      gridGap:       6,
      flickerChance: 0.25,
      color:         'rgba(240,236,228,',
      maxOpacity:    0.18,
    }, opts);

    // Normalise color to rgba prefix
    if (!this.opts.color.includes('rgba(')) {
      this.opts.color = this._toRGBA(this.opts.color);
    }

    this._raf    = null;
    this._last   = 0;
    this._grid   = null;
    this._obs    = null;
    this._visible = true;

    this._init();
  }

  _toRGBA(hex) {
    const tmp = document.createElement('canvas');
    tmp.width = tmp.height = 1;
    const ctx = tmp.getContext('2d');
    ctx.fillStyle = hex;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return `rgba(${r},${g},${b},`;
  }

  _init() {
    const parent = this.canvas.parentElement;
    if (!parent) return;

    const ro = new ResizeObserver(() => this._resize());
    ro.observe(parent);
    this._ro = ro;

    const io = new IntersectionObserver(([e]) => {
      this._visible = e.isIntersecting;
      if (this._visible) this._frame(performance.now());
    }, { threshold: 0 });
    io.observe(this.canvas);
    this._io = io;

    this._resize();
  }

  _resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const dpr = window.devicePixelRatio || 1;
    const w   = parent.clientWidth;
    const h   = parent.clientHeight;

    this.canvas.width  = w * dpr;
    this.canvas.height = h * dpr;
    this.canvas.style.width  = w + 'px';
    this.canvas.style.height = h + 'px';

    const { squareSize, gridGap, maxOpacity } = this.opts;
    const cols = Math.floor(w / (squareSize + gridGap));
    const rows = Math.floor(h / (squareSize + gridGap));
    const sq   = new Float32Array(cols * rows);
    for (let i = 0; i < sq.length; i++) sq[i] = Math.random() * maxOpacity;

    this._grid = { w, h, cols, rows, sq, dpr };
  }

  _tick(delta) {
    if (!this._grid) return;
    const { flickerChance, maxOpacity } = this.opts;
    const sq = this._grid.sq;
    for (let i = 0; i < sq.length; i++) {
      if (Math.random() < flickerChance * delta) sq[i] = Math.random() * maxOpacity;
    }
  }

  _draw() {
    if (!this._grid) return;
    const { w, h, cols, rows, sq, dpr } = this._grid;
    const { squareSize, gridGap, color } = this.opts;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, w * dpr, h * dpr);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const op = sq[i * rows + j];
        ctx.fillStyle = color + op + ')';
        ctx.fillRect(
          i * (squareSize + gridGap) * dpr,
          j * (squareSize + gridGap) * dpr,
          squareSize * dpr,
          squareSize * dpr
        );
      }
    }
  }

  _frame(now) {
    if (!this._visible) return;
    const delta = Math.min((now - this._last) / 1000, 0.1);
    this._last  = now;
    this._tick(delta);
    this._draw();
    this._raf = requestAnimationFrame(t => this._frame(t));
  }

  start() {
    if (this._raf) return;
    this._last = performance.now();
    this._raf  = requestAnimationFrame(t => this._frame(t));
  }

  stop() {
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = null;
  }

  destroy() {
    this.stop();
    if (this._ro) this._ro.disconnect();
    if (this._io) this._io.disconnect();
  }
}
