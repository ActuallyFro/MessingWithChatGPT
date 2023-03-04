// Digital clock
function displayTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes}:${seconds}`;
  document.querySelector('.digital-clock').textContent = timeString;
}

setInterval(displayTime, 1000);

// Stopwatch
let stopwatchTime = 0;
let stopwatchRunning = false;
let stopwatchIntervalId;

function startStopwatch() {
  if (!stopwatchRunning) {
    stopwatchRunning = true;
    stopwatchIntervalId = setInterval(updateStopwatch, 10);
  }
}

function stopStopwatch() {
  if (stopwatchRunning) {
    clearInterval(stopwatchIntervalId);
    stopwatchRunning = false;
  }
}

function resetStopwatch() {
  stopwatchTime = 0;
  document.querySelector('.digital-clock').textContent = '00:00:00';
}

function updateStopwatch() {
  stopwatchTime += 10;
  const minutes = Math.floor(stopwatchTime / 60000).toString().padStart(2, '0');
  const seconds = Math.floor((stopwatchTime % 60000) / 1000).toString().padStart(2, '0');
  const milliseconds = ((stopwatchTime % 1000) / 10).toFixed(0).toString().padStart(2, '0');
  const timeString = `${minutes}:${seconds}:${milliseconds}`;
  document.querySelector('.digital-clock').textContent = timeString;
}

document.getElementById('stopwatch-btn').addEventListener('click', function() {
  resetStopwatch();
  startStopwatch();
});

// Timer
let timerTime = 0;
let timerRunning = false;
let timerIntervalId;

function startTimer() {
  if (!timerRunning) {
    const minutes = parseInt(prompt('Enter number of minutes:'));
    if (!isNaN(minutes)) {
      timerTime = minutes * 60000;
      timerRunning = true;
      timerIntervalId = setInterval(updateTimer, 10);
    }
  }
}

function stopTimer() {
  if (timerRunning) {
    clearInterval(timerIntervalId);
    timerRunning = false;
    const beep = new Audio('beep.mp3');
    beep.play();
  }
}

function resetTimer() {
  timerTime = 0;
  document.querySelector('.digital-clock').textContent = '00:00:00';
}

function updateTimer() {
  if (timerTime <= 0) {
    stopTimer();
  } else {
    timerTime -= 10;
    const minutes = Math.floor(timerTime / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((timerTime % 60000) / 1000).toString().padStart(2, '0');
    const milliseconds = ((timerTime % 1000) / 10).toFixed(0).toString().padStart(2, '0');
    const timeString = `${minutes}:${seconds}:${milliseconds}`;
    document.querySelector('.digital-clock').textContent = timeString;
  }
}

document.getElementById('timer-btn').addEventListener('click', function() {
  resetTimer();
  startTimer();
});
