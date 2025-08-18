// Arquivo: script.js (Versão final sem classes duplicadas)
import { gameContent } from './content.js';

// --- CLASSES DE UTILIDADES (UI, Diálogo, Assets) ---

class ChatUI {
    constructor() {
        this.messageContainer = document.querySelector('.message-container');
        this.interactiveArea = document.getElementById('interactive-area');
        this.userInput = document.getElementById('userInput');
        this.inputLine = document.querySelector('.input-line');
        this.finalScene = document.getElementById('finalScene');
        this.finalText = document.getElementById('finalText');
    }

    addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.textContent = text;
        this.messageContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    async addBotMessage(lines) {
        this.disableInput();
        if (typeof lines === 'string') lines = [lines];

        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message';
        typingDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        this.messageContainer.appendChild(typingDiv);
        this.scrollToBottom();
        
        await new Promise(r => setTimeout(r, 1200));
        this.messageContainer.removeChild(typingDiv);

        for (const line of lines) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message bot-message';
            messageDiv.textContent = line;
            this.messageContainer.appendChild(messageDiv);
            this.scrollToBottom();
            await new Promise(r => setTimeout(r, 400));
        }
        this.enableInput();
    }

    renderHangman(state, dialogue) {
        this.clearInteractiveArea();
        const currentWordData = dialogue.getHangmanWord(state.currentWordIndex);
        const revealedWord = currentWordData.word.split('').map(letter => (state.normalizedGuessedLetters.includes(this.normalizeString(letter))) ? letter : '＿').join(' ');
        
        let hangmanText = `Palavra: ${revealedWord}\n`;
        hangmanText += `Dica: "${currentWordData.hint}"\n`;
        hangmanText += `Letras: [${state.guessedLetters.join(', ')}] | Erros: ${state.wordErrors}/${state.maxErrors}`;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'bot-message'; // Usa o estilo de balão
        messageDiv.style.whiteSpace = 'pre-wrap';
        messageDiv.textContent = hangmanText;
        
        this.interactiveArea.appendChild(messageDiv);
        this.scrollToBottom();
    }

    renderCaixaAnonima(stage) {
        this.clearInteractiveArea();
        this.disableInput();
        const dialogue = stage.game.dialogue;
        const codenames = dialogue.getCaixaCodenames();
        const arsenal = dialogue.getCaixaArsenal();
        const defaultOption = `<option value="">Selecione...</option>`;
        const codenameOptions = defaultOption + codenames.map(c => `<option value="${c}">${c}</option>`).join('');
        const arsenalOptions = defaultOption + arsenal.map(a => `<option value="${a}">${a}</option>`).join('');
        let gridHTML = `<table id="challenge-grid"><thead><tr><th>Posição</th><th>Codinome</th><th>Arsenal</th></tr></thead><tbody>`;
        for (let i = 1; i <= 5; i++) {
            gridHTML += `<tr><td>${i}</td><td><select id="codename-${i}">${codenameOptions}</select></td><td><select id="weapon-${i}">${arsenalOptions}</select></td></tr>`;
        }
        gridHTML += `</tbody></table><button id="verifyBtn">Verificar Solução</button>`;
        this.interactiveArea.innerHTML = gridHTML;
        document.getElementById('verifyBtn').addEventListener('click', () => stage.verifySolution());
    }

    showFinalScene(text) { document.getElementById('terminal').classList.add('hidden'); this.finalScene.classList.remove('hidden'); this.finalText.textContent = text; }
    normalizeString(str) { return str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
    clearInteractiveArea() { this.interactiveArea.innerHTML = ''; }
    enableInput() { this.userInput.disabled = false; this.userInput.focus(); }
    disableInput() { this.userInput.disabled = true; }
    getValueAndClear() { const value = this.userInput.value; this.userInput.value = ''; return value; }
    scrollToBottom() { this.messageContainer.scrollTop = this.messageContainer.scrollHeight; }
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
    async loadSoundtrack(path) { if (this.isLoaded) return; this.initAudio(); try { const response = await fetch(path); if (!response.ok) { throw new Error(`Arquivo de áudio não encontrado: ${response.statusText}`); } const arrayBuffer = await response.arrayBuffer(); const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer); this.soundtrack = audioBuffer; this.isLoaded = true; } catch (error) { console.warn("Aviso: Trilha sonora não pôde ser carregada.", error); } }
    playSoundtrack() { if (this.audioContext.state === 'suspended') { this.audioContext.resume(); } if (this.isLoaded && this.soundtrack) { const source = this.audioContext.createBufferSource(); source.buffer = this.soundtrack; source.connect(this.audioContext.destination); source.loop = true; source.start(0); } }
}

// --- CLASSES DE FASE (A "MÁQUINA DE ESTADOS") ---

class GameStage {
    constructor(game) { this.game = game; }
    async start() {}
    async processInput(value) {}
}

class IntroStage extends GameStage {
    constructor(game) { super(game); this.subStage = 'getName'; this.errorCount = 0; }
    async start() { await this.game.ui.addBotMessage(this.game.dialogue.get('initial')); }
    async processInput(value) {
        this.game.ui.clearInteractiveArea();
        if (this.subStage === 'getName') { await this.handleName(value); }
        else if (this.subStage === 'getDifficulty') { await this.handleDifficulty(value); }
    }
    async handleName(value) {
        if (['nádia', 'nadia', 'nadinha'].includes(value.toLowerCase())) {
            this.subStage = 'getDifficulty';
            await this.game.ui.addBotMessage(this.game.dialogue.get('difficultyPrompt'));
        } else {
            this.errorCount++;
            await this.game.ui.addBotMessage(this.game.dialogue.getRandomLine('nameError'));
        }
    }
    async handleDifficulty(value) {
        const choice = value.toLowerCase(); let linesToType;
        if (['fácil', 'facil', 'medio', 'médio'].includes(choice)) { linesToType = this.game.dialogue.get('easyMediumChoice'); }
        else if (['difícil', 'dificil'].includes(choice)) { linesToType = this.errorCount > 0 ? this.game.dialogue.get('hardChoiceWithError') : this.game.dialogue.get('hardChoiceNoError'); }
        else { this.errorCount++; linesToType = [`"${value}"?`, ...this.game.dialogue.getRandomLine('difficultyError')]; await this.game.ui.addBotMessage(linesToType); return; }
        await this.game.ui.addBotMessage(linesToType);
        this.game.transitionTo(new HangmanStage(this.game));
    }
}

class HangmanStage extends GameStage {
    constructor(game) { super(game); this.state = { solvedWords: Array(this.game.dialogue.getHangmanWords().length).fill(""), currentWordIndex: 0, guessedLetters: [], normalizedGuessedLetters: [], wordErrors: 0, maxErrors: 6 }; }
    async start() {
        await this.game.ui.addBotMessage(this.game.dialogue.get('challengeIntro'));
        this.game.ui.renderHangman(this.state, this.game.dialogue);
        this.game.ui.enableInput();
    }
    async processInput(value) {
        const guess = value.toUpperCase(); const normalizedGuess = this.game.ui.normalizeString(guess);
        if (guess.length !== 1 || !/^[A-Z]$/.test(normalizedGuess)) return;
        if (this.state.guessedLetters.includes(guess)) { await this.game.ui.addBotMessage(this.game.dialogue.getRandomLine('guessRepeated')); return; }
        this.state.guessedLetters.push(guess); if (!this.state.normalizedGuessedLetters.includes(normalizedGuess)) { this.state.normalizedGuessedLetters.push(normalizedGuess); }
        const currentWord = this.game.dialogue.getHangmanWord(this.state.currentWordIndex).word;
        const normalizedWord = this.game.ui.normalizeString(currentWord);
        if (normalizedWord.includes(normalizedGuess)) {
            const wordComplete = currentWord.split('').every(letter => this.state.normalizedGuessedLetters.includes(this.game.ui.normalizeString(letter)));
            if (wordComplete) { await this.nextWord(true); }
            else { this.game.ui.renderHangman(this.state, this.game.dialogue); }
        } else {
            this.state.wordErrors++;
            if (this.state.wordErrors >= this.state.maxErrors) { await this.nextWord(false); }
            else { await this.game.ui.addBotMessage(this.game.dialogue.getRandomLine('guessWrong')); this.game.ui.renderHangman(this.state, this.game.dialogue); }
        }
    }
    async nextWord(success) {
        const wordData = this.game.dialogue.getHangmanWord(this.state.currentWordIndex);
        this.state.solvedWords[this.state.currentWordIndex] = success ? wordData.word : `(${wordData.word})`;
        this.state.currentWordIndex++; this.state.guessedLetters = []; this.state.normalizedGuessedLetters = []; this.state.wordErrors = 0;
        if (this.state.currentWordIndex >= this.game.dialogue.getHangmanWords().length) {
            this.game.transitionTo(new FinalEnigmaStage(this.game));
        } else {
            const messageKey = success ? 'wordSuccess' : 'wordFail';
            const message = success ? this.game.dialogue.getRandomLine(messageKey) : this.game.dialogue.get(messageKey)(wordData.word);
            await this.game.ui.addBotMessage(Array.isArray(message) ? message : [message]);
            this.game.ui.renderHangman(this.state, this.game.dialogue);
        }
    }
}

class FinalEnigmaStage extends GameStage {
    constructor(game) { super(game); this.tries = 3; }
    async start() { await this.game.ui.addBotMessage(this.game.dialogue.get('finalReveal')); }
    async processInput(value) {
        const answer = value.toLowerCase();
        if (answer === 'mulan') {
            await this.game.ui.addBotMessage(this.game.dialogue.get('finalSuccess'));
            this.game.transitionTo(new CaixaAnonimaStage(this.game));
        } else {
            this.tries--;
            if (this.tries > 0) { await this.game.ui.addBotMessage(this.game.dialogue.get('finalWrong')(this.tries)); }
            else { await this.game.ui.addBotMessage(this.game.dialogue.get('finalFail')); this.game.ui.disableInput(); }
        }
    }
}

class CaixaAnonimaStage extends GameStage {
    constructor(game) { super(game); this.subStage = 'grid'; }
    async start() {
        await this.game.ui.addBotMessage(this.game.dialogue.get('caixaIntro'));
        this.game.ui.renderCaixaAnonima(this);
    }
    async verifySolution() {
        const solution = this.game.dialogue.getCaixaSolution(); let isCorrect = true;
        for (let i = 1; i <= 5; i++) {
            const selectedCodename = document.getElementById(`codename-${i}`).value;
            const selectedWeapon = document.getElementById(`weapon-${i}`).value;
            if (selectedCodename !== solution[i].codename || selectedWeapon !== solution[i].weapon) { isCorrect = false; break; }
        }
        if (isCorrect) {
            this.subStage = 'finalQuestion';
            this.game.ui.clearInteractiveArea();
            await this.game.ui.addBotMessage(this.game.dialogue.get('caixaQuestion'));
        } else {
            await this.game.ui.addBotMessage(this.game.dialogue.get('caixaFail'));
        }
    }
    async processInput(value) {
        if (this.subStage !== 'finalQuestion') return;
        const answer = value.toLowerCase().replace('o ', '');
        if (answer === 'fantasma') {
            await this.game.ui.addBotMessage(this.game.dialogue.get('caixaSuccess'));
            this.game.transitionTo(new FinalTextStage(this.game));
        } else {
            this.subStage = 'grid';
            await this.game.ui.addBotMessage(this.game.dialogue.get('caixaFail'));
            this.game.ui.renderCaixaAnonima(this);
        }
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
        this.ui = new ChatUI();
        this.dialogue = new Dialogue();
        this.assetLoader = new AssetLoader();
        this.currentStage = null;
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
    async processInput(value) {
        if (!value || !this.currentStage) return;
        this.ui.addUserMessage(value);
        await this.currentStage.processInput(value);
    }
    setupEventListeners() {
        this.ui.inputLine.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const value = this.ui.getValueAndClear().trim();
                this.processInput(value);
            }
        });
        document.body.addEventListener('click', () => this.assetLoader.initAudio(), { once: true });
    }
}

// --- PONTO DE ENTRADA DA APLICAÇÃO ---
window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.start();
});
