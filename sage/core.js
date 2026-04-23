const sage = {
  // =========================================================
  // CORE STUFF
  // =========================================================
  objects: [],
  updateHooks: [],

  _objCounter: 0,
  _w: 0,
  _h: 0,

  canvas: null,
  ctx: null,

  background: "black",

  lastTime: performance.now(),
  fps: 0,
  _fpsCount: 0,
  _fpsTime: performance.now(),
  showFPS: true,

  // =========================================================
  // INPUT
  // =========================================================
  keysDown: new Set(),
  keysPressed: new Set(),
  keysReleased: new Set(),

  _mouse: { x: 0, y: 0, down: false, pressed: false, released: false },

  ui: { activeInput: null },

  // =========================================================
  // PHYSICS
  // =========================================================
  physics: {
    gravity: 900,
    enabled: false,
    engine: null
  },

  accumulator: 0,
  fixedDt: 1 / 60,

  paused: false,

  // =========================================================
  // SCROLLING
  // =========================================================
  scrolling: {
    enabled: false,
    y: 0,
    speed: 100,
    maxScroll: 0
  },

  dom: {
    root: null,
    elements: new Map()
  },

  // =========================================================
  // CAMERA
  // =========================================================
  _camera: { x: 0, y: 0, zoom: 1 },

  // =========================================================
  // ASSETS
  // =========================================================
  assets: {
    images: {},
    sounds: {},
    jsons: {},
    fonts: {}
  },

  tweens: [],
  particles: [],

  currentScene: null,
  sceneData: {},

  defaults: {
    width: 120,
    height: 40,
    color: "white",
    fontSize: 20,
    font: "Arial"
  },

  // =========================================================
  // UTILITIES
  // =========================================================
  random(min, max) {
    return Math.random() * (max - min) + min;
  },

  randomInt(min, max) {
    return Math.floor(this.random(min, max + 1));
  },

  pointInRect(px, py, x, y, w, h) {
    return px >= x && px <= x + w && py >= y && py <= y + h;
  },

  collide(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  },

  // =========================================================
  // ERROR HANDLING
  // =========================================================
  error(msg, err = null, ctx = {}) {
    console.groupCollapsed("%c[SAGE ERROR] " + msg, "color:red;font-weight:bold;");
    console.error("Message:", msg);

    if (ctx.phase) console.error("Phase:", ctx.phase);
    if (ctx.scene) console.error("Scene:", ctx.scene);
    if (ctx.object) console.error("Object:", ctx.object);

    if (err) console.error(err?.stack || err);

    console.groupEnd();
  },

  // =========================================================
  // INITIALIZATION
  // =========================================================
  init(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this._resize();
    this.dom.root = document.getElementById("ui-layer");
  },

  _resize() {
    if (!this.canvas) return;
    this._w = this.canvas.width;
    this._h = this.canvas.height;
  },

  get width() {
    return this._w || 0;
  },

  get height() {
    return this._h || 0;
  },

  setBackground(color) {
    this.background = color;
  },

  getBackground() {
    return this.background;
  },

  getCanvas() {
    return this.canvas;
  },

  getContext() {
    return this.ctx;
  },

  getFPS() {
    return this.fps;
  },

  getFixedDeltaTime() {
    return this.fixedDt;
  },

  pause() {
    this.paused = true;
  },

  unpause() {
    this.paused = false;
  },

  isPaused() {
    return this.paused;
  }
};

export default sage;