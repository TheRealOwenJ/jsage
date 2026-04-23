export function initRender(sage) {

  // =========================================================
  // COORDINATE TRANSFORM
  // =========================================================
  sage.worldToScreen = function(x, y) {
    return {
      x: (x - this._camera.x) * this._camera.zoom,
      y: (y - this._camera.y - this.scrolling.y) * this._camera.zoom
    };
  };

  sage.worldToScreenNoScroll = function(x, y) {
    return {
      x: (x - this._camera.x) * this._camera.zoom,
      y: (y - this._camera.y) * this._camera.zoom
    };
  };

  // =========================================================
  // CAMERA FUNCTIONS
  // =========================================================
  sage.setCameraPosition = function(x, y) {
    this._camera.x = x;
    this._camera.y = y;
  };

  sage.moveCamera = function(dx, dy) {
    this._camera.x += dx;
    this._camera.y += dy;
  };

  sage.getCameraPosition = function() {
    return { x: this._camera.x, y: this._camera.y };
  };

  sage.setCameraZoom = function(z) {
    this._camera.zoom = z;
  };

  sage.getCameraZoom = function() {
    return this._camera.zoom;
  };

  // =========================================================
  // SCROLLING
  // =========================================================
  sage.enableScrolling = function(maxScroll = this.height * 2, speed) {
    this.scrolling.enabled = true;
    this.scrolling.maxScroll = Math.max(0, maxScroll - this.height);
    this.scrolling.y = 0;
    this.scrolling.speed = speed || 100;
  };

  sage.disableScrolling = function() {
    this.scrolling.enabled = false;
    this.scrolling.y = 0;
  };

  sage.getScrollOffset = function() {
    return this.scrolling.y;
  };

  sage.setScrollOffset = function(y) {
    this.scrolling.y = Math.max(
      0,
      Math.min(y, this.scrolling.maxScroll || 0)
    );
  };

  // =========================================================
  // DRAWING FUNCTIONS
  // =========================================================
  sage.drawRect = function(x, y, width, height, color = "white", filled = true) {
    const ctx = this.ctx;
    if (!ctx) return;

    const p = this.worldToScreen(x, y);
    ctx.fillStyle = color;
    ctx.strokeStyle = color;

    if (filled) {
      ctx.fillRect(p.x, p.y, width * this._camera.zoom, height * this._camera.zoom);
    } else {
      ctx.strokeRect(p.x, p.y, width * this._camera.zoom, height * this._camera.zoom);
    }
  };

  sage.drawCircle = function(x, y, radius, color = "white", filled = true) {
    const ctx = this.ctx;
    if (!ctx) return;

    const p = this.worldToScreen(x, y);
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius * this._camera.zoom, 0, Math.PI * 2);

    if (filled) {
      ctx.fill();
    } else {
      ctx.stroke();
    }
  };

  sage.drawLine = function(x1, y1, x2, y2, color = "white", width = 1) {
    const ctx = this.ctx;
    if (!ctx) return;

    const p1 = this.worldToScreen(x1, y1);
    const p2 = this.worldToScreen(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  };

  sage.drawText = function(text, x, y, color = "white", fontSize = 20, font = "Arial") {
    const ctx = this.ctx;
    if (!ctx) return;

    const p = this.worldToScreen(x, y);
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px ${font}`;
    ctx.fillText(text, p.x, p.y);
  };

  // =========================================================
  // RENDERING
  // =========================================================
  sage.render = function() {
    const ctx = this.ctx;
    if (!ctx) return;

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.fillStyle = this.background;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.font = `${this.defaults.fontSize}px ${this.defaults.font}`;

    for (const o of this.objects) {
      const p = this.worldToScreen(o.x, o.y);

      if (o.dom) continue;

      if (o.type === "button") {
        ctx.fillStyle = o.hover ? "#555" : "#333";
        ctx.fillRect(p.x, p.y, o.width, o.height);

        ctx.fillStyle = "white";
        ctx.font = `${o.fontSize}px ${o.font}`;
        ctx.fillText(o.text, p.x + 10, p.y + o.fontSize + 8);
        ctx.font = `${this.defaults.fontSize}px ${this.defaults.font}`;
        continue;
      }

      if (o.type === "input") {
        ctx.fillStyle = o.hover ? "#444" : "#222";
        ctx.fillRect(p.x, p.y, o.width, o.height);

        ctx.strokeStyle = this.ui.activeInput === o ? "cyan" : "white";
        ctx.strokeRect(p.x, p.y, o.width, o.height);

        ctx.fillStyle = "white";
        ctx.font = `${o.fontSize}px ${o.font}`;
        ctx.fillText(o.value || "", p.x + 10, p.y + o.fontSize + 8);
        ctx.font = `${this.defaults.fontSize}px ${this.defaults.font}`;
        continue;
      }

      if (o.type === "text") {
        ctx.fillStyle = o.color;
        ctx.font = `${o.fontSize}px ${o.font}`;
        ctx.fillText(o.text, p.x, p.y);
        ctx.font = `${this.defaults.fontSize}px ${this.defaults.font}`;
        continue;
      }

      ctx.save();

      const cx = p.x + o.width / 2;
      const cy = p.y + o.height / 2;

      ctx.translate(cx, cy);
      ctx.rotate(o.rotation || 0);
      ctx.translate(-cx, -cy);

      ctx.fillStyle = o.color;

      if (o.type === "square") {
        ctx.fillRect(p.x, p.y, o.width, o.height);
      }

      if (o.type === "circle") {
        ctx.beginPath();
        ctx.arc(cx, cy, o.width / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      if (o.type === "triangle") {
        ctx.beginPath();
        ctx.moveTo(p.x + o.width / 2, p.y);
        ctx.lineTo(p.x + o.width, p.y + o.height);
        ctx.lineTo(p.x, p.y + o.height);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }

    // -------------------------
    // RENDER PARTICLES
    // -------------------------
    for (const system of this.particles) {
      system.render();
    }

    ctx.fillStyle = "white";
    if (this.showFPS) {
      ctx.fillText("FPS: " + this.fps, 10, this.height - 10);
    }

    // -------------------------
    // UPDATE DOM ELEMENT POSITIONS
    // -------------------------
    for (const o of this.objects) {
      if (!o.dom || !o._dom) continue;

      const p = this.worldToScreen(o.x, o.y);
      o._dom.style.transform = `translate(${p.x}px, ${p.y}px) scale(${this._camera.zoom})`;
    }
  };
}
