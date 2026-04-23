export function initInput(sage) {
  // =========================================================
  // KEYBOARD INPUT
  // =========================================================
  window.addEventListener("keydown", e => {
    if (!sage.keysDown.has(e.key)) {
      sage.keysPressed.add(e.key);
    }

    sage.keysDown.add(e.key);

    const activeInput = sage.ui.activeInput;
    if (activeInput) {
      if (e.key === "Backspace") {
        activeInput.value = activeInput.value.slice(0, -1);
      } else if (e.key.length === 1) {
        activeInput.value += e.key;
      }

      if (activeInput.onChange) {
        try {
          activeInput.onChange(activeInput.value);
        } catch (err) {
          sage.error("Input callback error", err, { object: activeInput });
        }
      }
    }
  });

  window.addEventListener("keyup", e => {
    sage.keysDown.delete(e.key);
    sage.keysReleased.add(e.key);
  });

  // =========================================================
  // MOUSE INPUT
  // =========================================================
  window.addEventListener("mousemove", e => {
    const c = sage.canvas;
    if (!c) return;

    const r = c.getBoundingClientRect();
    sage._mouse.x = (e.clientX - r.left) * (c.width / r.width);
    sage._mouse.y = (e.clientY - r.top) * (c.height / r.height);
  });

  window.addEventListener("mousedown", () => {
    sage._mouse.down = true;
    sage._mouse.pressed = true;
  });

  window.addEventListener("mouseup", () => {
    sage._mouse.down = false;
    sage._mouse.released = true;
  });

  window.addEventListener(
    "wheel",
    e => {
      if (sage.scrolling.enabled) {
        e.preventDefault();
        const scrollDelta = e.deltaY > 0 ? 50 : -50;
        sage.setScrollOffset(sage.scrolling.y + scrollDelta);
      }
    },
    { passive: false }
  );

  // =========================================================
  // INPUT STATE HELPERS
  // =========================================================
  sage.isMouseDown = function() {
    return this._mouse.down;
  };

  sage.isMousePressed = function() {
    return this._mouse.pressed;
  };

  sage.isMouseReleased = function() {
    return this._mouse.released;
  };

  sage.getMousePosition = function() {
    return { x: this._mouse.x, y: this._mouse.y };
  };

  sage.isKeyDown = function(key) {
    return this.keysDown.has(key);
  };

  sage.isKeyPressed = function(key) {
    return this.keysPressed.has(key);
  };

  sage.isKeyReleased = function(key) {
    return this.keysReleased.has(key);
  };

  sage.getKeysDown = function() {
    return [...this.keysDown];
  };

  sage.getActiveInput = function() {
    return this.ui.activeInput;
  };

  sage.clearActiveInput = function() {
    this.ui.activeInput = null;
  };
}