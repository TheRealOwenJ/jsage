sage.setBackground("#1e1e1e");

let games = [];
let index = 0;
let loaded = false;

const startY = 300;
const spacing = 60;

const buttons = [];

sage.createObject("text", 80, 200, {
  text: "Choose a game",
  fontSize: 40,
  color: "white"
});

function renderButtons() {
  buttons.length = 0;

  for (let i = 0; i < games.length; i++) {
    const name =
      games[i].replace(".sage.js", "").charAt(0).toUpperCase() +
      games[i].replace(".sage.js", "").slice(1);
    const y = startY + i * spacing;

    const btn = sage.createObject("button", 100, y, {
      width: 320,
      height: 45,
      text: name,
      color: "#333",

      onClick: () => {
        index = i;
        sage.loadScene("./examples/" + games[i]);
      }
    });

    buttons.push(btn);
  }
}

function loadGames() {
  fetch("./examples/games.json")
    .then((r) => r.json())
    .then((list) => {
      games = list;
      index = 0;

      renderButtons();
      loaded = true;
    });
}

loadGames();

// Button hightlighting
sage.onUpdate(() => {
  if (!loaded) return;

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].color = i === index ? "#666" : "#333";
  }
});
