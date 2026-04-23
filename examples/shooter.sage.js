const speed = 200;

let kills = 0;

const player = sage.createObject("square", 100, 100, {
  width: 20,
  height: 20,
  color: "red"
});

const killtext = sage.createObject("text", 40, 40, {
  text: "Kills: 0",
  color: "white"
});

const bullets = [];
const enemies = [];

// =====================
// ENEMY CLASS
// =====================
class Enemy {
  constructor(x, y) {
    this.obj = sage.createObject("square", x, y, {
      width: 20,
      height: 20,
      color: "green"
    });

    this.dead = false;
  }

  kill() {
    if (this.dead) return;
    this.dead = true;
    sage.removeObject(this.obj);
    kills += 1;
  }
}

// =====================
// BULLET CLASS
// =====================
class Bullet {
  constructor(x, y, targetX, targetY) {
    this.obj = sage.createObject("square", x, y, {
      width: 6,
      height: 6,
      color: "yellow"
    });

    this.speed = 500;

    const dx = targetX - x;
    const dy = targetY - y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

    this.dirX = dx / dist;
    this.dirY = dy / dist;
  }

  update(dt) {
    this.obj.x += this.dirX * this.speed * dt;
    this.obj.y += this.dirY * this.speed * dt;
  }
}

// =====================
// SHOOT
// =====================
function shoot() {
  const m = sage.getMousePosition();

  bullets.push(new Bullet(player.x, player.y, m.x, m.y));
}

let shootCooldown = 0;

// =====================
// SPAWN SYSTEM
// =====================
let spawnTimer = 0;

function spawnEnemy() {
  const x = Math.random() * (sage.width - 40);
  const y = Math.random() * (sage.height - 40);

  enemies.push(new Enemy(x, y));
}

// =====================
// UPDATE LOOP
// =====================
sage.onUpdate((dt) => {
  killtext.text = "Kills: " + kills;

  shootCooldown -= dt;
  spawnTimer += dt;

  // ===== PLAYER MOVEMENT =====
  if (sage.keysDown.has("a")) player.x -= speed * dt;
  if (sage.keysDown.has("d")) player.x += speed * dt;
  if (sage.keysDown.has("w")) player.y -= speed * dt;
  if (sage.keysDown.has("s")) player.y += speed * dt;

  // ===== SHOOT =====
  if (sage.isMouseDown() && shootCooldown <= 0) {
    shoot();
    shootCooldown = 0.2;
  }

  // ===== SPAWN ENEMY =====
  if (spawnTimer >= 1) {
    spawnEnemy();
    spawnTimer = 0;
  }

  // ===== UPDATE BULLETS =====
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.update(dt);

    if (
      b.obj.x > sage.width ||
      b.obj.x < 0 ||
      b.obj.y > sage.height ||
      b.obj.y < 0
    ) {
      sage.removeObject(b.obj);
      bullets.splice(i, 1);
    }
  }

  // ===== ENEMIES + COLLISION =====
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];

    const dx = player.x - e.obj.x;
    const dy = player.y - e.obj.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

    const enemySpeed = 80;
    e.obj.x += (dx / dist) * enemySpeed * dt;
    e.obj.y += (dy / dist) * enemySpeed * dt;

    for (let j = bullets.length - 1; j >= 0; j--) {
      if (sage.collide(bullets[j].obj, e.obj)) {
        sage.removeObject(bullets[j].obj);
        bullets.splice(j, 1);

        e.kill();
        enemies.splice(i, 1);
        break;
      }
    }
  }
});
