let tasks = [];
let currentIndex = 0;
let timeLeft = 0;
let interval = null;
let chimePlayed = false;

function initOpeningScreen() {
    const wrapper = document.getElementById('taskNameWrapper');
    const initialText = "DONE IS BETTER THAN PERFECT";
    initialText.split(' ').forEach(word => createBassWord(word, wrapper));
}

function playChime() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 1);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 1);
}

function createBassWord(text, container) {
    const div = document.createElement('div');
    div.className = 'bass-word';
    div.innerText = text;
    const aligns = ['flex-start', 'center', 'flex-end'];
    const randomAlign = aligns[Math.floor(Math.random() * aligns.length)];
    const randomRot = (Math.random() * 6 - 3).toFixed(1) + 'deg';
    div.style.setProperty('--align', randomAlign);
    div.style.setProperty('--rot', randomRot);
    container.appendChild(div);
}

function loadTasks() {
    const val = document.getElementById('jsonInput').value;
    if (!val) return;
    try {
        tasks = JSON.parse(val);
        currentIndex = 0;
        document.getElementById('setupArea').style.display = 'none';
        prepareNext();
    } catch (e) { alert("SCRIPT ERROR."); }
}

function prepareNext() {
    chimePlayed = false;
    const wrapper = document.getElementById('taskNameWrapper');
    wrapper.innerHTML = '';
    document.getElementById('skipBtn').style.display = 'none';
    if (currentIndex >= tasks.length) {
        createBassWord("FIN", wrapper);
        document.getElementById('timer').innerText = "00:00";
        document.getElementById('nextBtn').style.display = 'none';
        document.getElementById('setupArea').style.display = 'block';
        return;
    }
    tasks[currentIndex].name.split(' ').forEach(word => createBassWord(word, wrapper));
    document.getElementById('timer').innerText = "READY";
    document.getElementById('nextBtn').innerText = "ACTION";
    document.getElementById('nextBtn').style.display = 'block';
}

function startCurrentTask() {
    timeLeft = tasks[currentIndex].duration;
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('skipBtn').style.display = 'block';
    if (interval) clearInterval(interval);
    interval = setInterval(() => {
        timeLeft--;
        if (timeLeft === 60 && !chimePlayed) { playChime(); chimePlayed = true; }
        updateDisplay();
        if (timeLeft <= 0) { finishTask(); }
    }, 1000);
}

function updateDisplay() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    document.getElementById('timer').innerText = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function skipTask() { finishTask(); }
function finishTask() { if (interval) clearInterval(interval); currentIndex++; prepareNext(); }

initOpeningScreen();
