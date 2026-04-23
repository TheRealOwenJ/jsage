console.log("BOOT START");
import sage from "./core.js";

import { initInput } from "./input.js";
import { initObjects } from "./objects.js";
import { initPhysics } from "./physics.js";
import { initAssets } from "./assets.js";
import { initScenes } from "./scenes.js";
import { initRender } from "./render.js";
import { startLoop } from "./loop.js";

initInput(sage);
initObjects(sage);
initPhysics(sage);
initAssets(sage);
initScenes(sage);
initRender(sage);

const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

sage.canvas = canvas;
sage.ctx = ctx;

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  sage._resize();
}

resize();
window.addEventListener("resize", resize);

sage.init(canvas, ctx);

startLoop(sage);

const engineScript = document.getElementById("engine");
const scenePath = engineScript?.getAttribute("scene");

if (scenePath) {
  sage.loadScene(scenePath);
}

