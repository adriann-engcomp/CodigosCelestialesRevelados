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

/* Troca o conteúdo de uma lista pelas linhas do banco, sem mudar o
   tamanho dela: a posição 7 do banco vira o sétimo item da lista. */
function aplicarNaLista(lista, linhas, como) {
    const passar = como || converter;

    linhas.forEach((linha) => {
        const i = linha.posicao - 1;

        if (i >= 0 && i < lista.length) {
            lista[i] = passar(linha, lista[i]);
        } else if (i === lista.length) {
            /* o painel ganhou um espaço a mais que a reserva não tinha:
               acrescenta no fim, em vez de ignorar */
            lista.push(passar(linha, null));
        }
    });
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
