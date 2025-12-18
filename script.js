// script.js - frontend logic (fetches /questions)
let currentQuestion = 0; // index (0..n-1)
let score = 0;
let timer = 20;
let timerInterval;
let questions = [];

// DOM refs
const qText = document.getElementById('question-text');
const qNumber = document.getElementById('question-number');
const qCount = document.getElementById('question-count');
const progressEl = document.getElementById('progress');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const optionBtns = Array.from(document.querySelectorAll('.option-btn'));
const nextBtn = document.getElementById('next-btn');
const container = document.querySelector('.quiz-container');

async function loadQuiz() {
  try {
    const res = await fetch('/questions');
    questions = await res.json();
    // Ensure at least 1 question
    if (!Array.isArray(questions) || questions.length === 0) {
      qText.textContent = 'No questions available.';
      nextBtn.disabled = true;
      return;
    }
    // initialize UI
    updateHeader();
    showQuestion();
  } catch (err) {
    qText.textContent = 'Failed to load questions.';
    console.error(err);
  }
}

function updateHeader() {
  // show "1 / 3" style count
  qCount.textContent = `${currentQuestion + 1} / ${questions.length}`;
  // progress as percent of answered (show current position)
  const pct = Math.round(((currentQuestion + 1) / questions.length) * 100);
  progressEl.style.width = pct + '%';
  scoreEl.textContent = `Score: ${score}`;
  qNumber.textContent = `Question ${String(currentQuestion + 1).padStart(2, '0')}`;
}

function showQuestion() {
  resetState();
  if (currentQuestion >= questions.length) {
    showResult();
    return;
  }

  const q = questions[currentQuestion];
  qText.textContent = q.question || 'Question text missing';
  // place options
  optionBtns.forEach((btn, i) => {
    btn.textContent = q.options[i] || `Option ${i+1}`;
    btn.disabled = false;
    btn.classList.remove('correct', 'wrong');
    // remove old onclick then attach new
    btn.onclick = () => handleSelect(btn, q.answer);
  });

  updateHeader();
  startTimer();
}

function handleSelect(btn, correctAnswer) {
  // disable all buttons once one selected
  optionBtns.forEach(b => b.disabled = true);

  if (btn.textContent === correctAnswer) {
    btn.classList.add('correct');
    score++;
  } else {
    btn.classList.add('wrong');
    // also highlight the correct one
    const correctBtn = optionBtns.find(b => b.textContent === correctAnswer);
    if (correctBtn) correctBtn.classList.add('correct');
  }
  // update score display
  scoreEl.textContent = `Score: ${score}`;
}

function resetState() {
  clearInterval(timerInterval);
  timer = 20;
  timerEl.textContent = timer;
  optionBtns.forEach(b => {
    b.classList.remove('correct', 'wrong');
    b.disabled = false;
  });
}

function startTimer() {
  clearInterval(timerInterval);
  timer = 20;
  timerEl.textContent = timer;
  timerInterval = setInterval(() => {
    timer--;
    timerEl.textContent = timer;
    if (timer <= 0) {
      clearInterval(timerInterval);
      // If time's up, disable options and show correct
      const q = questions[currentQuestion];
      optionBtns.forEach(b => b.disabled = true);
      const correctBtn = optionBtns.find(b => b.textContent === q.answer);
      if (correctBtn) correctBtn.classList.add('correct');
      // Wait a short moment then auto-move to next question
      setTimeout(() => nextQuestion(), 700);
    }
  }, 1000);
}

function nextQuestion() {
  clearInterval(timerInterval);
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  // Replace container innerHTML with result
  container.innerHTML = `
    <div class="result">
      <h2>Your Score</h2>
      <p style="font-size: 24px; font-weight:800; margin-top:12px;">${score} / ${questions.length}</p>
      <p style="margin-top:10px; color:#ffd8a8;">Thanks for playing!</p>
      <button id="restart-btn" class="next-btn" style="margin-top:18px;">Play Again</button>
    </div>
  `;
  // restart logic
  document.getElementById('restart-btn').addEventListener('click', () => {
    // reset values
    currentQuestion = 0;
    score = 0;
    // restore original HTML by reloading page (simpler)
    location.reload();
  });
}

// Next button click handler
nextBtn.addEventListener('click', () => {
  // Allow Next even if not answered; move to next
  clearInterval(timerInterval);
  nextQuestion();
});

// load quiz on start
loadQuiz();
