export function initObjects(sage) {

  sage._generateId = () => "obj_" + (++sage._objCounter);

  sage.createObject = function(type, x, y, properties = {}) {
    const isRigid = type.startsWith("rigid_");
    const cleanType = isRigid ? type.replace("rigid_", "") : type;
    const isDomText = cleanType === "text" && properties.selectable === true;

    const id = this._generateId();
    const isUI = cleanType === "button" || cleanType === "input";

    const obj = {
      id,
      type: cleanType,
      rigid: isRigid,
      ui: isUI,

      x,
      y,
      vx: 0,
      vy: 0,

      width: properties.width ?? this.defaults.width,
      height: properties.height ?? this.defaults.height,
      color: properties.color ?? this.defaults.color,

      text: properties.text ?? "",
      value: properties.value ?? "",
      selectable: properties.selectable ?? false,
      
      fontSize: properties.fontSize ?? this.defaults.fontSize,
      font: properties.font ?? this.defaults.font,

      rotation: 0,
      rotSpeed: 0,

      onClick: properties.onClick ?? null,
      onChange: properties.onChange ?? null,

      hover: false,
      link: properties.link ?? null,

      dom: isDomText,
      _dom: null
    };

    this.objects.push(obj);

    if (obj.dom) {
      const el = document.createElement("div");

      el.textContent = obj.text;
      el.style.position = "absolute";
      el.style.left = "0px";
      el.style.top = "0px";
      el.style.color = obj.color || "white";
      el.style.font = `${obj.fontSize}px ${obj.font}`;
      el.style.pointerEvents = "auto";
      el.style.userSelect = "text";
      el.style.whiteSpace = "pre";
      if (obj.link) {
        el.style.cursor = "pointer";

        el.addEventListener("click", () => {
          window.open(obj.link, "_blank");
        });
      }

      if (this.dom.root) this.dom.root.appendChild(el);

      obj._dom = el;
      this.dom.elements.set(obj.id, el);
    }

    // Add physics body if physics is enabled and object is rigid
    if (isRigid && this.physics.enabled) {
      this.addPhysicsBody(obj);
    }

    return obj;
  };

  sage.getObjectsByType = function(type) {
    return this.objects.filter(o => o.type === type);
  };

  sage.getAllObjects = function() {
    return this.objects;
  };

  sage.removeObject = function(obj) {
    const i = this.objects.indexOf(obj);
    if (i !== -1) this.objects.splice(i, 1);

    if (obj._dom) {
      obj._dom.remove();
      this.dom.elements.delete(obj.id);
    }
  };

  sage.getObjectById = function(id) {
    return this.objects.find(obj => obj.id === id) || null;
  };

  sage.clearObjects = function({ keepUI = false, keepPhysics = false } = {}) {
    for (const obj of this.objects) {
      if (obj._dom) obj._dom.remove();

      if (!keepPhysics && obj.physicsBody && this.physics.engine) {
        Matter.World.remove(this.physics.engine.world, obj.physicsBody);
      }
    }

    this.dom.elements.clear();
    this.objects.length = 0;
    this.ui.activeInput = null;

    if (!keepUI) {
      this.updateHooks.length = 0;
    }
  };
}