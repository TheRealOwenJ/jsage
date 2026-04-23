# JSage

JSage is a compact JavaScript engine for 2D games and interactive canvas-driven websites. It’s intentionally small, practical, and designed to be dropped into a static site. The engine expects the repository layout (sage/, lib/) to exist in the project root.

Purpose
- Rapid prototyping and game jams
- Canvas-first interactive UIs with built-in animation and particles
- Minimal setup: no build step required, but a static server is (yes) required

Quick facts
- Physics (optional): Matter.js integration
- Built-in: objects, UI widgets (button/input/text), tweens, particles, camera, scene loader
- Scene files: any .sage.js file can be used as the scene target
- License: GNU GPL v3.0 (see LICENSE)

Important: JSage requires serving over HTTP(S). Opening index.html via file:// will break module/asset loading and is not supported. Use a simple static server (examples below).

Quick Start (minimal)
1) Copy these folders into your project root: `sage/` and `lib/`.
2) Create an HTML file that includes the canvas and engine script:

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>JSage Demo</title>
  </head>
  <body>
    <canvas id="c"></canvas>
    <script src="lib/matter.js"></script> <!-- optional, fetches by itself if needed but not included -->
    <script src="sage/engine.js" scene="path-to-your-scene.sage.js"></script>
  </body>
</html>
```

3) Serve the directory and open the page in a browser:
- Lightweight: `npx http-server .` or `python -m http.server 8000`
- Production: GitHub Pages, Netlify, or any static host

Getting Started (first scene)
Create `hello.sage.js`:

```javascript
const player = sage.createObject('square', 120, 120, { width: 40, height: 40, color: 'dodgerblue' });

sage.onUpdate((dt) => {
  if (sage.isKeyDown('ArrowRight')) player.x += 200 * dt;
  if (sage.isKeyDown('ArrowLeft')) player.x -= 200 * dt;
});
```

Serve and visit your page. Use arrow keys to move the square.

Full Docs

Installation
- Required: `sage/` (engine core and helpers) and `lib/` (third-party libraries like matter.js).
- `scene` attribute may point to any `.sage.js` file. The engine will load and execute it if provided.

API Reference
Core
- sage.createObject(type, x, y, props)
- sage.getObjectById(id)
- sage.getObjectsByType(type)
- sage.getAllObjects()
- sage.removeObject(obj)
- sage.clearObjects()

Update & events
- sage.onUpdate(fn) — invoked each frame with dt (seconds)
- sage.pause(), sage.unpause(), sage.isPaused()

Physics
- sage.enablePhysics(), sage.disablePhysics()
- sage.setGravity(value), sage.getGravity()
- Access Matter.js via sage.physics.engine

Input
- Keyboard: sage.isKeyDown(key), sage.isKeyPressed(key), sage.isKeyReleased(key)
- Mouse: sage.getMousePosition(), sage.isMousePressed(), sage.isMouseDown(), sage.isMouseReleased()

Camera & rendering
- sage.setCameraPosition(x,y), sage.moveCamera(dx,dy), sage.setCameraZoom(z), sage.worldToScreen(x,y)
- Drawing helpers: drawRect, drawCircle, drawLine, drawText

Assets
- sage.loadAssets(map) — map: images, sounds, jsons, fonts
- sage.getImage(name), sage.playSound(name, volume, loop)

Tweens & Particles
- sage.tween(obj, prop, target, duration, easing, onComplete)
- sage.createParticleSystem(x,y,config)

Scenes
- sage.loadScene(path, data) — loads a scene script and sets sage.sceneData

Utilities
- sage.random(min,max), sage.randomInt(min,max), sage.getFPS(), sage.getCanvas(), sage.getContext()
- Properties: sage.width, sage.height, sage.objects, sage.background

Troubleshooting
- Server required: do not use file:// — use http(s)
- Missing physics: ensure lib/matter.js is loaded before sage/engine.js if you rely on physics
- Assets fail to load: check paths relative to served HTML and browser console for CORS or 404 errors
- Input issues: active input fields capture keyboard events; use isKeyPressed for single actions
- Performance: reduce physics bodies and particle counts; use object pooling for bullets

Performance tips
- Reuse objects (pool bullets/particles)
- Disable physics for UI-only scenes
- Preload assets with sage.loadAssets() before the main loop
- Profile with browser DevTools

Contributing
- Fork → branch → PR
- Add examples and tests when adding features
- Keep API backward-compatible where reasonable

License
- GNU General Public License v3.0 — See LICENSE

Acknowledgements
- Built to be small and pragmatic. If you want it smaller, contribute a forked minimal runtime.

Contact & Support
- Open issues on GitHub with minimal repros and console logs.
