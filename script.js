// Get DOM elements
const word = document.getElementById('word');
const text = document.getElementById('text');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const endgameEl = document.getElementById('end-game-container');
const startgameEl = document.getElementById('start-game-container');
const settingsBtn = document.getElementById('settings-btn');
const settings = document.getElementById('settings');
const settingsForm = document.getElementById('settings-form');
const difficultySelect = document.getElementById('difficulty');
const endBtn = document.getElementById('end-btn');
const closeBtn = document.getElementById('close');

// Init
const words = [];
let randomWord;
let score = 0;
let time = 5;

text.focus();

// Set difficulty to value in localStorage or medium
const setDifficulty = localStorage.getItem('difficulty') !== null ? localStorage.getItem('difficulty') : 'medium';
let difficulty = setDifficulty;

// Set difficulty select value
difficultySelect.value = setDifficulty;

// Start counting down
const timeInterval = setInterval(updateTime, 1000);

// Fetch words from API
async function generateWords() {
    let response = await fetch(`https://random-word-api.herokuapp.com/word?number=100`);
    let data = await response.json()
            data.forEach((a) => {
                words.push(a);
            })
    addWordToDOM();
}

generateWords();

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
    score++;
    scoreEl.innerHTML = score;
}


// Update time
function updateTime() {
  time--;
  timeEl.innerHTML = time + 's';

  if (time === 0) {
    clearInterval(timeInterval);
    // end game
    gameOver();
  }
}

// Game over, show end screen
function gameOver() {
  endgameEl.innerHTML = `
    <h1>Time ran out</h1>
    <p>Your final score is ${score}</p>
    <button onclick="location.reload()">Reload</button>
  `;

  endgameEl.style.display = 'flex';
}

addWordToDOM();

// Event listeners

// Typing
text.addEventListener('input', e => {
  const insertedText = e.target.value;

  if (insertedText === randomWord) {
    addWordToDOM();
    updateScore();

    // Clear
    e.target.value = '';

    if (difficulty === 'hard') {
      time += 2;
    } else if (difficulty === 'medium') {
      time += 3;
    } else {
      time += 5;
    }

    updateTime();
  }
});

// Settings btn click
settingsBtn.addEventListener('click', () => settings.classList.toggle('hide'));

// Settings select
settingsForm.addEventListener('change', e => {
  difficulty = e.target.value;
  localStorage.setItem('difficulty', difficulty);
});
