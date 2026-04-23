export function startLoop(sage) {

  // =========================================================
  // TWEENS
  // =========================================================
  sage.tween = function(obj, property, targetValue, duration, easing = "linear", onComplete = null) {
    const startValue = obj[property];
    const startTime = performance.now();

    const tweenObj = {
      obj,
      property,
      startValue,
      targetValue,
      duration,
      startTime,
      easing,
      onComplete,
      update: (currentTime) => {
        const elapsed = currentTime - tweenObj.startTime;
        const progress = Math.min(elapsed / tweenObj.duration, 1);

        let easedProgress;
        switch (tweenObj.easing) {
          case "easeOut":
            easedProgress = 1 - Math.pow(1 - progress, 3);
            break;
          case "easeIn":
            easedProgress = progress * progress * progress;
            break;
          case "easeInOut":
            easedProgress =
              progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            break;
          default:
            easedProgress = progress;
        }

        tweenObj.obj[tweenObj.property] =
          tweenObj.startValue +
          (tweenObj.targetValue - tweenObj.startValue) * easedProgress;

        if (progress >= 1) {
          tweenObj.obj[tweenObj.property] = tweenObj.targetValue;
          if (tweenObj.onComplete) tweenObj.onComplete();
          return true;
        }
        return false;
      }
    };

    this.tweens.push(tweenObj);
  };

  // =========================================================
  // PARTICLES
  // =========================================================
  sage.createParticleSystem = function(x, y, config = {}) {
    const defaults = {
      count: 10,
      speed: 100,
      speedVariance: 50,
      angle: -Math.PI / 2,
      angleVariance: Math.PI / 4,
      life: 2,
      lifeVariance: 0.5,
      size: 5,
      sizeVariance: 2,
      color: "white",
      gravity: 0,
      fade: true
    };

    const settings = { ...defaults, ...config };
    const particles = [];

    for (let i = 0; i < settings.count; i++) {
      const angle =
        settings.angle + (Math.random() - 0.5) * settings.angleVariance;
      const speed =
        settings.speed + (Math.random() - 0.5) * settings.speedVariance;
      const life = settings.life + (Math.random() - 0.5) * settings.lifeVariance;
      const size = settings.size + (Math.random() - 0.5) * settings.sizeVariance;

      particles.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: life,
        maxLife: life,
        size: size,
        color: settings.color,
        gravity: settings.gravity,
        fade: settings.fade
      });
    }

    this.particles.push({
      particles: particles,
      update: (dt) => {
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vy += p.gravity * dt;
          p.life -= dt;

          if (p.life <= 0) {
            particles.splice(i, 1);
          }
        }
        return particles.length === 0;
      },
      render: () => {
        const ctx = this.ctx;
        if (!ctx) return;

        for (const p of particles) {
          const screenPos = this.worldToScreen(p.x, p.y);
          const alpha = p.fade ? p.life / p.maxLife : 1;
          ctx.globalAlpha = alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(screenPos.x, screenPos.y, p.size * this._camera.zoom, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
    });

    return this.particles[this.particles.length - 1];
  };

  // =========================================================
  // UPDATE HOOKS
  // =========================================================
  sage.onUpdate = function(fn) {
    this.updateHooks.push(fn);
  };

  // =========================================================
  // MAIN LOOP STEP
  // =========================================================
  sage.step = function(dt) {
    this.accumulator += dt;

    while (this.accumulator >= this.fixedDt) {
      this._update(this.fixedDt);
      this._mouse.pressed = false;
      this._mouse.released = false;
      this.keysPressed.clear();
      this.keysReleased.clear();
      this.accumulator -= this.fixedDt;
    }
  };

  sage._update = function(dt) {
    if (this.paused) return;

    const objs = this.objects.slice();
    const mousePressed = this._mouse.pressed;

    try {
      // -------------------------
      // OBJECT UPDATE
      // -------------------------
      for (const o of objs) {
        if (o.rotSpeed) o.rotation += o.rotSpeed * dt;

        if (this.physics.enabled && o.physicsBody) {
          o.x = o.physicsBody.position.x - o.width / 2;
          o.y = o.physicsBody.position.y - o.height / 2;
          o.rotation = o.physicsBody.angle;
        } else if (o.rigid) {
          o.vy += this.physics.gravity * dt;
          o.x += o.vx * dt;
          o.y += o.vy * dt;

          if (o.y + o.height > this.height) {
            o.y = this.height - o.height;
            o.vy = 0;
          }
        } else {
          o.x += o.vx * dt;
          o.y += o.vy * dt;
        }
      }

      for (const o of objs) {
        if (o.dom && o._dom) {
          o._dom.textContent = o.text;
        }
      }

      // -------------------------
      // UI UPDATE
      // -------------------------
      for (const o of objs) {
        if (!o.ui) continue;
        const m = this._mouse;
        const p = this.worldToScreen(o.x, o.y);

        o.hover =
          m.x >= p.x &&
          m.x <= p.x + o.width * this._camera.zoom &&
          m.y >= p.y &&
          m.y <= p.y + o.height * this._camera.zoom;

        if (o.hover && mousePressed) {
          if (o.type === "button" && o.onClick) {
            o.onClick(o);
          }

          if (o.link) {
            window.open(o.link, "_blank");
          }
        }

        if (o.type === "input" && o.hover && mousePressed) {
          this.ui.activeInput = o;
        }
      }

      // -------------------------
      // SCROLLING UPDATE
      // -------------------------
      if (this.scrolling.enabled) {
        const scrollDelta =
          (this.keysDown.has("ArrowDown") ? 1 : 0) -
          (this.keysDown.has("ArrowUp") ? 1 : 0);
        if (scrollDelta !== 0) {
          this.setScrollOffset(
            this.scrolling.y + scrollDelta * this.scrolling.speed * dt
          );
        }
      }

      // -------------------------
      // UPDATE HOOKS
      // -------------------------
      for (const fn of this.updateHooks) {
        try {
          fn(dt);
        } catch (err) {
          this.error("Update hook error", err);
        }
      }
    } catch (err) {
      this.error("Update loop crash", err);
    }

    // -------------------------
    // PHYSICS UPDATE
    // -------------------------
    if (this.physics.enabled && this.physics.engine) {
      Matter.Engine.update(this.physics.engine, this.fixedDt * 1000);
    }

    // -------------------------
    // PARTICLE UPDATE
    // -------------------------
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const dead = this.particles[i].update(dt);
      if (dead && this.particles[i].particles.length === 0) {
        this.particles.splice(i, 1);
      }
    }

    // -------------------------
    // TWEEN UPDATES
    // -------------------------
    const now = performance.now();
    for (let i = this.tweens.length - 1; i >= 0; i--) {
      if (this.tweens[i].update(now)) {
        this.tweens.splice(i, 1);
      }
    }

    // -------------------------
    // FPS COUNTER
    // -------------------------
    this._fpsCount++;

    if (now - this._fpsTime >= 1000) {
      this.fps = this._fpsCount;
      this._fpsCount = 0;
      this._fpsTime = now;
    }
  };

  function loop() {
    const now = performance.now();
    const dt = (now - sage.lastTime) * 0.001;

    sage.lastTime = now;

    sage.step(dt);
    sage.render();

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}