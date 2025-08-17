/**
 * Classe TerminalUI
 * Responsabilidade: Controlar todos os elementos da interface (DOM),
 * como exibir texto, limpar a tela e gerenciar o input.
 */
class TerminalUI {
    constructor() {
        this.terminal = document.getElementById('terminal');
        this.output = document.getElementById('output');
        this.userInput = document.getElementById('userInput');
        this.inputLine = document.querySelector('.input-line');
    }

    // Simula o efeito de digitação na tela
    async type(lines) {
        this.hideInput();
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
    
    clearOutput() {
        this.output.innerHTML = '';
    }

    hideInput() {
        this.inputLine.style.display = 'none';
    }

    showInput() {
        this.inputLine.style.display = 'flex';
    }

    focusInput() {
        this.userInput.focus();
    }
    
    getValueAndClear() {
        const value = this.userInput.value;
        this.userInput.value = '';
        return value;
    }

    scrollToBottom() {
        this.terminal.scrollTop = this.terminal.scrollHeight;
    }
    
    // Método específico para alterar o tema
    setTheme(themeName) {
        document.body.className = ''; // Limpa classes anteriores
        if (themeName) {
            document.body.classList.add(themeName);
        }
    }
}

/**
 * Classe Dialogue
 * Responsabilidade: Armazenar e fornecer todas as falas do jogo.
 */
class Dialogue {
    constructor() {
        this.script = {
            initial: [
                "Carregando sistema...",
                "Protocolo de Interação V2.3 iniciado.",
                "Eu sou IAgo.",
                "...",
                "Não perca meu tempo. Diga seu nome."
            ],
            nameError: [
                ["Não. Esse não é o nome certo.", "Foco. Qual é o seu nome?"],
                ["Você está a testar a minha paciência.", "Diga o nome correto."],
                ["Errado. De novo.", "Vamos lá, não é assim tão difícil."],
                ["Isso não me parece 'Nádia'.", "Tente outra vez."]
            ],
            difficultyError: [
                ["Isso nem é uma opção.", "Leia as instruções."],
                ["[fácil], [médio] ou [difícil].", "Não pedi a sua opinião, pedi uma escolha."],
                ["A sua capacidade de seguir instruções é... limitada.", "Tente de novo."],
                ["Acho que fui claro.", "Escolha uma das opções dadas."]
            ],
            difficultyPrompt: [
                `Nadinha, bem vinda. Ele avisou que você viria... Disse que seria uma boa desafiante.`,
                "Vou te dar uma colher de chá e deixar que escolha a dificuldade.",
                "Digite: [fácil], [médio] ou [difícil]"
            ],
            easyMediumChoice: [
                "hahaha...",
                "Sério mesmo? Você achou que tinha escolha?",
                "Isso foi só uma piada. Ele me programou para operar em apenas UMA dificuldade.",
                "A minha.",
                "Vamos começar.",
                "[O desafio começa aqui... Boa sorte.]"
            ],
            hardChoiceWithError: [
                "Humpf. Pelo menos tem coragem.",
                "Gostei disso. Vou até perdoar suas perguntas inúteis de antes.",
                "Prepare-se.",
                "[O desafio começa aqui... Boa sorte.]"
            ],
            hardChoiceNoError: [
                "Coragem, hein?",
                "Admirável, mas completamente inútil aqui. Coragem não é a chave desse jogo.",
                "Espero que tenha algo a mais para oferecer.",
                "Vamos ver do que você é feito.",
                "[O desafio começa aqui... Boa sorte.]"
            ],
            challengeStarted: [
                "O desafio já começou. Não há mais o que dizer."
            ]
        };
    }

    get(key) {
        return this.script[key];
    }

    getRandomError(errorType) {
        const errors = this.get(errorType);
        return errors[Math.floor(Math.random() * errors.length)];
    }
}

/**
 * Classe Game
 * Responsabilidade: Orquestrar o jogo, gerenciando o estado (stage, errorCount)
 * e a lógica principal, usando as classes UI e Dialogue.
 */
class Game {
    constructor(ui, dialogue) {
        this.ui = ui;
        this.dialogue = dialogue;

        // Centraliza o estado do jogo em um único objeto
        this.state = {
            stage: 'getName',
            userName: '',
            errorCount: 0,
            isTyping: false
        };
    }
    
    // Inicia o jogo
    async start() {
        this.ui.hideInput();
        this.state.isTyping = true;
        await this.ui.type(this.dialogue.get('initial'));
        this.state.isTyping = false;
    }
    
    // Configura os ouvintes de eventos
    setupEventListeners() {
        this.ui.userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.processInput();
            }
        });

        this.ui.terminal.addEventListener('click', () => {
            this.ui.focusInput();
        });
    }

    // Processa a entrada do usuário
    async processInput() {
        if (this.state.isTyping) return;
        
        const value = this.ui.getValueAndClear().trim();
        
        if (this.state.stage !== 'getName' || value) {
            this.ui.clearOutput();
        }

        switch (this.state.stage) {
            case 'getName':
                this.handleNameStage(value);
                break;
            case 'getDifficulty':
                this.handleDifficultyStage(value);
                break;
            case 'challenge':
                this.state.isTyping = true;
                await this.ui.type(this.dialogue.get('challengeStarted'));
                this.state.isTyping = false;
                break;
        }
    }

    async handleNameStage(value) {
        this.state.isTyping = true;
        const normalizedName = value.toLowerCase();
        
        if (['nádia', 'nadia', 'nadinha'].includes(normalizedName)) {
            this.state.userName = "Nádia";
            this.state.stage = 'getDifficulty';
            this.ui.setTheme('pink-mode');
            await new Promise(resolve => setTimeout(resolve, 200));
            await this.ui.type(this.dialogue.get('difficultyPrompt'));
        } else {
            this.state.errorCount++;
            if (value) {
                 this.ui.clearOutput();
            } else {
                 this.ui.output.innerHTML = '';
            }
            await this.ui.type(this.dialogue.getRandomError('nameError'));
        }
        this.state.isTyping = false;
    }

    async handleDifficultyStage(value) {
        this.state.isTyping = true;
        const choice = value.toLowerCase();
        let linesToType;

        if (['fácil', 'facil', 'medio', 'médio'].includes(choice)) {
            this.state.stage = 'challenge';
            linesToType = this.dialogue.get('easyMediumChoice');
        } else if (['difícil', 'dificil'].includes(choice)) {
            this.state.stage = 'challenge';
            linesToType = this.state.errorCount > 0 
                ? this.dialogue.get('hardChoiceWithError') 
                : this.dialogue.get('hardChoiceNoError');
        } else {
            this.state.errorCount++;
            const newPrompt = [...this.dialogue.getRandomError('difficultyError')];
            newPrompt.unshift(`"${value}"?`);
            linesToType = newPrompt;
        }
        await this.ui.type(linesToType);
        this.state.isTyping = false;
    }
}

// --- PONTO DE ENTRADA DA APLICAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Instanciar as classes
    const ui = new TerminalUI();
    const dialogue = new Dialogue();
    const game = new Game(ui, dialogue);

    // 2. Configurar os eventos
    game.setupEventListeners();

    // 3. Iniciar o jogo
    game.start();
});
