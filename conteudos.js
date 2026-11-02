/* =========================================================
   CÓDIGOS CELESTIAIS REVELADOS — lista dos áudios, vídeos
   e temas e resumos.

   É SÓ AQUI que se escreve o título e as descrições. O site
   monta sozinho os cartões, 12 por página, em 3 páginas.

   Cada item tem sempre os mesmos campos:

       titulo     o nome que aparece em cima do cartão.
       resumo     a descrição pequena, de 2 ou 3 frases.
       descricao  a descrição maior, que só aparece quando a
                  pessoa aperta o botão. Se ficar vazia (""),
                  o botão não aparece.

   e mais um campo, diferente em cada seção:

       arquivo    (áudios) nome do arquivo gravado dentro da
                  pasta "audios". Vazio = "áudio ainda não
                  enviado".
       link       (vídeos) o endereço do vídeo no YouTube.
                  Vale o link inteiro ou só o código dele.
       texto      (temas e resumos) nome do arquivo PDF dentro
                  da pasta "livros". Vazio = espaço reservado.
       imagem     (temas e resumos) desenho da "capa" do texto,
                  dentro da pasta "imagens".

   Para escrever aspas dentro de um texto, use aspas curvas
   (“ ”). As aspas retas (") fechariam a linha antes da hora.
   ========================================================= */


/* ---------- 1. Áudios gravados (36 espaços) ---------- */

const AUDIOS = [
    {
        titulo: "Áudio 1",
        resumo: "",
        descricao: "",
        arquivo: ""   // exemplo, quando o arquivo chegar: "audios/audio-01.mp3"
    },
    {
        titulo: "Áudio 2",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 3",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 4",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 5",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 6",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 7",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 8",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 9",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 10",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 11",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 12",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 13",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 14",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 15",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 16",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 17",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 18",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 19",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 20",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 21",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 22",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 23",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 24",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 25",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 26",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 27",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 28",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 29",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 30",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 31",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 32",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 33",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 34",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 35",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
    {
        titulo: "Áudio 36",
        resumo: "",
        descricao: "",
        arquivo: ""
    },
];


/* ---------- 2. Vídeos (36 espaços) ---------- */

const VIDEOS = [
    {
        titulo: "Vídeo 1",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 2",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 3",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 4",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 5",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 6",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 7",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 8",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 9",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 10",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 11",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 12",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 13",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 14",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 15",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 16",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 17",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 18",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 19",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 20",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 21",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 22",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 23",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 24",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 25",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 26",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 27",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 28",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 29",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 30",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 31",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 32",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 33",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 34",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 35",
        resumo: "",
        descricao: "",
        link: ""
    },
    {
        titulo: "Vídeo 36",
        resumo: "",
        descricao: "",
        link: ""
    },
];


/* ---------- 3. Temas e resumos (36 espaços) ---------- */

const TEMAS = [
    {
        titulo: "Texto 1",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 2",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 3",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 4",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 5",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 6",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 7",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 8",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 9",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 10",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 11",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 12",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 13",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 14",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 15",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 16",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 17",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 18",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 19",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 20",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 21",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 22",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 23",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 24",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 25",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 26",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 27",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 28",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 29",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 30",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 31",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 32",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 33",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 34",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 35",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
    {
        titulo: "Texto 36",
        resumo: "",
        descricao: "",
        texto: "",
        imagem: ""
    },
];


/* ---------- 4. Montagem dos cartões ----------

   Daqui para baixo é o maquinário que transforma as três listas
   de cima em cartões na tela, 12 por página. Não precisa mexer. */

const POR_PAGINA = 12;

/* Cria um elemento já com a classe e o texto certos. */
function criar(etiqueta, classe, texto) {
    const el = document.createElement(etiqueta);
    if (classe) el.className = classe;
    if (texto) el.textContent = texto;
    return el;
}

/* Elemento 1 e 2 de todo cartão: o título e a descrição pequena. */
function tituloEResumo(cartao, item) {
    cartao.appendChild(criar("h3", "item-titulo", item.titulo));

    if (item.resumo) {
        cartao.appendChild(criar("p", "item-resumo", item.resumo));
    }
}

/* Elemento 3: o botão que abre e fecha a descrição maior.
   Sem descrição maior escrita, o botão nem aparece. */
function botaoDescricao(cartao, item) {
    if (!item.descricao) return;

    const botao = criar("button", "item-mais", "Descrição completa");
    const detalhe = criar("div", "item-detalhe");

    detalhe.appendChild(criar("p", "", item.descricao));
    detalhe.hidden = true;

    botao.addEventListener("click", () => {
        detalhe.hidden = !detalhe.hidden;
        botao.textContent = detalhe.hidden ? "Descrição completa" : "Fechar descrição";
    });

    cartao.appendChild(botao);
    cartao.appendChild(detalhe);
}

/* Os três botões de um texto que já tem PDF na pasta "livros". */
function acoesDoTexto(cartao, caminho) {
    const acoes = criar("div", "item-acoes");

    const baixar = criar("a", "botao botao-principal", "Baixar PDF");
    baixar.href = caminho;
    baixar.setAttribute("download", "");

    const ler = criar("button", "botao botao-principal abrir-pdf", "Ler aqui");
    ler.dataset.pdf = caminho;

    const ouvir = criar("button", "botao botao-principal escutar-audio", "Escutar áudio");
    ouvir.dataset.pdf = caminho;
    ouvir.dataset.idioma = "pt-BR";

    acoes.appendChild(baixar);
    acoes.appendChild(ler);
    acoes.appendChild(ouvir);
    cartao.appendChild(acoes);
}

function cartaoDeAudio(item) {
    const cartao = criar("article", "item item-audio");

    tituloEResumo(cartao, item);

    if (item.arquivo) {
        const tocador = document.createElement("audio");
        tocador.className = "audio-tocador";
        tocador.controls = true;
        tocador.preload = "none";
        tocador.src = item.arquivo;
        cartao.appendChild(tocador);

        const baixar = criar("a", "audio-baixar", "Baixar áudio");
        baixar.href = item.arquivo;
        baixar.setAttribute("download", "");
        cartao.appendChild(baixar);
    } else {
        cartao.classList.add("sem-arquivo");
    }

    botaoDescricao(cartao, item);
    return cartao;
}

function cartaoDeVideo(item) {
    const cartao = criar("article", "item item-video");

    /* A caixa do vídeo é a mesma de antes: o script.js procura por
       ".video" e cuida da miniatura e do clique para reproduzir. */
    const caixa = criar("div", "video");
    caixa.dataset.video = item.link || "";

    const play = criar("button", "video-play", "▶");
    play.setAttribute("aria-label", "Reproduzir vídeo");

    caixa.appendChild(play);
    caixa.appendChild(criar("p", "video-titulo", item.titulo));
    cartao.appendChild(caixa);

    tituloEResumo(cartao, item);
    botaoDescricao(cartao, item);
    return cartao;
}

function cartaoDeTema(item) {
    const cartao = criar("article", "item item-tema");

    /* O espaço do desenho tem o formato de uma capa de livro. */
    const capa = criar("div", "tema-capa");

    if (item.imagem) {
        const img = document.createElement("img");
        img.src = item.imagem;
        img.alt = "Capa de " + item.titulo;
        img.loading = "lazy";
        capa.appendChild(img);
    }

    cartao.appendChild(capa);

    tituloEResumo(cartao, item);
    botaoDescricao(cartao, item);

    if (item.texto) {
        acoesDoTexto(cartao, item.texto);
    } else {
        cartao.classList.add("sem-arquivo");
    }

    return cartao;
}

/* Reparte a lista em páginas de 12 e desenha os botões 1, 2, 3. */
function montarSecao(lista, idPaginas, idPaginacao, fazerCartao) {
    const paginas = document.getElementById(idPaginas);
    const paginacao = document.getElementById(idPaginacao);
    if (!paginas || !paginacao) return;

    const quantasPaginas = Math.ceil(lista.length / POR_PAGINA);
    const grades = [];
    const botoes = [];

    function mostrar(qual) {
        grades.forEach((grade, i) => { grade.hidden = i !== qual; });
        botoes.forEach((botao, i) => botao.classList.toggle("ativa", i === qual));
    }

    for (let p = 0; p < quantasPaginas; p++) {
        const grade = criar("div", "grade-itens");

        lista.slice(p * POR_PAGINA, (p + 1) * POR_PAGINA)
             .forEach((item) => grade.appendChild(fazerCartao(item)));

        paginas.appendChild(grade);
        grades.push(grade);

        const botao = criar("button", "paginacao-botao", "Página " + (p + 1));
        botao.addEventListener("click", () => mostrar(p));
        paginacao.appendChild(botao);
        botoes.push(botao);
    }

    mostrar(0);
}

montarSecao(AUDIOS, "paginasAudios", "paginacaoAudios", cartaoDeAudio);
montarSecao(VIDEOS, "paginasVideos", "paginacaoVideos", cartaoDeVideo);
montarSecao(TEMAS, "paginasTemas", "paginacaoTemas", cartaoDeTema);
