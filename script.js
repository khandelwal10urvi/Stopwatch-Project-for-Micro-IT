const timeDisplay = document.getElementById('time-display');
const stopwatchModeBtn = document.getElementById('stopwatch-mode-btn');
const timerModeBtn = document.getElementById('timer-mode-btn');
const timerInputSection = document.getElementById('timer-input-section');
const minInput = document.getElementById('min-input');
const secInput = document.getElementById('sec-input');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');
const alarmSound = document.getElementById('alarm-sound');

let running = false;
let mode = 'stopwatch'; // 'stopwatch' or 'timer'
let startTime = 0;
let elapsedTime = 0;
let timerDuration = 0; // in seconds
let animationFrameId;

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const milliseconds = Math.floor((totalSeconds * 100) % 100); // Two digits for milliseconds
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;
}

function updateDisplay() {
    if (running) {
        if (mode === 'stopwatch') {
            elapsedTime = (performance.now() - startTime) / 1000;
            timeDisplay.textContent = formatTime(elapsedTime);
        } else if (mode === 'timer') {
            const remaining = timerDuration - ((performance.now() - startTime) / 1000);
            if (remaining <= 0) {
                running = false;
                timeDisplay.textContent = formatTime(0);
                timeDisplay.style.color = 'red';
                alertTimerFinished();
                cancelAnimationFrame(animationFrameId); // Stop the animation loop
            } else {
                timeDisplay.textContent = formatTime(remaining);
            }
        }
    }
    animationFrameId = requestAnimationFrame(updateDisplay);
}

function start() {
    if (!running) {
        if (mode === 'timer') {
            const minutes = parseInt(minInput.value || '0', 10);
            const seconds = parseInt(secInput.value || '0', 10);
            timerDuration = minutes * 60 + seconds;
            if (timerDuration <= 0) {
                alert('Please enter valid timer values (minutes and/or seconds greater than zero).');
                return;
            }
            // For timer, startTime is when the countdown begins
            startTime = performance.now();
        } else { // Stopwatch mode
            // For stopwatch, adjust startTime to account for previously elapsed time
            startTime = performance.now() - (elapsedTime * 1000);
        }
        running = true;
        timeDisplay.style.color = '#00ffcc'; // Reset color if it was red
        updateDisplay(); // Start the animation loop
    }
}

function stop() {
    if (running) {
        running = false;
        cancelAnimationFrame(animationFrameId); // Stop the animation loop
        // When stopping stopwatch, elapsedTime is already up-to-date from updateDisplay
    }
}

function reset() {
    running = false;
    cancelAnimationFrame(animationFrameId);
    elapsedTime = 0;
    timerDuration = 0;
    timeDisplay.style.color = '#00ffcc'; // Reset color to default
    timeDisplay.textContent = '00:00:00';
    minInput.value = '00';
    secInput.value = '00';
}

function switchMode(newMode) {
    mode = newMode;
    reset(); // Reset time and display when switching modes
    if (mode === 'timer') {
        timerInputSection.classList.remove('hidden');
    } else {
        timerInputSection.classList.add('hidden');
    }
}

function alertTimerFinished() {
    timeDisplay.textContent = "Time's Up!";
    alarmSound.play();
    // Add a small delay for the alert box to ensure sound plays first
    setTimeout(() => {
        alert("⏰ Time's up!");
    }, 100);
}

// Event Listeners
stopwatchModeBtn.addEventListener('click', () => switchMode('stopwatch'));
timerModeBtn.addEventListener('click', () => switchMode('timer'));
startBtn.addEventListener('click', start);
stopBtn.addEventListener('click', stop);
resetBtn.addEventListener('click', reset);

// Initialize display on load
updateDisplay();