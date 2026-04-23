sage.setBackground("#0a0e27");

// =====================
// ABOUT JSAGE PAGE
// =====================

let y = 0;

// Enable scrolling
sage.enableScrolling(2000);

// =====================
// HEADER SECTION
// =====================
sage.createObject("text", 80, 30, {
  text: "JSAGE",
  fontSize: 64,
  color: "#00ff88",
  selectable: true
});

sage.createObject("text", 80, 120, {
  text: "J Site And Game Engine",
  fontSize: 28,
  color: "#00ffcc",
  selectable: true
});

sage.createObject("text", 80, 165, {
  text: "Created by @therealowenj • newo.live",
  fontSize: 16,
  color: "#888888",
  selectable: true
});

// Divider
sage.createObject("square", 50, 200, {
  width: 700,
  height: 2,
  color: "#00ff88"
});

// =====================
// WHAT IS JSAGE
// =====================
sage.createObject("text", 80, 240, {
  text: "What is JSAGE?",
  fontSize: 32,
  color: "#00ffff",
  selectable: true
});

sage.createObject("text", 80, 290, {
  text: "A lightweight, browser-based engine for building games AND websites",
  fontSize: 18,
  color: "#cccccc",
  selectable: true
});

// =====================
// FEATURES
// =====================
sage.createObject("text", 80, 350, {
  text: "Key Features",
  fontSize: 32,
  color: "#00ffff",
  selectable: true
});

const features = [
  "✓ No build tools, just write code and refresh",
  "✓ 60 FPS physics & animations built-in",
  "✓ Matter.js physics engine included",
  "✓ Particle systems for visual effects",
  "✓ Keyboard and mouse input handling",
  "✓ Audio support with volume control",
  "✓ Scene management and transitions",
  "✓ Scrolling support (try scrolling this page!)",
  "✓ Selectable text (try selecting this text!)",
  "✓ Only ~30KB - ultra lightweight"
];

let featureY = 400;
for (const f of features) {
  sage.createObject("text", 100, featureY, {
    text: f,
    fontSize: 16,
    color: "#bbbbbb",
    selectable: true
  });
  featureY += 35;
}

// =====================
// WHY SECTION
// =====================
let whyY = featureY + 40;

sage.createObject("text", 80, whyY, {
  text: "Why Choose JSAGE?",
  fontSize: 32,
  color: "#00ffff",
  selectable: true
});

const why = [
  "Traditional engines are heavy and complex",
  "JSAGE is lightweight and direct",
  "No npm, no bundlers, no setup",
  "Write → refresh → see results instantly",
  "Everything is simple objects"
];

let whyContentY = whyY + 50;
for (const r of why) {
  sage.createObject("text", 100, whyContentY, {
    text: "• " + r,
    fontSize: 15,
    color: "#aabbaa",
    selectable: true
  });
  whyContentY += 40;
}

// =====================
// USE CASES
// =====================
let casesY = whyContentY + 40;

sage.createObject("text", 80, casesY, {
  text: "Perfect For",
  fontSize: 32,
  color: "#00ffff",
  selectable: true
});

const cases = [
  "2D platformers, shooters, puzzles",
  "Game jams",
  "Interactive dashboards",
  "Portfolios",
  "Education projects",
  "Prototypes"
];

let casesContentY = casesY + 50;
for (const c of cases) {
  sage.createObject("text", 100, casesContentY, {
    text: "▸ " + c,
    fontSize: 15,
    color: "#ccddff",
    selectable: true
  });
  casesContentY += 35;
}

// =====================
// FOOTER SECTION
// =====================
let footerY = casesContentY + 80;

sage.createObject("square", 50, footerY, {
  width: 700,
  height: 2,
  color: "#00ff88"
});

sage.createObject("text", 80, footerY + 40, {
  text: "Ready to build? Try the other examples →",
  fontSize: 24,
  color: "#00ff88",
  selectable: true
});

sage.createObject("text", 80, footerY + 100, {
  text: "This entire page was built with JSAGE!",
  fontSize: 14,
  color: "#666666",
  selectable: true
});

sage.createObject("text", 80, footerY + 130, {
  text: "Learn more: https://newo.live",
  fontSize: 14,
  color: "#00ff88",
  selectable: true,
  link: "https://newo.live"
});

sage.createObject("text", 80, footerY + 165, {
  text: "[Use mouse wheel or arrow keys to scroll]",
  fontSize: 12,
  color: "#555555",
  selectable: true
});

sage.createObject("button", 80, footerY + 210, {
  width: 180,
  height: 40,
  text: "← Back to Menu",
  onClick: () => {
    sage.disableScrolling();
    sage.loadScene("./examples/main.sage.js");
  }
});

// =====================
// FIX SCROLL HEIGHT
// =====================
const totalHeight = footerY + 300;
sage.enableScrolling(totalHeight);

// =====================
// UPDATE LOOP
// =====================
sage.onUpdate((dt) => {});
