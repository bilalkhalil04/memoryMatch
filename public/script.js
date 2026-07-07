#!/usr/bin/env node
/**
 * Terminal Tic-Tac-Toe
 * You are X, the computer is O.
 * Run with: node tic-tac-toe.js
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let board = Array(9).fill(null);
const HUMAN = 'X';
const COMPUTER = 'O';

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]            // diagonals
];

function printBoard() {
  const cell = (i) => board[i] || String(i + 1);
  console.log('');
  console.log(` ${cell(0)} | ${cell(1)} | ${cell(2)} `);
  console.log('---+---+---');
  console.log(` ${cell(3)} | ${cell(4)} | ${cell(5)} `);
  console.log('---+---+---');
  console.log(` ${cell(6)} | ${cell(7)} | ${cell(8)} `);
  console.log('');
}

function checkWinner(b) {
  for (const [a, b1, c] of WIN_LINES) {
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
  }
  if (b.every(cell => cell)) return 'draw';
  return null;
}

// Minimax: computer plays optimally, so the best a human can do is draw.
function minimax(b, player) {
  const winner = checkWinner(b);
  if (winner === COMPUTER) return { score: 1 };
  if (winner === HUMAN) return { score: -1 };
  if (winner === 'draw') return { score: 0 };

  const moves = [];
  for (let i = 0; i < 9; i++) {
    if (!b[i]) {
      const newBoard = b.slice();
      newBoard[i] = player;
      const result = minimax(newBoard, player === COMPUTER ? HUMAN : COMPUTER);
      moves.push({ index: i, score: result.score });
    }
  }

  if (player === COMPUTER) {
    return moves.reduce((best, m) => (m.score > best.score ? m : best));
  } else {
    return moves.reduce((best, m) => (m.score < best.score ? m : best));
  }
}

function computerMove() {
  const best = minimax(board, COMPUTER);
  board[best.index] = COMPUTER;
}

function endGame(result) {
  printBoard();
  if (result === 'draw') {
    console.log("It's a draw! Good game.");
  } else if (result === HUMAN) {
    console.log('You win! 🎉 (the computer let its guard down)');
  } else {
    console.log('The computer wins. Better luck next time!');
  }
  rl.close();
}

function humanTurn() {
  printBoard();
  rl.question('Your move (1-9): ', (answer) => {
    const pos = parseInt(answer.trim(), 10) - 1;

    if (isNaN(pos) || pos < 0 || pos > 8) {
      console.log('Please enter a number between 1 and 9.');
      return humanTurn();
    }
    if (board[pos]) {
      console.log('That square is taken. Try again.');
      return humanTurn();
    }

    board[pos] = HUMAN;
    let result = checkWinner(board);
    if (result) return endGame(result);

    computerMove();
    result = checkWinner(board);
    if (result) return endGame(result);

    humanTurn();
  });
}

console.log('=== Tic-Tac-Toe ===');
console.log('You are X, the computer is O.');
console.log('Enter a number 1-9 to place your mark:');
console.log(' 1 | 2 | 3 ');
console.log('---+---+---');
console.log(' 4 | 5 | 6 ');
console.log('---+---+---');
console.log(' 7 | 8 | 9 ');

humanTurn();