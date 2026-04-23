sage.setBackground("#8EC6FF");

const PLAYER_SIZE = 50;
const GROUND_Y = 520;

const spikes = [];

const SPIKE_SIZE = 50;
const GRAVITY = 900;
const JUMP_STRENGTH = 450;

let velocityY = 0;
let angularVelocity = 0;
let onGround = false;

let timer = 0;
let nextSpawn = Math.random() * 1.2 + 0.6;

let dead = false;

function worldW() {
  const canvas = sage.getCanvas();
  return canvas?.width || window.innerWidth;
}

// ===== WORLD =====
const floor = sage.createObject("square", 0, GROUND_Y, {
  width: worldW(),
  height: 2000,
  color: "black"
});

const player = sage.createObject("square", 100, GROUND_Y - PLAYER_SIZE, {
  width: PLAYER_SIZE,
  height: PLAYER_SIZE,
  color: "yellow",
  rotation: 0
});

// ===== SPIKE =====
class Spike {
  constructor() {
    this.obj = sage.createObject("triangle", worldW() + 50, GROUND_Y - SPIKE_SIZE, {
      width: SPIKE_SIZE,
      height: SPIKE_SIZE,
      color: "black"
    });
  }

  update(dt) {
    if (dead) return;
    this.obj.x -= 220 * dt;
  }
}

function spawnSpike() {
  spikes.push(new Spike());
}

// ===== UPDATE =====
sage.onUpdate((dt) => {
  if (dead) return;

  // SPAWN
  timer += dt;
  if (timer >= nextSpawn) {
    timer -= nextSpawn;
    nextSpawn = Math.random() * 1.2 + 0.6;
    spawnSpike();
  }

  // SPIKES
  for (let i = spikes.length - 1; i >= 0; i--) {
    const s = spikes[i];
    s.update(dt);

    if (s.obj.x < -120) {
      sage.removeObject(s.obj);
      spikes.splice(i, 1);
      continue;
    }

    if (sage.collide(s.obj, player)) {
      dead = true;
      player.color = "red";

      setTimeout(() => {
        sage.loadScene(sage.currentScene);
      }, 300);

      return;
    }
  }

  // INPUT (NEW API ONLY)
  const space =
    sage.keysDown.has(" ") ||
    sage.keysDown.has("Space") ||
    sage.keysDown.has("ArrowUp");

  if (space && onGround) {
    velocityY = -JUMP_STRENGTH;
    onGround = false;
    angularVelocity = 11;
  }

  // GRAVITY
  velocityY += GRAVITY * dt;
  player.y += velocityY * dt;

  // ROTATION
  angularVelocity *= 0.97;
  player.rotation += angularVelocity * dt;

  // GROUND
  const groundLevel = GROUND_Y - PLAYER_SIZE;

  if (player.y >= groundLevel) {
    player.y = groundLevel;
    velocityY = 0;
    onGround = true;

    const q = Math.PI / 2;
    player.rotation = Math.round(player.rotation / q) * q;

    angularVelocity = 0;
  }
});