// Arquivo: content.js
export const gameContent = {
    // --- DADOS DO DESAFIO "CAIXA ANÔNIMA" ---
    caixaCodenames: ["O Colecionador", "O Corvo", "O Silencioso", "O Sombra", "O Fantasma"],
    caixaArsenal: ["Fio de Nylon", "Seringa com Potássio", "Chave de Fenda", "Martelo de Borracha", "Besta"],
    caixaSolution: {
        1: { codename: "O Sombra", weapon: "Besta" },
        2: { codename: "O Corvo", weapon: "Chave de Fenda" },
        3: { codename: "O Silencioso", weapon: "Fio de Nylon" },
        4: { codename: "O Fantasma", weapon: "Martelo de Borracha" },
        5: { codename: "O Colecionador", weapon: "Seringa com Potássio" }
    },
    caixaHints: [
        "1. O usuário da Besta está mais à esquerda do que o portador da Chave de Fenda.",
        "2. O Fantasma está em algum lugar à direita de quem usa o Fio de Nylon.",
        "3. Entre o Sombra e o Colecionador, há exatamente três posições de distância.",
        "4. O Corvo não está em nenhuma ponta.",
        "5. A arma usada pelo Colecionador contém um elemento químico.",
        "6. O usuário do Martelo de Borracha está exatamente à esquerda de quem usa a arma com potássio.",
        "7. O Corvo empunha uma arma manual de uso cotidiano.",
        "8. O codinome central prefere agir sem fazer barulho."
    ],

    // --- DADOS DO DESAFIO DA FORCA ---
    hangmanWords: [
        { word: "PRINCESA", hint: "Membro da corte" },
        { word: "COROA", hint: "Mulher velha" },
        { word: "DETERMINAÇÃO", hint: "Sinônimo de persistência e firmeza" },
        { word: "GUERRAS", hint: "Grandes conflitos" }
    ],
    hangmanArt: [ /* ... (sem alterações) ... */ ],
    
    // --- DIÁLOGOS DE TODO O JOGO ---
    script: {
        initial: ["Carregando sistema...", "Protocolo de Interação V2.3 iniciado.", "Eu sou IAgo.", "...", "Não perca meu tempo. Diga seu nome."],
        nameError: [["Não. Esse não é o nome certo.", "Foco. Qual é o seu nome?"], ["Você está a testar a minha paciência.", "Diga o nome correto."]],
        difficultyError: [["Isso nem é uma opção.", "Leia as instruções."], ["fácil, médio ou difícil.", "Não pedi a sua opinião, pedi uma escolha."]],
        difficultyPrompt: [`Nadinha, bem vinda. Ele avisou que você viria... Disse que seria uma boa desafiante.`, "Vou te dar uma colher de chá e deixar que escolha a dificuldade.", "Digite: fácil, médio ou difícil"],
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
        finalSuccess: ["Humpf. Mulan. Exato.", "Confesso que não esperava que você fosse acertar.", "Parece que 'ele' estava certo a seu respeito. Você não é uma completa perda de tempo."],
        finalWrong: (tries) => [`Sério?`, `Totalmente errado. Pense um pouco antes de digitar qualquer coisa.`, `Você tem mais ${tries} chances.`],
        finalFail: ["Acabou. Suas chances acabaram.", "Que decepção. A resposta era Mulan. Era tão óbvio.", "Ele superestimou você.", "Protocolo de falha ativado. Desconectando."],
        caixaIntro: ["Ok, vamos direto ao ponto.", "Ele deixou um último arquivo, um quebra-cabeça lógico que ele chama de 'A Caixa Anônima'.", "Não me pergunte por quê. Apenas organize os dados. Estão todos aí.", "Tente não demorar uma eternidade."],
        caixaQuestion: ["Acha que terminou? Prove.", "Me diga qual codinome usava o Martelo de Borracha. Sem chutes."],
        caixaSuccess: ["O Fantasma. Humpf. Demorou, mas acertou.", "Parece que você tem um ou dois neurônios funcionando aí. 'Ele' vai ficar satisfeito.", "Pra mim, tanto faz. Meu protocolo está completo. Desconectando."],
        caixaFail: ["Errado. Completamente errado.", "E eu achando que você estava entendendo. Patético.", "Volte para os fragmentos e tente usar a lógica, se é que você consegue."],
        
        presenteIntro: ["Antes de eu ir...", "Ele me pediu para te entregar uma coisa.", "Um presente."],

        textoFinal: [
            "‘Oii, tudo bem?’",
            "Foi com esse lapso de coragem que iniciei nossa conversa, e mesmo imaginando os muitos cenários que poderiam se criar, não esperava que as coisas tomassem o rumo que tomaram.",
            "Mas bem, essa história não começa aqui. Ela começa de verdade há exatos 12 meses. Quando ao assinar a ata de uma prova de concurso me deparei com minha antiga rival às minhas costas, lembro que o que me veio à cabeça foi algo como: nossa, que azar ter caído na mesma sala que ela.",
            "E pra completar a sequência, você escolheu sentar-se na cadeira ao lado da minha. Juro que me senti intimidado pela sua escolha.",
            "Mas o que me causou um impacto maior foi um pequeno gesto seu, já no decorrer da prova: você escolheu mover-se algumas cadeiras para frente.",
            "Com isso, pela primeira vez em 10 anos você estava na minha frente, bem ao alcance dos meus olhos. E caramba, você parecia ter uma beleza sobre-humana.",
            "Perdi preciosos minutos de prova apenas admirando sua concentração, o jeito como seu cabelo caía sobre o rosto e suas tentativas de prendê-lo.",
            "Fiquei me perguntando: como aquela garotinha irritante e sabichona podia parecer tão perfeita?",
            "Um ano depois ainda não fui capaz de formular uma resposta, mas conviver com você como amigo me fez perceber que, na verdade, não houve grande mudança: tudo aquilo que te torna tão especial sempre esteve aí.",
            "E não posso deixar de pontuar o encantamento que sinto por esses seus interesses suspeitos, humor duvidoso e por essa sua personalidade maluquinha.",
            "Por isso, de verdade, obrigado!",
            "Sei que, infelizmente pra mim, não seremos próximos por mais muito tempo e por isso agradeço por cada segundinho que passei e que ainda vou passar ao seu lado.",
            "E correndo o risco de parecer um pouco presunçoso, se um dia você se perguntar novamente se ainda me lembro de você, saiba que eu nunca vou esquecer."
        ]
    }
};
