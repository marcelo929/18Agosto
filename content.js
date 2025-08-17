// Arquivo: content.js
// Central de todo o conteúdo de texto e dados do jogo.

export const gameContent = {
    hangmanWords: [
        { word: "PRINCESA", hint: "membro da corte" },
        { word: "COROA", hint: "símbolo de realeza usado na cabeça" },
        { word: "DETERMINAÇÃO", hint: "sinônimo de persistência e firmeza" },
        { word: "GUERRAS", hint: "grandes conflitos entre nações" }
    ],
    hangmanArt: [
        `+---+\n|   |\n|\n|\n|\n|\n=========`, `+---+\n|   |\n|   O\n|\n|\n|\n=========`,
        `+---+\n|   |\n|   O\n|   |\n|\n|\n=========`, `+---+\n|   |\n|   O\n|  /|\n|\n|\n=========`,
        `+---+\n|   |\n|   O\n|  /|\\\n|\n|\n=========`, `+---+\n|   |\n|   O\n|  /|\\\n|  /\n|\n=========`,
        `+---+\n|   |\n|   O\n|  /|\\\n|  / \\\n|\n=========`
    ],
    script: {
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
        finalFail: ["Acabou. Suas chances acabaram.", "Que decepção. A resposta era Mulan. Era tão óbvio.", "Ele superestimou você.", "Protocolo de falha ativado. Desconectando."],
        finalText: "Ele te espera. Não o desaponte." // Texto para a cena final
    }
};
