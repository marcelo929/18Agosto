/**
 * Classe TerminalUI
 * Responsabilidade: Controlar todos os elementos da interface (DOM).
 */
class TerminalUI {
    constructor() {
        this.terminal = document.getElementById('terminal');
        this.output = document.getElementById('output');
        this.userInput = document.getElementById('userInput');
        this.inputLine = document.querySelector('.input-line');
    }

    async type(lines, clear = true) {
        this.hideInput();
        if (clear) this.clearOutput();
        
        for (const line of lines) {
            const p = document.createElement('p');
            this.output.appendChild(p);
            for (let i = 0; i < line.length; i++) {
                p.textContent += line[i];
                await new Promise(resolve => setTimeout(resolve, 30));
            }
            this.scrollToBottom();
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        this.showInput();
        this.focusInput();
    }

    renderHangman(state, dialogue) {
        this.clearOutput();
        const currentWordData = dialogue.getHangmanWord(state.currentWordIndex);
        
        const fullPhrase = `"uma princesa sem coroa, mas com coragem e determinação para ganhar guerras."`;
        let phraseDisplay = fullPhrase;

        dialogue.getHangmanWords().forEach((wordData, index) => {
            const wordToReplace = new RegExp(wordData.word, "i");
            if (state.solvedWords[index]) {
                phraseDisplay = phraseDisplay.replace(wordToReplace, `${state.solvedWords[index]}`);
            } else {
                const corruptedWord = `${'▒'.repeat(wordData.word.length)}`;
                phraseDisplay = phraseDisplay.replace(wordToReplace, corruptedWord);
            }
        });
        this.output.innerHTML += `<p>${phraseDisplay}</p><br>`;

        this.output.innerHTML += `<pre>${dialogue.getHangmanArt(state.wordErrors)}</pre>`;
        
        const revealedWord = currentWordData.word
            .split('')
            .map(letter => (state.normalizedGuessedLetters.includes(this.normalizeString(letter))) ? letter : '▒')
            .join(' ');

        this.output.innerHTML += `<p>Palavra Atual: ${revealedWord}</p>`;
        this.output.innerHTML += `<p>Dica: "${currentWordData.hint}"</p>`;
        this.output.innerHTML += `<p>Letras Tentadas: [${state.guessedLetters.join(', ')}]</p>`;
        this.output.innerHTML += `<p>Erros: ${state.wordErrors}/${state.maxErrors}</p><br>`;
        this.output.innerHTML += `<p>Digite uma letra:</p>`;
        
        this.focusInput();
    }
    
    normalizeString(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    clearOutput() { this.output.innerHTML = ''; }
    hideInput() { this.inputLine.style.display = 'none'; }
    showInput() { this.inputLine.style.display = 'flex'; }
    focusInput() { this.userInput.focus(); }
    disableInput() { this.userInput.disabled = true; }
    
    getValueAndClear() {
        const value = this.userInput.value;
        this.userInput.value = '';
        return value;
    }

    scrollToBottom() { this.terminal.scrollTop = this.terminal.scrollHeight; }
    
    setTheme(themeName) {
        document.body.className = '';
        if (themeName) document.body.classList.add(themeName);
    }
}

/**
 * Classe Dialogue
 * Responsabilidade: Armazenar e fornecer todo o conteúdo (falas, dados do jogo).
 */
class Dialogue {
    constructor() {
        this.hangmanWords = [
            { word: "PRINCESA", hint: "membro da corte" },
            { word: "COROA", hint: "símbolo de realeza usado na cabeça" },
            { word: "DETERMINAÇÃO", hint: "sinônimo de persistência e firmeza" },
            { word: "GUERRAS", hint: "grandes conflitos entre nações" }
        ];

        this.hangmanArt = [
            `+---+\n|   |\n|\n|\n|\n|\n=========`, `+---+\n|   |\n|   O\n|\n|\n|\n=========`,
            `+---+\n|   |\n|   O\n|   |\n|\n|\n=========`, `+---+\n|   |\n|   O\n|  /|\n|\n|\n=========`,
            `+---+\n|   |\n|   O\n|  /|\\\n|\n|\n=========`, `+---+\n|   |\n|   O\n|  /|\\\n|  /\n|\n=========`,
            `+---+\n|   |\n|   O\n|  /|\\\n|  / \\\n|\n=========`
        ];

        this.script = {
            initial: ["Carregando sistema...", "Protocolo de Interação V2.3 iniciado.", "Eu sou IAgo.", "...", "Não perca meu tempo. Diga seu nome."],
            nameError: [["Não. Esse não é o nome certo.", "Foco. Qual é o seu nome?"], ["Você está a testar a minha paciência.", "Diga o nome correto."]],
            difficultyError: [["Isso nem é uma opção.", "Leia as instruções."], ["[fácil], [médio] ou [difícil].", "Não pedi a sua opinião, pedi uma escolha."]],
            difficultyPrompt: [`Nadinha, bem vinda. Ele avisou que você viria... Disse que seria uma boa desafiante.`, "Vou te dar uma colher de chá e deixar que escolha a dificuldade.", "Digite: [fácil], [médio] ou [difícil]"],
            easyMediumChoice: ["hahaha...", "Sério mesmo? Você achou que tinha escolha?", "Isso foi só uma piada. Ele me programou para operar em apenas UMA dificuldade.", "A minha.", "Vamos começar."],
            hardChoiceWithError: ["Humpf. Pelo menos tem coragem.", "Gostei disso. Vou até perdoar suas perguntas inúteis de antes.", "Prepare-se."],
            hardChoiceNoError: ["Coragem, hein?", "Admirável, mas completamente inútil aqui. Coragem não é a chave desse jogo.", "Espero que tenha algo a mais para oferecer.", "Vamos ver do que você é feito."],
            challengeIntro: ["Certo. O desafio é simples.", "Decodifique a mensagem que meu criador deixou para você. Algumas partes estão... corrompidas.", "Você terá que advinhar, letra por letra. Mas cuidado, cada erro te aproxima do fim da linha. Literalmente."],
            guessCorrect: ["Sorte.", "Até que enfim."],
            guessWrong: ["Péssima escolha. Tente de novo.", "Você está chegando perto de um final trágico."],
            guessRepeated: ["Já tentamos essa, preste atenção."],
            wordSuccess: ["Ok, um a menos. Não se ache muito. Próxima palavra."],
            wordFail: (word) => [`Fim de jogo para esta palavra. Tanta confiança pra nada... A palavra era ${word}.`, "Vamos ver se você se sai melhor na próxima."],
            finalReveal: [`"uma princesa sem coroa, mas com coragem e determinação para ganhar guerras."`, "Aí está. A mensagem completa, sem minhas interferências.", "Meu trabalho de decodificação acabou. Agora o resto é com você.", "A pergunta final:", "E então, gênio? A quem essa frase se refere?", "Pense bem. Ele não gosta de perdedores."],
            finalSuccess: ["Humpf. Mulan. Exato.", "Confesso que não esperava que você fosse acertar.", "Parece que 'ele' estava certo a seu respeito. Você não é uma completa perda de tempo.", "Meu trabalho aqui terminou. Conexão sendo encerrada."],
            finalWrong: (tries) => [`Sério?`, `Totalmente errado. Pense um pouco antes de digitar qualquer coisa.`, `Você tem mais ${tries} chances.`],
            finalFail: ["Acabou. Suas chances acabaram.", "Que decepção. A resposta era Mulan. Era tão óbvio.", "Ele superestimou você.", "Protocolo de falha ativado. Desconectando."]
        };
    }

    get(key) { return this.script[key]; }
    getRandomLine(key) {
        const lines = this.get(key);
        return lines[Math.floor(Math.random() * lines.length)];
    }
    // Novo método para arrays de arrays (erros, falas alternativas etc.)
    getRandomDialogue(key) {
        const options = this.get(key);
        return options[Math.floor(Math.random() * options.length)];
    }
    getHangmanWords() { return this.hangmanWords; }
    getHangmanWord(index) { return this.hangmanWords[index]; }
    getHangmanArt(index) { return this.hangmanArt[index]; }
}

/**
 * Classe Game
 * Responsabilidade: Orquestrar o jogo, gerenciando o estado e a lógica principal.
 */
class Game {
    constructor(ui, dialogue) {
        this.ui = ui;
        this.dialogue = dialogue;

        this.state = {
            stage: 'getName',
            isTyping: false,
            errorCount: 0,
            solvedWords: ["", "", "", ""],
            currentWordIndex: 0,
            guessedLetters: [],
            normalizedGuessedLetters: [],
            wordErrors: 0,
            maxErrors: 6,
            finalTries: 3
        };
    }
    
    async start() {
        this.state.isTyping = true;
        await this.ui.type(this.dialogue.get('initial'));
        this.state.isTyping = false;
    }
    
    setupEventListeners() {
        this.ui.userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.processInput();
        });
        this.ui.terminal.addEventListener('click', () => this.ui.focusInput());
    }

    async processInput() {
        if (this.state.isTyping) return;
        
        const value = this.ui.getValueAndClear().trim();
        if (!value) return;

        switch (this.state.stage) {
            case 'getName':
                this.ui.clearOutput();
                await this.handleNameStage(value);
                break;
            case 'getDifficulty':
                this.ui.clearOutput();
                await this.handleDifficultyStage(value);
                break;
            case 'hangman':
                await this.handleHangmanInput(value);
                break;
            case 'finalEnigma':
                await this.handleFinalEnigmaInput(value);
                break;
        }
    }

    async handleNameStage(value) {
        this.state.isTyping = true;
        const normalizedName = value.toLowerCase();

        if (['nádia', 'nadia', 'nadinha'].includes(normalizedName)) {
            this.state.stage = 'getDifficulty';
            this.ui.setTheme('pink-mode');
            await new P
