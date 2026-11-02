/* =========================================================
   CÓDIGOS CELESTIAIS REVELADOS — conteúdo vindo do painel

   O site desenha primeiro o que está no conteudos.js, que é a
   RESERVA, e logo depois busca no Supabase o que foi escrito
   no painel. Chegando, ele redesenha as três seções.

   Essa ordem é de propósito: se o Supabase estiver fora do ar,
   se o projeto tiver sido pausado ou se a pessoa estiver sem
   internet, o site não fica quebrado nem vazio — fica com a
   reserva. Nada aqui dentro é capaz de derrubar a página.
   ========================================================= */

/* Passa uma linha do banco para o formato que o conteudos.js usa.
   O banco guarda tudo numa coluna "midia"; cada seção chama essa
   coluna de um jeito. */
function converter(linha, reserva) {
    const base = reserva || {};
    return {
        titulo: linha.titulo || base.titulo || "",
        resumo: linha.resumo || "",
        descricao: linha.descricao || "",
        arquivo: linha.midia || "",   // áudios
        link: linha.midia || "",      // vídeos
        texto: linha.midia || "",     // temas e resumos
        imagem: linha.imagem || ""    // temas e resumos
    };
}

/* Mesma coisa, no formato que os livros usam. */
function converterLivro(linha, reserva) {
    const base = reserva || {};
    return {
        titulo: linha.titulo || base.titulo || "",
        traducao: linha.resumo || "",
        pdf: linha.midia || "",
        capa: linha.imagem || ""
    };
}

/* O painel manda. Havendo qualquer linha no banco para aquela seção, a
   lista passa a ser EXATAMENTE o que o painel tem: nem mais, nem menos.

   É por isso que não dá para só trocar item por item pela posição: se
   alguém apagar um espaço no painel, ou acrescentar um 37º, a lista
   precisa encolher ou crescer junto. Sem linha nenhuma no banco (painel
   ainda não ligado), fica a reserva do conteudos.js.                   */
function aplicarNaLista(lista, linhas, como) {
    if (!linhas.length) return;

    const passar = como || converter;

    const novos = linhas
        .slice()
        .sort((a, b) => a.posicao - b.posicao)
        .map((linha) => passar(linha, lista[linha.posicao - 1]));

    lista.length = 0;
    novos.forEach((item) => lista.push(item));
}

/* Apaga o que está na tela e manda o conteudos.js desenhar de novo. */
function redesenhar(lista, idPaginas, idPaginacao, fazerCartao) {
    const paginas = document.getElementById(idPaginas);
    const paginacao = document.getElementById(idPaginacao);
    if (!paginas || !paginacao) return;

    paginas.innerHTML = "";
    paginacao.innerHTML = "";
    montarSecao(lista, idPaginas, idPaginacao, fazerCartao);
}

async function carregarConteudoRemoto() {
    // painel ainda não ligado: fica a reserva, e está tudo bem
    if (typeof supabaseConfigurado !== "function" || !supabaseConfigurado()) return;

    const endereco =
        SUPABASE.ENDERECO.replace(/\/+$/, "") +
        "/rest/v1/conteudos" +
        "?select=tipo,posicao,titulo,resumo,descricao,midia,imagem" +
        "&order=posicao";

    let linhas;
    try {
        const resposta = await fetch(endereco, { headers: { apikey: SUPABASE.CHAVE } });
        if (!resposta.ok) return;
        linhas = await resposta.json();
    } catch (e) {
        // sem internet, projeto pausado, qualquer coisa: fica a reserva
        return;
    }

    if (!Array.isArray(linhas) || linhas.length === 0) return;

    aplicarNaLista(AUDIOS, linhas.filter((l) => l.tipo === "audio"));
    aplicarNaLista(VIDEOS, linhas.filter((l) => l.tipo === "video"));
    aplicarNaLista(TEMAS, linhas.filter((l) => l.tipo === "tema"));
    aplicarNaLista(LIVROS_PT, linhas.filter((l) => l.tipo === "livro-pt"), converterLivro);
    aplicarNaLista(LIVROS_ES, linhas.filter((l) => l.tipo === "livro-es"), converterLivro);

    redesenhar(AUDIOS, "paginasAudios", "paginacaoAudios", cartaoDeAudio);
    redesenhar(VIDEOS, "paginasVideos", "paginacaoVideos", cartaoDeVideo);
    redesenhar(TEMAS, "paginasTemas", "paginacaoTemas", cartaoDeTema);

    montarLivros(LIVROS_PT, "gradeLivrosPt", "pt-BR");
    montarLivros(LIVROS_ES, "gradeLivrosEs", "es-ES");

    /* Os cartões de vídeo são novos, então precisam ganhar de novo o
       clique que abre o player do YouTube. O mesmo vale para o leitor
       de PDF e a leitura em voz alta dos textos. */
    if (typeof ligarVideos === "function") ligarVideos();
    if (typeof ligarBotoesDeLivro === "function") ligarBotoesDeLivro();
}

carregarConteudoRemoto();
