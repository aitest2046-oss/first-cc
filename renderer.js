const WORK_DURATION = 25 * 60;
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;
const POMODOROS_BEFORE_LONG_BREAK = 4;
const CIRCUMFERENCE = 2 * Math.PI * 90; // matches SVG r=90

const timeEl = document.getElementById('time');
const statusEl = document.getElementById('status');
const progressEl = document.getElementById('progress');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const dotsEl = document.getElementById('dots');
const countEl = document.getElementById('count');

let timeLeft = WORK_DURATION;
let totalTime = WORK_DURATION;
let running = false;
let interval = null;
let pomodorosCompleted = 0;
let phase = 'work'; // 'work' | 'short-break' | 'long-break'

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function updateDisplay() {
  const formatted = formatTime(timeLeft);
  timeEl.textContent = formatted;
  const offset = CIRCUMFERENCE * (1 - timeLeft / totalTime);
  progressEl.style.strokeDashoffset = offset;
  document.title = `${formatted} - ${statusEl.textContent}`;
}

function setPhaseUI() {
  const labels = { 'work': '工作时间', 'short-break': '短休息', 'long-break': '长休息' };
  const colors = { 'work': '#d94848', 'short-break': '#2e9e4f', 'long-break': '#2b7fd4' };

  statusEl.textContent = labels[phase];
  statusEl.className = 'status ' + phase;
  progressEl.style.stroke = colors[phase];
}

function updateDots() {
  const inCycle = pomodorosCompleted % POMODOROS_BEFORE_LONG_BREAK;
  let html = '';
  for (let i = 0; i < POMODOROS_BEFORE_LONG_BREAK; i++) {
    html += `<span class="dot${i < inCycle ? ' filled' : ''}"></span>`;
  }
  dotsEl.innerHTML = html;
  countEl.textContent = pomodorosCompleted;
}

function sendNotification(title, body) {
  new Notification(title, { body });
}

function switchPhase() {
  if (phase === 'work') {
    pomodorosCompleted++;
    updateDots();
    if (pomodorosCompleted % POMODOROS_BEFORE_LONG_BREAK === 0) {
      phase = 'long-break';
      totalTime = LONG_BREAK;
      timeLeft = LONG_BREAK;
      sendNotification('休息一下！', '你已完成4个番茄钟，休息15分钟吧');
    } else {
      phase = 'short-break';
      totalTime = SHORT_BREAK;
      timeLeft = SHORT_BREAK;
      sendNotification('休息一下！', '短休息5分钟');
    }
  } else {
    phase = 'work';
    totalTime = WORK_DURATION;
    timeLeft = WORK_DURATION;
    sendNotification('继续工作！', '休息结束，开始新的番茄钟');
  }
  setPhaseUI();
  updateDisplay();
}

function tick() {
  if (timeLeft <= 0) {
    clearInterval(interval);
    interval = null;
    running = false;
    startBtn.textContent = '开始';
    startBtn.classList.remove('running');
    switchPhase();
    return;
  }
  timeLeft--;
  updateDisplay();
}

startBtn.addEventListener('click', () => {
  if (running) {
    clearInterval(interval);
    interval = null;
    running = false;
    startBtn.textContent = '继续';
    startBtn.classList.remove('running');
  } else {
    interval = setInterval(tick, 1000);
    running = true;
    startBtn.textContent = '暂停';
    startBtn.classList.add('running');
  }
});

resetBtn.addEventListener('click', () => {
  clearInterval(interval);
  interval = null;
  running = false;
  phase = 'work';
  timeLeft = WORK_DURATION;
  totalTime = WORK_DURATION;
  startBtn.textContent = '开始';
  startBtn.classList.remove('running');
  setPhaseUI();
  updateDisplay();
});

// init
progressEl.style.strokeDasharray = CIRCUMFERENCE;
updateDots();
setPhaseUI();
updateDisplay();
