export function initPhysics(sage) {

  sage._loadMatterJS = async function() {
    if (typeof Matter !== "undefined") return true;

    try {
      const res = await fetch("./lib/matter.js");
      if (!res.ok) throw new Error("Matter.js not found");

      const code = await res.text();
      (0, eval)(code);

      return typeof Matter !== "undefined";
    } catch (err) {
      console.warn("Could not load Matter.js from ./lib/matter.js:", err);
      return false;
    }
  };

  sage.enablePhysics = async function() {
    if (this.physics.enabled) return true;

    const loaded = await this._loadMatterJS();
    if (!loaded) {
      console.warn("Matter.js not loaded! Physics won't work. Make sure lib/matter.js exists.");
      return false;
    }

    this.physics.enabled = true;
    this.physics.engine = Matter.Engine.create();
    this.physics.engine.world.gravity.y = this.physics.gravity / 1000;

    // Create ground body
    const ground = Matter.Bodies.rectangle(
      this.width / 2,
      this.height + 50,
      this.width,
      100,
      { isStatic: true }
    );
    Matter.World.add(this.physics.engine.world, ground);
    
    return true;
  };

  sage.disablePhysics = function() {
    this.physics.enabled = false;
    if (this.physics.engine) {
      Matter.Engine.clear(this.physics.engine);
      this.physics.engine = null;
    }
  };

  sage.addPhysicsBody = function(obj) {
    if (!this.physics.enabled || !obj.rigid) return;

    let body;

    if (obj.type === "circle") {
      body = Matter.Bodies.circle(
        obj.x + obj.width / 2,
        obj.y + obj.height / 2,
        obj.width / 2
      );
    } else {
      body = Matter.Bodies.rectangle(
        obj.x + obj.width / 2,
        obj.y + obj.height / 2,
        obj.width,
        obj.height
      );
    }

    Matter.World.add(this.physics.engine.world, body);
    obj.physicsBody = body;
  };

  sage.setGravity = function(g) {
    this.physics.gravity = g;
    if (this.physics.engine) {
      this.physics.engine.world.gravity.y = g / 1000;
    }
  };

  sage.getGravity = function() {
    return this.physics.gravity;
  };
}