export function initScenes(sage) {
  sage.loadScene = async function (path, data = {}) {
    this.currentScene = path;
    this.sceneData = data;
    for (const o of this.objects) {
      if (o._dom) {
        o._dom.remove();
      }
    }
    this.objects.length = 0;
    this.ui.activeInput = null;

    try {
      const res = await fetch(path + "?t=" + Date.now());
      if (!res.ok) throw new Error("Scene fetch failed");

      const code = await res.text();

      try {
        const sceneFn = new Function("sage", code);
        sceneFn.call(this, this);
      } catch (err) {
        this.error("Scene execution error", err, {
          scene: path,
          phase: "execution",
        });
      }
    } catch (err) {
      this.error("Scene load error", err, {
        scene: path,
        phase: "fetch",
      });
    }
  };
}
