// terminal.js – Centercore Cabin Log Terminal – Neustart Februar 2026

const output = document.getElementById('output');
const input = document.getElementById('command-input');
const promptEl = document.getElementById('prompt');

// ────────────────────────────────────────────────
// Persistenter Zustand (localStorage)
// ────────────────────────────────────────────────
let username = localStorage.getItem('centercore_username') || 'guest';
let host = localStorage.getItem('centercore_host') || 'cabin';

function updatePrompt() {
    promptEl.textContent = `${username}@${host} $ `;
}

updatePrompt();

// ────────────────────────────────────────────────
// Hilfsfunktionen
// ────────────────────────────────────────────────
function print(html = '', className = '') {
    const line = document.createElement('div');
    line.innerHTML = html;
    if (className) line.className = className;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
}

function println(text = '', className = '') {
    print(text + '<br>', className);
}

function clearOutput() {
    output.innerHTML = '';
}

function error(msg) {
    println(`<span style="color:#f44">[ERROR]</span> ${msg}`, 'error');
}

function success(msg) {
    println(`<span style="color:#0f0">[OK]</span> ${msg}`);
}

// ────────────────────────────────────────────────
// Befehlsverarbeitung
// ────────────────────────────────────────────────
function processCommand(raw) {
    if (!raw.trim()) return;

    const parts = raw.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Echo des eingegebenen Befehls (wie in echten Terminals üblich)
    print(`<span style="color:#0f0">${promptEl.textContent}</span>${raw}`);

    switch (cmd) {
        case '/h':
        case '/help':
            println('Willkommen bei <b>Centercore</b> – dein kleiner alltäglicher Begleiter.');
            println('Verfügbare Befehle siehst du mit <span class="cmd">/commands</span>');
            println('Eastereggs & Spielereien: <span class="cmd">/rune</span>, <span class="cmd">/speak</span>');
            break;

        case '/commands':
            println('────────────── Verfügbare Befehle ──────────────', 'header');
            println('<span class="cmd">/help</span>   ─  diese Hilfe anzeigen');
            println('<span class="cmd">/commands</span> ─  diese Liste');
            println('<span class="cmd">/clear</span>   ─  Bildschirm leeren');
            println('<span class="cmd">/time</span>    ─  aktuelle Uhrzeit (Berlin)');
            println('<span class="cmd">/date</span>    ─  heutiges Datum');
            println('<span class="cmd">/version</span> ─  Versionsinformation');
            println('<span class="cmd">/git</span>     ─  Link zum Projekt-Repository');
            println('<span class="cmd">/whoami</span>  ─  aktueller Benutzername@Host');
            println('<span class="cmd">/setusername &lt;name&gt;</span>  ─  Benutzernamen ändern');
            println('<span class="cmd">/setuserhost &lt;host&gt;</span>   ─  Hostnamen ändern');
            println('<span class="cmd">/login</span>   ─  (zukünftig) Anmelden');
            println('<span class="cmd">/register</span>─  (zukünftig) Registrieren');
            println('<span class="cmd">/logout</span>  ─  (zukünftig) Abmelden');
            println('────────────── Phase 1.1 ──────────────');
            println('<span class="cmd">/wttr</span>     ─  Wetter Seesen');
            println('<span class="cmd">/sunrise</span>  ─  Sonnenaufgang heute');
            println('<span class="cmd">/sundown</span>  ─  Sonnenuntergang heute');
            println('<span class="cmd">/speak &lt;text&gt;</span> ─  Text vorlesen');
            println('<span class="cmd">/rune</span>     ─  kleines Easteregg');
            break;

        case '/clear':
            clearOutput();
            break;

        case '/time':
            const now = new Date().toLocaleTimeString('de-DE', {
                timeZone: 'Europe/Berlin',
                hour12: false
            });
            println(`Berlin: ${now}`);
            break;

        case '/date':
            const today = new Date().toLocaleDateString('de-DE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            println(today);
            break;

        case '/version':
            println('Centercore Terminal <b>v1.0.0</b> – Februar 2026');
            println('Aktuell noch lokales Experiment.');
            println('Neuigkeiten &amp; Quellcode → <span class="cmd">/git</span>');
            break;

        case '/git':
            const repo = 'https://github.com/dein-benutzername/centercore-terminal'; // ← hier ändern!
            println(`Repository: <a href="${repo}" target="_blank" style="color:#0ff">${repo}</a>`);
            break;

        case '/whoami':
            println(`${username}@${host}`);
            break;

        case '/setusername':
            if (args.length === 0) {
                error('Nutzung: /setusername NeuerName');
                return;
            }
            username = args.join(' ');
            localStorage.setItem('centercore_username', username);
            updatePrompt();
            success(`Benutzername geändert zu <b>${username}</b>`);
            break;

        case '/setuserhost':
            if (args.length === 0) {
                error('Nutzung: /setuserhost neuer.host');
                return;
            }
            host = args.join(' ');
            localStorage.setItem('centercore_host', host);
            updatePrompt();
            success(`Hostname geändert zu <b>${host}</b>`);
            break;

        case '/logout':
            username = 'guest';
            host = 'cabin';
            localStorage.setItem('centercore_username', username);
            localStorage.setItem('centercore_host', host);
            updatePrompt();
            success('Ausgeloggt. Du bist jetzt wieder <b>guest@cabin</b>');
            break;

        case '/login':
        case '/register':
            println('→ Diese Funktion kommt in einer späteren Version.');
            println('(Ziel: echte Benutzerkonten mit persistenter Speicherung)');
            break;

            // ─── Platzhalter / kommende Features ───
        case '/wttr':
        case '/sunrise':
        case '/sundown':
        case '/speak':
        case '/rune':
            println('Dieser Befehl wird gerade implementiert … bald verfügbar.');
            break;

        default:
            error(`Unbekannter Befehl: ${cmd}`);
            println('Tipp: <span class="cmd">/commands</span> zeigt alle verfügbaren Befehle.');
    }
}

// ────────────────────────────────────────────────
// Event-Listener
// ────────────────────────────────────────────────
input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        const value = input.value.trim();
        if (value) {
            processCommand(value);
        }
        input.value = '';
    }
});

// ────────────────────────────────────────────────
// Start
// ────────────────────────────────────────────────
clearOutput();
print('Cabin Log Terminal <span style="color:#0f0">v1.0.0</span> – Centercore');
println('Willkommen zurück. Tippe <span class="cmd">/help</span> oder <span class="cmd">/commands</span> für Hilfe.');