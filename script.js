// Get DOM elements
const word = document.getElementById('word');
const text = document.getElementById('text');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const endgameEl = document.getElementById('end-game-container');
const startgameEl = document.getElementById('start-game-container');
const difficultyForm = document.getElementById('difficulty-form');
const startBtn = document.getElementById('btn-start-game');
const endBtn = document.getElementById('btn-end-game');
const endScore = document.getElementById('end-score');
const difficultyArea = document.getElementById('difficulty-area-span');

// Init
const words = [];
let randomWord;
let score = 0;
let time = 10;
let difficulty = 'Intermediate';
let timeInterval;

generateWords();

// Fetch words from API
async function generateWords() {
  let response = await fetch(`https://random-word-api.herokuapp.com/word?number=20`);
  let data = await response.json()
  data.forEach((a) => {
    words.push(a);
  })
  addWordToDOM();
}

// Get random word from words arr
function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

// Add word to DOM
function addWordToDOM() {
  randomWord = getRandomWord();
  word.innerHTML = randomWord;
}

// Update score
function updateScore() {
  if (difficulty === 'Expert') {
    score += 5;
  } else if (difficulty === 'Intermediate') {
    score += 2;
  } else {
    score += 1;
  }
  scoreEl.innerHTML = score;
}

// Update time
function updateTime() {
  time--;
  timeEl.innerHTML = time + 's';

  if (time === 0) {
    clearInterval(timeInterval);

    gameOver();
  }
}

// Game over, show end screen
function gameOver() {
  endScore.innerHTML = `<strong>${score}</strong>`;
  endgameEl.style.display = 'flex';
}

// Focus on input field and clear value
function newGame() {
  text.focus();
  text.value = '';
}

// EVENT LISTENERS

// Typing
text.addEventListener('input', e => {
  const insertedText = e.target.value;

  // First word
  if (insertedText === randomWord && time == 10) {
    timeInterval = setInterval(updateTime, 1000);

    addWordToDOM();
    updateScore();

    // Clear
    e.target.value = '';

    updateTime();

  } else if (insertedText === randomWord) {
    addWordToDOM();
    updateScore();

    // Clear
    e.target.value = '';

    if (difficulty === 'Expert') {
      time += 2;
    } else if (difficulty === 'Intermediate') {
      time += 3;
    } else {
      time += 5;
    }

    updateTime();
  }
});

// Settings btn click
startBtn.addEventListener('click', () => {
  startgameEl.classList.remove('show');
  difficultyArea.innerHTML = difficulty;
  newGame();
});

endBtn.addEventListener('click', () => location.reload());

// Difficulty change
difficultyForm.addEventListener('change', e => difficulty = e.target.value);