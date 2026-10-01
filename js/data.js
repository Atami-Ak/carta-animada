/* ============================================================
   CONTEÚDO — edite só este arquivo para trocar texto, fotos e música.
   ============================================================ */

/* Texto exato da carta. A divisão em frases é feita pelos pontos finais em app.js. */
const LETTER_DATA = {
  title: "Carta para a Minha princesinha",
  text: "Amor, desde que eu te conheci, você me transformou, fez-me apaixonar-me loucamente, buscar melhorar, e querer construir um futuro perfeito ao lado. Cada piadinha, cada riso, cada fase ruim, fez-nos melhorar, amadurecer e tornarmos este casal perfeito que somos. Lembro-me de quando nos conhecermos, você me achava estranho, mas antes de me conhecer, você já né \"Observava\" e me achava estranho cada vez mais, mas se preocupava comigo, mas quando nos falamos pela primeira vez, nós tínhamos uma \"conexão\", gostávamos totalmente da mesma coisa, a gente pensava quase a mesma coisa, e tínhamos quase o mesmo humor, e a cada vez que formos nos conhecendo, mais eu me apaixonava por você, cada detalhe, seu corpo, seu sorriso.... Obrigado por estar sempre ao meu lado meu amor, eu quero ter 5 filhos com você, ter nossos animais de estimação (vários por acaso), ter nossa casa, carro, nosso futuro perfeito. Obrigado por estar sempre ao meu lado, ser meu motivo de viver, e eu nunca quero, em hipótese alguma, pensar em te perder, todas as declarações, poemas, tudo que já fiz pra você, é pra mostrar, o quanto eu te amo, todos os presentes, são pra você sempre olhar, e lembrar de mim, quero que você sonhe comigo a vida toda, e novamente, obrigado por tudo meu amor, por ser sempre está menina incrível, eu te amo, e feliz aniversário minha princesinha linda, e que eu possa ver todos estes momentos, estes aniversários, e comemora-los todos ao seu lado!"
};

/* Fotos, na ordem em que devem aparecer. Coloque os arquivos na pasta "fotos".
   Exemplo: { src: "fotos/01.jpg", alt: "nós dois na praia" } */
const PHOTO_DATA = [
  { src: "fotos/festa-mario.jpg", alt: "" },
  { src: "fotos/filtro-cachorrinho.jpg", alt: "" },
  { src: "fotos/image-1790818441433.jpg", alt: "" },
  { src: "fotos/image-1790818463666.jpg", alt: "" },
  { src: "fotos/image-1790818466010.jpg", alt: "" },
  { src: "fotos/image-1790818477501.jpg", alt: "" },
  { src: "fotos/image-1790818479981.jpg", alt: "" },
  { src: "fotos/image-1790818482884.jpg", alt: "" },
  { src: "fotos/image-1790818484995.jpg", alt: "" },
  { src: "fotos/image-1790818488255.jpg", alt: "" },
  { src: "fotos/image-1790818492137.jpg", alt: "" },
  { src: "fotos/image-1790818493961.jpg", alt: "" },
  { src: "fotos/image-1790818500423.jpg", alt: "" },
  { src: "fotos/image-1790818503641.jpg", alt: "" },
  { src: "fotos/image-1790818507218.jpg", alt: "" },
  { src: "fotos/image-1790818508974.jpg", alt: "" },
  { src: "fotos/image-1790818512217.jpg", alt: "" },
  { src: "fotos/image-1790818514446.jpg", alt: "" },
  { src: "fotos/image-1790818516286.jpg", alt: "" },
  { src: "fotos/pascoa.jpg", alt: "" }
];

/* true = embaralha as fotos a cada abertura; false = segue a ordem da lista acima. */
const PHOTO_SHUFFLE = true;

/* Fadas que voam pela cena, uma entrada por personagem (até 6).
   corpo = PNG com fundo transparente; asas = PNG só das asas (opcional: se existir, elas batem);
   olha: "direita" se a figura estiver virada para a direita (o padrão é esquerda).
   Para adicionar outra fada: coloque o PNG em "img" e inclua uma linha aqui. */
const FAIRY_DATA = [
  { corpo: "img/fada-sininho.png", asas: "img/fada-asas.png" },
  { corpo: "img/fada-silvermist.png" },
  { corpo: "img/fada-rosetta.png", olha: "direita" },
  { corpo: "img/fada-periwinkle.png", olha: "direita" },
  { corpo: "img/fada-fawn.png", olha: "direita" }
];

/* Capas dos filmes da Barbie (2001 a 2016), em ordem de lançamento. Flutuam na cena "barbie". */
const BARBIE_DATA = [
  "img/barbie/01-quebra-nozes.jpg",
  "img/barbie/02-rapunzel.jpg",
  "img/barbie/03-lago-dos-cisnes.jpg",
  "img/barbie/04-princesa-e-plebeia.jpg",
  "img/barbie/05-fairytopia.jpg",
  "img/barbie/06-pegaso.jpg",
  "img/barbie/07-mermaidia.jpg",
  "img/barbie/08-diario.jpg",
  "img/barbie/09-12-princesas.jpg",
  "img/barbie/10-arco-iris.jpg",
  "img/barbie/11-princesa-da-ilha.jpg",
  "img/barbie/12-mariposa.jpg",
  "img/barbie/13-castelo-de-diamante.jpg",
  "img/barbie/14-cancao-de-natal.jpg",
  "img/barbie/15-polegarzinha.jpg",
  "img/barbie/16-tres-mosqueteiras.jpg",
  "img/barbie/17-vida-de-sereia.jpg",
  "img/barbie/18-moda-e-magia.jpg",
  "img/barbie/19-segredo-das-fadas.jpg",
  "img/barbie/20-escola-de-princesas.jpg",
  "img/barbie/21-vida-de-sereia-2.jpg",
  "img/barbie/22-princesa-e-pop-star.jpg",
  "img/barbie/23-portal-secreto.jpg",
  "img/barbie/24-aventura-nas-estrelas.jpg"
];

/* Música opcional. Exemplo: "audio/musica.mp3". Vazio = sem botão de música. */
const AUDIO_SRC = "song/would-you-fall-in-love-with-me-again.mp3";

/* Uma entrada por página. sentences = índices das frases (0 = primeira).
   scene: jardim | apotecaria | constelacao | mar
   layout: centro (frase em destaque) | livro (justificado, com capitular) */
/* Frases longas divididas em partes para caber bem no celular.
   Chave = índice da frase; cada item = as primeiras palavras de onde começa uma nova parte.
   O texto não muda: só o ponto em que a página vira. */
const LETTER_SPLITS = {
  2: ["mas quando nos falamos pela primeira vez", "e a cada vez que formos nos conhecendo"],
  4: ["todas as declarações", "quero que você sonhe comigo", "eu te amo, e feliz aniversário"]
};

const PAGE_CONFIG = [
  { sentences: [0], scene: "jardim",      layout: "centro" },
  { sentences: [1], scene: "apotecaria",  layout: "centro" },
  { quote: ["— Depois de todo esse tempo?", "— Sempre."], by: "Severo Snape, Harry Potter e as Relíquias da Morte", scene: "hogwarts" },
  { sentences: [2], part: 0, scene: "jardim",      layout: "livro" },
  { sentences: [2], part: 1, scene: "constelacao", layout: "livro" },
  { quote: ["Viajamos juntos por apenas dez anos."], by: "Frieren, Frieren e a Jornada para o Além", scene: "neve",
    img: "img/frieren-banner.jpg", pos: "47% 50%", avatar: "img/frieren.jpg" },
  { sentences: [2], part: 2, scene: "lanternas",   layout: "centro" },
  { quote: ["Desculpe, mas posso pedir que me proteja, Jinshi-sama?"], by: "Maomao, Diários de uma Apotecária", scene: "apotecaria",
    img: "img/apotecaria-capa.jpg", pos: "50% 60%", avatar: "img/maomao.jpg" },
  { sentences: [3], scene: "mar",         layout: "centro" },
  { quote: ["O senhor é apenas humano, mestre Jinshi. Não é um imortal das lendas, capaz de salvar todo mundo."], by: "Maomao, Diários de uma Apotecária", scene: "apotecaria",
    img: "img/apotecaria-banner.jpg", pos: "50% 50%", avatar: "img/maomao.jpg" },
  { quote: ["— Você era o meu novo sonho.", "— E você era o meu."], by: "Flynn e Rapunzel, Enrolados", scene: "lanternas" },
  { quote: ["O amor e a imaginação podem mudar o mundo."], by: "Barbie como Rapunzel", scene: "barbie",
    img: "img/barbie/02-rapunzel.jpg", alta: true, pos: "50% 30%" },
  { sentences: [4], part: 0, scene: "jardim",      layout: "centro" },
  { sentences: [4], part: 1, scene: "misterio",    layout: "livro" },
  { quote: ["Frieren levará nossas memórias para o futuro."], by: "Himmel, Frieren e a Jornada para o Além", scene: "constelacao",
    img: "img/frieren-capa.jpg", pos: "50% 42%", avatar: "img/himmel.jpg" },
  { sentences: [4], part: 2, scene: "mar",         layout: "centro" },
  { quote: ["Há uma diferença que só você pode fazer."], by: "Barbie em As 12 Princesas Bailarinas", scene: "barbie",
    img: "img/barbie/09-12-princesas.jpg", alta: true, pos: "50% 30%" },
  { quote: ["Há pessoas pelas quais vale a pena derreter."], by: "Olaf, Frozen", scene: "neve" },
  { sentences: [4], part: 3, scene: "lanternas",   layout: "centro", surprise: true }
];
/* img = ilustração colada no alto da página; pos = ponto de corte; avatar = medalhão ao lado do nome. */
/* Páginas com "quote" são citações de personagens (não fazem parte da carta).
   Para tirar uma, apague a linha. Cenas extras: hogwarts | lanternas | neve | misterio | barbie */

/* Tempos em milissegundos. */
const ANIMATIONS = {
  flip: 1050,
  cover: 1400,
  close: 620,
  ease: "cubic-bezier(.6,0,.3,1)",
  autoplay: 3800
};
