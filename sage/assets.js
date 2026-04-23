export function initAssets(sage) {

  sage.loadImage = function(name, src) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        this.assets.images[name] = img;
        resolve(img);
      };

      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  };

  sage.loadSound = function(name, src) {
    return new Promise((resolve, reject) => {
      const audio = new Audio();

      audio.oncanplaythrough = () => {
        this.assets.sounds[name] = audio;
        resolve(audio);
      };

      audio.onerror = () => reject(new Error(`Failed to load sound: ${src}`));
      audio.src = src;
    });
  };

  sage.playSound = function(name, volume = 1, loop = false) {
    const sound = this.assets.sounds[name];
    if (!sound) {
      console.warn(`Sound "${name}" not loaded`);
      return;
    }

    const clone = sound.cloneNode();
    clone.volume = volume;
    clone.loop = loop;
    clone.play();
  };

  sage.loadJSON = function(name, src) {
    return fetch(src)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load JSON: ${src}`);
        return res.json();
      })
      .then(data => {
        this.assets.jsons[name] = data;
        return data;
      });
  };

  sage.loadFont = function(name, src) {
    return new Promise((resolve, reject) => {
      const font = new FontFace(name, `url(${src})`);
      font.load().then(() => {
        document.fonts.add(font);
        this.assets.fonts[name] = font;
        resolve(font);
      }).catch(reject);
    });
  };

  sage.loadAssets = async function(assets) {
    const promises = [];

    const safeLoad = (fn, name, src) => {
      return fn.call(this, name, src).catch(err => {
        this.error("Asset load failed", err, { name, src });
      });
    };

    for (const [type, list] of Object.entries(assets)) {
      for (const [name, src] of Object.entries(list)) {
        if (type === "images") promises.push(safeLoad(this.loadImage, name, src));
        if (type === "sounds") promises.push(safeLoad(this.loadSound, name, src));
        if (type === "jsons") promises.push(safeLoad(this.loadJSON, name, src));
        if (type === "fonts") promises.push(safeLoad(this.loadFont, name, src));
      }
    }

    return Promise.all(promises);
  };

  sage.getImage = function(name) {
    return this.assets.images[name] || null;
  };

  sage.getSound = function(name) {
    return this.assets.sounds[name] || null;
  };

  sage.getJSON = function(name) {
    return this.assets.jsons[name] || null;
  };

  sage.getFont = function(name) {
    return this.assets.fonts[name] || null;
  };
}