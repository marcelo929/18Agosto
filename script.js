// Arquivo: script.js
import { gameContent } from './content.js';

// --- CLASSES DE UTILIDADES (UI, Diálogo, Assets) ---

class TerminalUI {
    constructor() {
        this.terminal = document.getElementById('terminal');
        this.output = document.getElementById('output');
        this.interactiveArea = document.getElementById('interactive-area');
        this.userInput = document.getElementById('userInput');
        this.inputLine = document.querySelector('.input-line');
        this.finalScene = document.getElementById('finalScene');
        this.finalText = document.getElementById('finalText');
    }

    async type(lines, clear = true) {
        this.hideInput();
        if (clear) { this.clearOutput(); this.clearInteractiveArea(); }
        for (const line of lines) {
            const p = document.createElement('p'); this.output.appendChild(p);
            for (let i = 0; i < line.length; i++) {
                p.textContent += line[i]; await new Promise(r => setTimeout(r, 30));
            }
            this.scrollToBottom(); await new Promise(r => setTimeout(r, 200));
        }
        this.showInput(); this.focusInput();
    }

    renderHangman(state, dialogue) {
        this.clearOutput();
        const currentWordData = dialogue.getHangmanWord(state.currentWordIndex);
        const fullPhrase = `"uma princesa sem coroa, mas com coragem e determinação para ganhar guerras."`;
        let phraseDisplay = fullPhrase;
        dialogue.getHangmanWords().forEach((wordData, index) => {
            const wordToReplace = new RegExp(wordData.word, "i");
            phraseDisplay = phraseDisplay.replace(wordToReplace, state.solvedWords[index] ? state.solvedWords[index] : '▒'.repeat(wordData.word.length));
        });
        this.output.innerHTML = `<p>${phraseDisplay}</p><br><pre>${dialogue.getHangmanArt(state.wordErrors)}</pre>`;
        const revealedWord = currentWordData.word.split('').map(letter => (state.normalizedGuessedLetters.includes(this.normalizeString(letter))) ? letter : '▒').join(' ');
        this.output.innerHTML += `<p>Palavra Atual: ${revealedWord}</p><p>Dica: "${currentWordData.hint}"</p><p>Letras Tentadas: [${state.guessedLetters.join(', ')}]</p><p>Erros: ${state.wordErrors}/${state.maxErrors}</p><br><p>Digite uma letra:</p>`;
        this.focusInput();
    }
    
    renderCaixaAnonima(stage) {
        this.clearOutput(); this.clearInteractiveArea(); this.hideInput();
        const dialogue = stage.game.dialogue;
        this.output.innerHTML = `<p><strong>Codenomes:</strong> ${dialogue.getCaixaCodenames().join(', ')}.</p>`;
        this.output.innerHTML += `<p><strong>Arsenal:</strong> ${dialogue.getCaixaArsenal().join(', ')}.</p><br>`;
        this.output.innerHTML += `<p><strong>Fragmentos do Servidor:</strong></p>`;
        this.output.innerHTML += `<p style="margin-bottom: 1rem;">1. O Colecionador, cujo método não envolve impacto, ocupa a quinta e última posição.<br>2. O assassino que usa a Chave de Fenda está exatamente uma posição à esquerda daquele que usa o Fio de Nylon.<br>3. O Sombra, que não é o homem do Fio de Nylon, está na primeira posição.<br>4. O Corvo está posicionado em algum lugar à esquerda do Fantasma.<br>5. A Besta não pertence ao assassino da posição 2, nem o Martelo de Borracha pertence ao da posição 3.</p>`;

        const defaultOption = `<option value="">Selecione...</option>`;
        const codenameOptions = defaultOption + dialogue.getCaixaCodenames().map(c => `<option value="${c}">${c}</option>`).join('');
        const arsenalOptions = defaultOption + dialogue.getCaixaArsenal().map(a => `<option value="${a}">${a}</option>`).join('');
        let gridHTML = `<table id="challenge-grid"><thead><tr><th>Posição</th><th>Codinome</th><th>Arsenal</th></tr></thead><tbody>`;
        for (let i = 1; i <= 5; i++) {
            gridHTML += `<tr><td>${i}</td><td><select id="codename-${i}">${codenameOptions}</select></td><td><select id="weapon-${i}">${arsenalOptions}</select></td></tr>`;
        }
        gridHTML += `</tbody></table><button id="verifyBtn">Verificar Solução</button>`;
        this.interactiveArea.innerHTML = gridHTML;

        document.getElementById('verifyBtn').addEventListener('click', () => stage.verifySolution());
    }

    showFinalScene(text) {
        this.terminal.classList.add('hidden');
        this.finalScene.classList.remove('hidden');
        this.finalText.textContent = text;
    }

    normalizeString(str) { return str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
    clearOutput() { this.output.innerHTML = ''; }
    clearInteractiveArea() { this.interactiveArea.innerHTML = ''; }
    hideInput() { this.inputLine.style.display = 'none'; }
    showInput() { this.inputLine.style.display = 'flex'; }
    focusInput() { this.userInput.focus(); }
    disableInput() { this.userInput.disabled = true; }
    getValueAndClear() { const value = this.userInput.value; this.userInput.value = ''; return value; }
    scrollToBottom() { this.terminal.scrollTop = this.terminal.scrollHeight; }
    setTheme(themeName) { document.body.className = ''; if (themeName) document.body.classList.add(themeName); }
}

class Dialogue {
    constructor() { this.content = gameContent; }
    get(key) { return this.content.script[key]; }
    getRandomLine(key) { const lines = this.get(key); return lines[Math.floor(Math.random() * lines.length)]; }
    getHangmanWords() { return this.content.hangmanWords; }
    getHangmanWord(index) { return this.content.hangmanWords[index]; }
    getHangmanArt(index) { return this.content.hangmanArt[index]; }
    getCaixaCodenames() { return this.content.caixaCodenames; }
    getCaixaArsenal() { return this.content.caixaArsenal; }
    getCaixaSolution() { return this.content.caixaSolution; }
}

class AssetLoader {
    constructor() { this.audioContext = null; this.soundtrack = null; this.isLoaded = false; }
    initAudio() { if (!this.audioContext) { this.audioContext = new (window.AudioContext || window.webkitAudioContext)(); } }
    async loadSoundtrack(path) { if (this.isLoaded) return; this.initAudio(); try { const response = await fetch(path); const arrayBuffer = await response.arrayBuffer(); const audioBuffer = await this.audio-context.decodeAudioData(arrayBuffer); this.soundtrack = audioBuffer; this.isLoaded = true; } catch (error) { console.error("Erro ao carregar o áudio:", error); } }
    playSoundtrack() { if (this.audioContext.state === 'suspended') { this.audioContext.resume(); } if (this.soundtrack) { const source = this.audioContext.createBufferSource(); source.buffer = this.soundtrack; source.connect(this.audioContext.destination); source.loop = true; source.start(0); } }
}

// --- CLASSES DE FASE (A "MÁQUINA DE ESTADOS") ---

class GameStage {
    constructor(game) { this.game = game; }
    async start() {}
    async processInput(value) {}
}

class IntroStage extends GameStage {
    constructor(game) { super(game); this.subStage = 'getName'; this.errorCount = 0; }
    async start() { await this.game.ui.type(this.game.dialogue.get('initial')); }
    async processInput(value) {
        this.game.isTyping = true;
        this.game.ui.clearOutput();
        if (this.subStage === 'getName') { await this.handleName(value); }
        else if (this.subStage === 'getDifficulty') { await this.handleDifficulty(value); }
        this.game.isTyping = false;
    }
    async handleName(value) {
        if (['nádia', 'nadia', 'nadinha'].includes(value.toLowerCase())) {
            this.subStage = 'getDifficulty'; this.game.ui.setTheme('pink-mode');
            await this.game.ui.type(this.game.dialogue.get('difficultyPrompt'));
        } else {
            this.errorCount++; await this.game.ui.type(this.game.dialogue.getRandomLine('nameError'));
        }
    }
    async handleDifficulty(value) {
        const choice = value.toLowerCase(); let linesToType;
        if (['fácil', 'facil', 'medio', 'médio'].includes(choice)) { linesToType = this.game.dialogue.get('easyMediumChoice'); }
        else if (['difícil', 'dificil'].includes(choice)) { linesToType = this.errorCount > 0 ? this.game.dialogue.get('hardChoiceWithError') : this.game.dialogue.get('hardChoiceNoError'); }
        else { this.errorCount++; linesToType = [`"${value}"?`, ...this.game.dialogue.getRandomLine('difficultyError')]; await this.game.ui.type(linesToType); return; }
        await this.game.ui.type(linesToType);
        this.game.transitionTo(new HangmanStage(this.game));
    }
}

class HangmanStage extends GameStage {
    constructor(game) { super(game); this.state = { solvedWords: Array(this.game.dialogue.getHangmanWords().length).fill(""), currentWordIndex: 0, guessedLetters: [], normalizedGuessedLetters: [], wordErrors: 0, maxErrors: 6 }; }
    async start() {
        this.game.isTyping = true;
        await this.game.ui.type(this.game.dialogue.get('challengeIntro'));
        this.game.ui.renderHangman(this.state, this.game.dialogue);
        this.game.isTyping = false;
    }
    async processInput(value) {
        const guess = value.toUpperCase(); const normalizedGuess = this.game.ui.normalizeString(guess);
        if (guess.length !== 1 || !/^[A-Z]$/.test(normalizedGuess)) return;
        if (this.state.guessedLetters.includes(guess)) {
            this.game.isTyping = true;
            await this.game.ui.type([this.game.dialogue.getRandomLine('guessRepeated')], false);
            this.game.ui.renderHangman(this.state, this.game.dialogue);
            this.game.isTyping = false; return;
        }
        this.state.guessedLetters.push(guess); if (!this.state.normalizedGuessedLetters.includes(normalizedGuess)) { this.state.normalizedGuessedLetters.push(normalizedGuess); }
        const currentWord = this.game.dialogue.getHangmanWord(this.state.currentWordIndex).word;
        const normalizedWord = this.game.ui.normalizeString(currentWord);
        if (normalizedWord.includes(normalizedGuess)) {
            const wordComplete = currentWord.split('').every(letter => this.state.normalizedGuessedLetters.includes(this.game.ui.normalizeString(letter)));
            if (wordComplete) { await this.nextWord(true); } else { this.game.ui.renderHangman(this.state, this.game.dialogue); }
        } else {
            this.state.wordErrors++; this.game.isTyping = true;
            await this.game.ui.type([this.game.dialogue.getRandomLine('guessWrong')], false);
            this.game.isTyping = false;
            if (this.state.wordErrors >= this.state.maxErrors) { await this.nextWord(false); } else { this.game.ui.renderHangman(this.state, this.game.dialogue); }
        }
    }
    async nextWord(success) {
        this.game.isTyping = true;
        const wordData = this.game.dialogue.getHangmanWord(this.state.currentWordIndex);
        this.state.solvedWords[this.state.currentWordIndex] = success ? wordData.word : `(${wordData.word})`;
        this.state.currentWordIndex++; this.state.guessedLetters = []; this.state.normalizedGuessedLetters = []; this.state.wordErrors = 0;
        if (this.state.currentWordIndex >= this.game.dialogue.getHangmanWords().length) {
            this.game.transitionTo(new FinalEnigmaStage(this.game));
        } else {
            const messageKey = success ? 'wordSuccess' : 'wordFail';
            const message = success ? this.game.dialogue.getRandomLine(messageKey) : this.game.dialogue.get(messageKey)(wordData.word);
            await this.game.ui.type(Array.isArray(message) ? message : [message]);
            this.game.ui.renderHangman(this.state, this.game.dialogue);
        }
        this.game.isTyping = false;
    }
}

class FinalEnigmaStage extends GameStage {
    constructor(game) { super(game); this.tries = 3; }
    async start() { await this.game.ui.type(this.game.dialogue.get('finalReveal')); }
    async processInput(value) {
        this.game.isTyping = true; const answer = value.toLowerCase();
        if (answer === 'mulan') {
            await this.game.ui.type(this.game.dialogue.get('finalSuccess'));
            this.game.transitionTo(new CaixaAnonimaStage(this.game));
        } else {
            this.tries--;
            if (this.tries > 0) { await this.game.ui.type(this.game.dialogue.get('finalWrong')(this.tries)); }
            else { await this.game.ui.type(this.game.dialogue.get('finalFail')); this.game.ui.disableInput(); }
        }
        this.game.isTyping = false;
    }
}

class CaixaAnonimaStage extends GameStage {
    constructor(game) { super(game); this.subStage = 'grid'; }
    async start() {
        this.game.isTyping = true;
        await this.game.ui.type(this.game.dialogue.get('caixaIntro'));
        this.game.ui.renderCaixaAnonima(this);
        this.game.isTyping = false;
    }
    async verifySolution() {
        const solution = this.game.dialogue.getCaixaSolution(); let isCorrect = true;
        for (let i = 1; i <= 5; i++) {
            const selectedCodename = document.getElementById(`codename-${i}`).value;
            const selectedWeapon = document.getElementById(`weapon-${i}`).value;
            if (selectedCodename !== solution[i].codename || selectedWeapon !== solution[i].weapon) { isCorrect = false; break; }
        }
        this.game.isTyping = true;
        if (isCorrect) {
            this.subStage = 'finalQuestion';
            await this.game.ui.type(this.game.dialogue.get('caixaQuestion'));
        } else {
            await this.game.ui.type(this.game.dialogue.get('caixaFail'));
            this.game.ui.renderCaixaAnonima(this);
        }
        this.game.isTyping = false;
    }
    async processInput(value) {
        if (this.subStage !== 'finalQuestion') return;
        this.game.isTyping = true; const answer = value.toLowerCase().replace('o ', '');
        if (answer === 'fantasma') {
            await this.game.ui.type(this.game.dialogue.get('caixaSuccess'));
            this.game.transitionTo(new FinalTextStage(this.game));
        } else {
            this.subStage = 'grid';
            await this.game.ui.type(this.game.dialogue.get('caixaFail'));
            this.game.ui.renderCaixaAnonima(this);
        }
        this.game.isTyping = false;
    }
}

class FinalTextStage extends GameStage {
    async start() {
        this.game.ui.showFinalScene(this.game.dialogue.get('finalText'));
        this.game.assetLoader.playSoundtrack();
    }
    async processInput(value) {}
}

// --- CLASSE PRINCIPAL DO JOGO (O "ORQUESTRADOR") ---

class Game {
    constructor() {
        this.ui = new TerminalUI();
        this.dialogue = new Dialogue();
        this.assetLoader = new AssetLoader();
        this.currentStage = null;
        this.isTyping = false;
    }
    async start() {
        this.setupEventListeners();
        this.assetLoader.loadSoundtrack('./audio/soundtrack.mp3');
        this.transitionTo(new IntroStage(this));
    }
    transitionTo(newStage) {
        this.currentStage = newStage;
        if (this.currentStage) { this.currentStage.start(); }
    }
    async processInput() {
        if (this.isTyping || !this.currentStage) return;
        const value = this.ui.getValueAndClear().trim();
        if (value) { await this.currentStage.processInput(value); }
    }
    setupEventListeners() {
        this.ui.userInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.processInput(); });
        this.ui.terminal.addEventListener('click', () => this.ui.focusInput());
        document.body.addEventListener('click', () => this.assetLoader.initAudio(), { once: true });
    }
}

// --- PONTO DE ENTRADA DA APLICAÇÃO ---
window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.start();
});
