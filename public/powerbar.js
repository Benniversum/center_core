        // ────────────────────────────────────────────────
        // POWERBAR + ECHTER POMODORO TIMER
        // ────────────────────────────────────────────────

        // Toggle
        document.getElementById('toggle').addEventListener('click', () => {
            const pb = document.getElementById('powerbar');
            pb.classList.toggle('expanded');
            document.getElementById('toggle').textContent = pb.classList.contains('expanded') ? '«' : '»';
        });

        // Responsive force slim
        window.addEventListener('resize', () => {
            if (window.innerWidth < 900) {
                document.getElementById('powerbar').classList.remove('expanded');
                document.getElementById('toggle').textContent = '»';
            }
        });

        // Pomodoro
        let timerInterval = null;
        let remainingSeconds = 0;
        let isRunning = false;
        let currentTrack = '';

        const startBtn = document.getElementById('pomo-start');
        const pauseBtn = document.getElementById('pomo-pause');
        const stopBtn = document.getElementById('pomo-stop');
        const timeSelect = document.getElementById('pomo-duration');
        const trackInput = document.getElementById('pomo-input');
        const timerDisplay = document.getElementById('pomo-timer');
        const welcomeTrack = parent.document.getElementById('pomo-track') || null;

        function formatTime(seconds) {
            const m = Math.floor(seconds / 60).toString().padStart(2, '0');
            const s = (seconds % 60).toString().padStart(2, '0');
            return `${m}:${s}`;
        }

        function updateDisplay() {
            timerDisplay.textContent = formatTime(remainingSeconds);
        }

        function updateWelcomeBox() {
            if (welcomeTrack && currentTrack) {
                welcomeTrack.textContent = `Aktueller Track: ${currentTrack}`;
            }
        }

        function playBeep() {
            const ctx = new(window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.2);
        }

        function startTimer() {
            if (isRunning) return;

            if (remainingSeconds === 0) {
                remainingSeconds = parseInt(timeSelect.value) * 60;
            }

            currentTrack = trackInput.value.trim() || 'Fokus';
            updateWelcomeBox();
            localStorage.setItem('autocom_last_track', currentTrack);

            isRunning = true;
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            stopBtn.disabled = false;

            timerInterval = setInterval(() => {
                if (remainingSeconds > 0) {
                    remainingSeconds--;
                    updateDisplay();
                    localStorage.setItem('autocom_remaining', remainingSeconds);
                } else {
                    clearInterval(timerInterval);
                    timerInterval = null;
                    isRunning = false;
                    startBtn.disabled = false;
                    pauseBtn.disabled = true;
                    playBeep();
                    timerDisplay.textContent = 'FERTIG!';
                    setTimeout(() => {
                        remainingSeconds = 0;
                        updateDisplay();
                    }, 3000);
                }
            }, 1000);

            updateDisplay();
        }

        function pauseTimer() {
            if (!isRunning) return;
            clearInterval(timerInterval);
            timerInterval = null;
            isRunning = false;
            startBtn.disabled = false;
            pauseBtn.disabled = true;
        }

        function stopTimer() {
            if (timerInterval) clearInterval(timerInterval);
            timerInterval = null;
            isRunning = false;
            remainingSeconds = 0;
            updateDisplay();
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            stopBtn.disabled = true;
            localStorage.removeItem('autocom_remaining');
        }

        startBtn.addEventListener('click', startTimer);
        pauseBtn.addEventListener('click', pauseTimer);
        stopBtn.addEventListener('click', stopTimer);

        pauseBtn.disabled = true;
        stopBtn.disabled = true;

        window.addEventListener('load', () => {
            const savedTrack = localStorage.getItem('autocom_last_track');
            if (savedTrack) {
                currentTrack = savedTrack;
                trackInput.value = savedTrack;
                updateWelcomeBox();
            }

            const savedTime = localStorage.getItem('autocom_remaining');
            if (savedTime) {
                remainingSeconds = parseInt(savedTime);
                updateDisplay();
            } else {
                remainingSeconds = parseInt(timeSelect.value) * 60;
                updateDisplay();
            }
        });

        trackInput.addEventListener('change', () => {
            currentTrack = trackInput.value.trim() || 'Benjamin Konzentriert sich';
            localStorage.setItem('autocom_last_track', currentTrack);
            updateWelcomeBox();
        });