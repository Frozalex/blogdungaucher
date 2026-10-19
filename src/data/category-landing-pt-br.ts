import type { CategoryLandingRich } from "./category-landing-rich";
import type { CategorySlug } from "./site";

export const categoryLandingPtBr: Partial<Record<CategorySlug, CategoryLandingRich>> = {
  science: {
    sections: [
      {
        title: "O que uma pesquisa sobre xadrez realmente mede?",
        paragraphs: [
          "Uma posição no tabuleiro pode servir para estudar memória, percepção ou decisão. Isso não significa que uma experiência responda a todas essas perguntas ao mesmo tempo. Nesta seção, o ponto de partida é identificar a tarefa, os participantes e a medida utilizada antes de interpretar o resultado.",
          "Ao ler sobre especialistas, diferencie o reconhecimento de posições familiares da memorização de peças aleatórias. Ao ler sobre o cérebro, diferencie uma associação observada de uma explicação causal. Uma diferença entre grupos não demonstra que jogar xadrez produz o mesmo efeito em qualquer pessoa, nem promete prevenir uma doença.",
        ],
      },
      {
        title: "Do tabuleiro aos algoritmos",
        paragraphs: [
          "A seção também acompanha a representação de posições e a busca de jogadas. Um pequeno exemplo de minimax permite seguir cada escolha; uma estimativa de crescimento combinatório permite discutir por que esse procedimento fica caro. São ferramentas com funções diferentes: uma potência ilustrativa não é uma contagem exata de todas as partidas legais.",
          "Para comparar motores, procure a versão do programa, o tempo disponível e os recursos de cálculo. Um placar pertence ao protocolo em que foi obtido. Os artigos incluem referências para você conferir essas condições e distinguir desempenho em uma competição da resolução teórica do jogo.",
        ],
      },
    ],
    cards: [
      { title: "Memória e experiência", body: "Comece pelos padrões familiares e pelos limites da transferência para tarefas fora do tabuleiro." },
      { title: "Busca e avaliação", body: "Siga exemplos pequenos antes de comparar a escala dos motores modernos." },
      { title: "Fontes e limites", body: "Confira o que foi medido, em quem e sob quais condições." },
    ],
  },
  esprit: {
    sections: [
      {
        title: "Entender uma decisão sem diagnosticar o jogador",
        paragraphs: [
          "Depois de uma derrota, é tentador atribuir tudo à confiança, ao medo ou a um viés. A análise pode começar por algo mais verificável: a posição, o tempo restante, os candidatos considerados e o que você escreveu antes de consultar o motor. Esses registros ajudam a separar um erro técnico de uma hipótese sobre sua experiência.",
          "Os conceitos apresentados aqui oferecem perguntas para observar a própria prática. Uma analogia com uma pesquisa de psicologia não constitui um diagnóstico, e uma emoção durante a partida não revela sozinha sua causa. Os textos distinguem resultados de estudos, interpretações e propostas de exercício.",
        ],
      },
      {
        title: "Transformar a leitura em uma experiência de treino",
        paragraphs: [
          "Escolha uma situação concreta: pressa no fim da partida, dificuldade para voltar após uma derrota ou análise centrada apenas no resultado. Teste uma mudança pequena e anote o que aconteceu. Uma rotina de pausa ou preparação pode ser útil para observar seu funcionamento, sem garantir pontos de rating ou um estado de concentração específico.",
          "Você pode começar pelos artigos sobre concentração e gestão do tempo, depois comparar os de confiança, perfeccionismo e reação à derrota. Retorne à posição quando uma explicação psicológica parecer explicar tudo: nem toda derrota tem uma causa emocional, e nenhum conceito substitui a análise dos lances.",
        ],
      },
    ],
    cards: [
      { title: "Observar antes de explicar", body: "Registre decisões e circunstâncias antes de escolher um rótulo psicológico." },
      { title: "Ajustar uma rotina", body: "Teste uma mudança delimitada e avalie sua utilidade na sua prática." },
      { title: "Separar experiência e placar", body: "O resultado da partida e a qualidade de uma decisão são perguntas diferentes." },
    ],
  },
  societe: {
    sections: [
      {
        title: "O xadrez dentro de sua história",
        paragraphs: [
          "O jogo circula entre escolas, clubes, competições e plataformas. Cada ambiente define oportunidades de aprender, formas de reconhecimento e condições de participação. Nesta seção, o tabuleiro é um ponto de entrada para discutir essas instituições, sem tratar um episódio marcante como retrato de toda uma sociedade.",
          "Relatos históricos precisam de datas, lugares e fontes. Uma partida famosa pode ilustrar um conflito político ou uma transformação cultural; ela não basta para explicar sozinha esse processo. Os artigos procuram distinguir o acontecimento documentado, a interpretação posterior e as perguntas que continuam abertas.",
        ],
      },
      {
        title: "Comparar ideias sem transformar analogias em provas",
        paragraphs: [
          "Filosofia, religião e representações sociais oferecem maneiras diferentes de falar sobre regras, escolha e responsabilidade. Uma comparação pode tornar uma pergunta mais clara, mas também esconder diferenças. Ao ler, pergunte qual aspecto do jogo sustenta a analogia e onde ela deixa de funcionar.",
          "Você pode percorrer os textos por um tema e comparar suas referências. Observe quem participa do relato, quais instituições aparecem e quais vozes estão ausentes. Essa leitura permite usar o xadrez para investigar questões sociais sem supor que o jogo fornece uma resposta universal para elas.",
        ],
      },
    ],
    cards: [
      { title: "Contexto histórico", body: "Localize cada episódio antes de generalizar sua interpretação." },
      { title: "Instituições e acesso", body: "Observe como escolas, clubes e plataformas organizam a participação." },
      { title: "Limites das analogias", body: "Compare ideias preservando as diferenças entre o jogo e a vida social." },
    ],
  },
};
