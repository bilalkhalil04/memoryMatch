const ICONS = ['🍎','🍋','🍇','🍒','🍉','🍑','🍍','🥝'];

let cards = [];
let flipped = [];
let matched = [];
let moves = 0;
let locked = false;
let best = null;

const gridEl = document.getElementById('grid');
const movesEl = document.getElementById('moves');
const bestEl = document.getElementById('best');
const resetBtn = document.getElementById('resetBtn');

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildDeck() {
  cards = shuffle([...ICONS, ...ICONS]);
  flipped = [];
  matched = [];
  moves = 0;
  locked = false;
  movesEl.textContent = moves;
}

function render() {
  gridEl.innerHTML = '';
  cards.forEach((icon, i) => {
    const btn = document.createElement('button');
    const isOpen = flipped.includes(i) || matched.includes(i);
    btn.className = 'card' + (flipped.includes(i) ? ' flipped' : '') + (matched.includes(i) ? ' matched' : '');
    btn.textContent = isOpen ? icon : '';
    btn.addEventListener('click', () => handleClick(i));
    gridEl.appendChild(btn);
  });
}

function handleClick(i) {
  if (locked || flipped.includes(i) || matched.includes(i)) return;

  flipped.push(i);
  render();

  if (flipped.length === 2) {
    moves++;
    movesEl.textContent = moves;
    locked = true;

    const [a, b] = flipped;
    if (cards[a] === cards[b]) {
      matched.push(a, b);
      flipped = [];
      locked = false;
      render();
      if (matched.length === cards.length) onWin();
    } else {
      setTimeout(() => {
        flipped = [];
        locked = false;
        render();
      }, 700);
    }
  }
}

function onWin() {
  if (best === null || moves < best) {
    best = moves;
    bestEl.textContent = best;
  }
}

resetBtn.addEventListener('click', () => {
  buildDeck();
  render();
});

buildDeck();
render();
