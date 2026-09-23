/* =========================================================
   CÓDIGOS CELESTIAIS REVELADOS — comportamentos da página
   ========================================================= */

/* ---------- 1. Menu do celular (abre e fecha) ---------- */

const botaoMenu = document.getElementById("botaoMenu");
const menu = document.getElementById("menu");

botaoMenu.addEventListener("click", () => {
    const aberto = menu.classList.toggle("aberto");
    botaoMenu.classList.toggle("aberto", aberto);
    botaoMenu.setAttribute("aria-expanded", aberto);
});

// ao clicar em um link do menu, fecha o menu
menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        menu.classList.remove("aberto");
        botaoMenu.classList.remove("aberto");
        botaoMenu.setAttribute("aria-expanded", "false");
    });
});

/* ---------- 2. Cabeçalho muda de cor ao rolar ---------- */

const cabecalho = document.querySelector(".cabecalho");
const voltarTopo = document.getElementById("voltarTopo");

function aoRolar() {
    const y = window.scrollY;
    cabecalho.classList.toggle("rolou", y > 40);
    voltarTopo.classList.toggle("visivel", y > 500);
    marcarLinkAtivo();
}

window.addEventListener("scroll", aoRolar);

voltarTopo.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ---------- 3. Destaca no menu a seção que está na tela ---------- */

const secoes = document.querySelectorAll("section[id]");
const linksMenu = menu.querySelectorAll("a");

function marcarLinkAtivo() {
    let atual = "";

    secoes.forEach((secao) => {
        if (window.scrollY >= secao.offsetTop - 140) {
            atual = secao.id;
        }
    });

    linksMenu.forEach((link) => {
        link.classList.toggle("ativo", link.getAttribute("href") === "#" + atual);
    });
}

/* ---------- 4. Ampliar as fotos da galeria ---------- */

const lightbox = document.getElementById("lightbox");
const lightboxImagem = document.getElementById("lightboxImagem");

document.querySelectorAll(".foto").forEach((figura) => {
    figura.addEventListener("click", () => {
        // não abre se a imagem ainda não foi colocada na pasta
        if (figura.classList.contains("sem-imagem")) return;

        const img = figura.querySelector("img");
        lightboxImagem.src = img.src;
        lightboxImagem.alt = img.alt;
        lightbox.classList.add("aberto");
        lightbox.setAttribute("aria-hidden", "false");
    });
});

function fecharLightbox() {
    lightbox.classList.remove("aberto");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImagem.src = "";
}

document.getElementById("lightboxFechar").addEventListener("click", fecharLightbox);

lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) fecharLightbox();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") fecharLightbox();
});

/* ---------- 5. Vídeos do YouTube (só carregam ao clicar) ----------

   No index.html, o data-video aceita tanto o código do vídeo quanto o
   link inteiro, em qualquer um destes formatos:

       20jwGpTQce4
       https://youtu.be/20jwGpTQce4
       https://www.youtube.com/watch?v=20jwGpTQce4
       https://www.youtube.com/embed/20jwGpTQce4
       https://www.youtube.com/shorts/20jwGpTQce4                        */

function extrairIdDoYoutube(valor) {
    if (!valor) return "";

    valor = valor.trim();

    // já é o código puro: 11 caracteres, sem barra nem ponto
    if (/^[\w-]{11}$/.test(valor)) return valor;

    // senão, procura o código dentro do link
    const achou = valor.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/);
    return achou ? achou[1] : "";
}

/* Coloca a miniatura do vídeo como fundo da caixa, buscando a imagem
   direto do YouTube. Só a foto é carregada agora — o vídeo em si continua
   entrando apenas no clique, para a página não ficar pesada. */

function mostrarMiniatura(caixa, id) {
    const endereco = (nome) => "https://img.youtube.com/vi/" + id + "/" + nome + ".jpg";

    const capa = document.createElement("img");
    capa.className = "video-capa";
    capa.alt = "";

    const usarPadrao = () => {
        if (capa.dataset.trocou) return false;
        capa.dataset.trocou = "1";
        capa.src = endereco("hqdefault");
        return true;
    };

    capa.addEventListener("load", () => {
        /* Quando o vídeo não tem miniatura em alta, o YouTube não dá erro:
           devolve uma imagem cinza de 120x90 como se estivesse tudo certo.
           Por isso a troca é decidida pelo tamanho, e não pelo erro. */
        if (capa.naturalWidth <= 120) usarPadrao();
    });

    capa.addEventListener("error", () => {
        if (!usarPadrao()) {
            capa.remove();
            caixa.classList.remove("com-capa");
        }
    });

    capa.src = endereco("maxresdefault");

    caixa.classList.add("com-capa");
    caixa.insertBefore(capa, caixa.firstChild);
}

document.querySelectorAll(".video").forEach((caixa) => {
    const idDaCaixa = extrairIdDoYoutube(caixa.dataset.video);
    if (idDaCaixa) mostrarMiniatura(caixa, idDaCaixa);

    caixa.querySelector(".video-play").addEventListener("click", () => {
        const id = extrairIdDoYoutube(caixa.dataset.video);

        if (!id) {
            alert("Este vídeo ainda não foi configurado.\n\nAbra o index.html e coloque no data-video o link do vídeo do YouTube (ou só o código dele).");
            return;
        }

        const iframe = document.createElement("iframe");
        iframe.src = "https://www.youtube.com/embed/" + id + "?autoplay=1";
        iframe.title = caixa.querySelector(".video-titulo").textContent;
        iframe.allow = "accelerometer; autoplay; encrypted-media; picture-in-picture";
        iframe.allowFullscreen = true;

        caixa.innerHTML = "";
        caixa.appendChild(iframe);
    });
});

/* ---------- 6. Imagens que ainda não existem na pasta ----------
   Enquanto o arquivo .jpg não for colocado em "imagens/", o site
   mostra um fundo decorativo no lugar, em vez do ícone de erro. */

function tratarImagemQuebrada(img) {
    if (img.closest(".foto")) {
        img.closest(".foto").classList.add("sem-imagem");
    } else if (img.closest(".livro-capa")) {
        img.classList.add("sem-imagem");
    }
}

document.querySelectorAll(".foto img, .livro-capa img").forEach((img) => {
    img.addEventListener("error", () => tratarImagemQuebrada(img));

    // caso o erro tenha acontecido antes deste script rodar
    if (img.complete && img.naturalWidth === 0) {
        tratarImagemQuebrada(img);
    }
});

/* ---------- 7. Elementos aparecem suavemente ao rolar ---------- */

const alvos = document.querySelectorAll(
    ".quadrado, .foto, .video, .livro, .audio-item, .link-item, .contato-item, .texto-duas-colunas p"
);

alvos.forEach((el) => el.classList.add("aparecer"));

const observador = new IntersectionObserver(
    (entradas) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("visivel");
                observador.unobserve(entrada.target);
            }
        });
    },
    { threshold: 0.12 }
);

alvos.forEach((el) => observador.observe(el));

/* ---------- 8. Leitor de PDF dos livros ----------

   Usa o PDF.js (Mozilla) para desenhar cada página num <canvas>.
   Assim a leitura funciona igual em todo navegador, inclusive no
   celular — o visualizador interno do navegador não é usado. */

const leitor = document.getElementById("leitorPdf");

if (leitor && window.pdfjsLib) {

    pdfjsLib.GlobalWorkerOptions.workerSrc = "js/pdfjs/pdf.worker.min.js";

    const palco = document.getElementById("leitorPalco");
    const rotuloPagina = document.getElementById("leitorPagina");
    const botaoAnterior = document.getElementById("leitorAnterior");
    const botaoProxima = document.getElementById("leitorProxima");
    const barraTitulo = leitor.querySelector(".leitor-titulo");
    const linkNovaAba = leitor.querySelector(".leitor-nova-aba");

    let documento = null;
    let folhas = [];            // uma entrada por página do livro
    let paginaAtual = 1;
    let remontando;

    /* Desenha uma página só quando ela chega perto da área visível.
       Sem isto, abrir um livro de 91 páginas travaria o navegador. */
    const vigia = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (!entrada.isIntersecting) return;
            const folha = folhas[Number(entrada.target.dataset.indice)];
            if (folha) agendarDesenho(folha);
        });
    }, { root: palco, rootMargin: "400px 0px" });

    function limparAviso() {
        const antigo = leitor.querySelector(".leitor-aviso");
        if (antigo) antigo.remove();
    }

    function mostrarAviso(texto) {
        limparAviso();
        const aviso = document.createElement("p");
        aviso.className = "leitor-aviso";
        aviso.textContent = texto;
        palco.appendChild(aviso);
    }

    function esvaziarPalco() {
        folhas.forEach((f) => vigia.unobserve(f.canvas));
        folhas = [];
        palco.innerHTML = "";
    }

    function fecharLeitor() {
        leitor.hidden = true;
        leitor.dataset.aberto = "";
        document.body.classList.remove("leitor-aberto");
        esvaziarPalco();
        if (documento) {
            documento.destroy();
            documento = null;
        }
    }

    /* Desenha uma folha por vez. Sem isto, um livro grande dispararia
       dezenas de desenhos ao mesmo tempo e a página engasgaria. */
    let fila = Promise.resolve();

    function agendarDesenho(folha) {
        if (folha.desenhada || folha.naFila) return;
        folha.naFila = true;
        fila = fila
            .then(() => desenharFolha(folha))
            .then(() => { folha.naFila = false; });
    }

    /* Só vale desenhar o que está perto da área de leitura. A folha que
       não passar aqui continua marcada como pendente e será desenhada
       quando a rolagem chegar nela. */
    function estaPerto(folha) {
        const f = folha.caixa.getBoundingClientRect();
        const p = palco.getBoundingClientRect();
        return f.bottom > p.top - 600 && f.top < p.bottom + 600;
    }

    function desenharVisiveis() {
        folhas.forEach((folha) => {
            if (!folha.desenhada && estaPerto(folha)) agendarDesenho(folha);
        });
    }

    async function desenharFolha(folha) {
        if (folha.desenhada || !estaPerto(folha)) return;
        folha.desenhada = true;   // marca antes, para não desenhar duas vezes

        try {
            // desenha na resolução real da tela, para não sair borrado
            const nitidez = window.devicePixelRatio || 1;
            const vista = folha.pagina.getViewport({ scale: folha.escala * nitidez });

            folha.canvas.width = vista.width;
            folha.canvas.height = vista.height;

            const tarefa = folha.pagina.render({
                canvasContext: folha.canvas.getContext("2d"),
                viewport: vista
            });

            /* Rede de segurança: o PDF.js pausa o desenho quando a aba está
               em segundo plano, então só contamos o tempo com a aba à vista. */
            await Promise.race([
                tarefa.promise,
                new Promise((_, falhar) => {
                    setTimeout(() => {
                        if (!document.hidden) falhar(new Error("demorou demais"));
                    }, 20000);
                })
            ]);
        } catch (e) {
            folha.desenhada = false;
            folha.caixa.classList.add("folha-falhou");
        }
    }

    /* Cria uma folha em branco para cada página, já com o tamanho certo,
       para a barra de rolagem nascer do tamanho do livro inteiro. */
    async function montarFolhas() {
        esvaziarPalco();

        const disponivel = palco.clientWidth - 32;

        for (let numero = 1; numero <= documento.numPages; numero++) {
            const pagina = await documento.getPage(numero);
            const original = pagina.getViewport({ scale: 1 });
            const escala = Math.min(disponivel / original.width, 2);
            const vista = pagina.getViewport({ scale: escala });

            const caixa = document.createElement("div");
            caixa.className = "leitor-folha-caixa";

            const canvas = document.createElement("canvas");
            canvas.className = "leitor-folha";
            canvas.dataset.indice = numero - 1;
            canvas.style.width = vista.width + "px";
            canvas.style.height = vista.height + "px";

            caixa.appendChild(canvas);
            palco.appendChild(caixa);

            folhas.push({ pagina, canvas, caixa, escala, desenhada: false });
            vigia.observe(canvas);
        }

        atualizarContador();
        desenharVisiveis();
    }

    /* Descobre qual página está ocupando o topo da área de leitura. */
    function atualizarContador() {
        if (!folhas.length) return;

        const topo = palco.getBoundingClientRect().top;
        let atual = 1;

        for (let i = 0; i < folhas.length; i++) {
            if (folhas[i].caixa.getBoundingClientRect().top - topo <= 80) {
                atual = i + 1;
            }
        }

        paginaAtual = atual;
        rotuloPagina.textContent = atual + " / " + folhas.length;
        botaoAnterior.disabled = atual <= 1;
        botaoProxima.disabled = atual >= folhas.length;
    }

    function irParaPagina(numero) {
        const folha = folhas[numero - 1];
        if (!folha) return;
        palco.scrollTo({ top: folha.caixa.offsetTop - 8, behavior: "smooth" });
    }

    async function abrirLeitor(caminho, titulo) {
        // clicou de novo no mesmo livro: fecha
        if (leitor.dataset.aberto === caminho) {
            fecharLeitor();
            return;
        }

        if (documento) {
            documento.destroy();
            documento = null;
        }

        esvaziarPalco();
        limparAviso();
        barraTitulo.textContent = titulo;
        linkNovaAba.href = caminho;
        rotuloPagina.textContent = "abrindo…";
        botaoAnterior.disabled = true;
        botaoProxima.disabled = true;
        leitor.hidden = false;
        leitor.dataset.aberto = caminho;
        document.body.classList.add("leitor-aberto");

        try {
            documento = await pdfjsLib.getDocument(caminho).promise;
            await montarFolhas();
        } catch (e) {
            documento = null;
            rotuloPagina.textContent = "—";
            mostrarAviso("Não foi possível abrir " + caminho + ". Verifique se o arquivo está na pasta.");
        }
    }

    let esperandoDesenho;
    palco.addEventListener("scroll", () => {
        atualizarContador();
        clearTimeout(esperandoDesenho);
        esperandoDesenho = setTimeout(desenharVisiveis, 120);
    });
    botaoAnterior.addEventListener("click", () => irParaPagina(paginaAtual - 1));
    botaoProxima.addEventListener("click", () => irParaPagina(paginaAtual + 1));
    leitor.querySelector(".leitor-fechar").addEventListener("click", fecharLeitor);

    // setas do teclado pulam de página; Esc fecha o leitor
    document.addEventListener("keydown", (e) => {
        if (leitor.hidden) return;
        if (e.key === "ArrowLeft") irParaPagina(paginaAtual - 1);
        if (e.key === "ArrowRight") irParaPagina(paginaAtual + 1);
        if (e.key === "Escape") fecharLeitor();
    });

    // ao mudar a largura (ex.: girar o celular), remonta na nova escala
    window.addEventListener("resize", () => {
        if (leitor.hidden || !documento) return;
        clearTimeout(remontando);
        remontando = setTimeout(() => {
            const guardada = paginaAtual;
            montarFolhas().then(() => irParaPagina(guardada));
        }, 300);
    });

    document.querySelectorAll(".abrir-pdf").forEach((botao) => {
        botao.addEventListener("click", () => {
            const livro = botao.closest(".livro");
            const titulo = livro ? livro.querySelector("h3").textContent : "Documento";
            abrirLeitor(botao.dataset.pdf, titulo);
        });
    });
}

/* ---------- 9. Áudios gravados que ainda não estão na pasta ----------
   Enquanto o arquivo não for enviado para a pasta "audios", o cartão
   avisa em português em vez de mostrar um tocador quebrado. */

document.querySelectorAll(".audio-item .audio-tocador").forEach((tocador) => {
    tocador.addEventListener("error", () => {
        tocador.closest(".audio-item").classList.add("sem-arquivo");
    });
});

/* ---------- 10. "Escutar áudio": leitura automática do livro ----------

   É o segundo tipo de áudio: em vez de um arquivo gravado, o próprio
   navegador lê o livro em voz alta. O texto é retirado do PDF pelo
   PDF.js, uma página por vez, e falado pela voz do aparelho.          */

const barraAudio = document.getElementById("barraAudio");

if (barraAudio && window.speechSynthesis) {

    const barraTituloAudio = document.getElementById("barraAudioTitulo");
    const barraEstado = document.getElementById("barraAudioEstado");
    const botaoPausar = document.getElementById("barraAudioPausar");
    const botaoParar = document.getElementById("barraAudioParar");

    const voz = window.speechSynthesis;

    let sessao = 0;          // cresce a cada leitura, para ignorar sobras da anterior
    let docVoz = null;       // PDF aberto para a leitura
    let botaoAtual = null;   // botão "Escutar áudio" que está lendo agora
    let paginaVoz = 0;       // última página cujo texto já foi pego
    let pedacos = [];        // trechos curtos da página atual
    let indice = 0;
    let idioma = "pt-BR";
    let errosSeguidos = 0;   // para não ficar tentando falar sem conseguir

    /* A voz do navegador engasga com textos longos, por isso o texto é
       falado em trechos curtos, cortados no fim das frases. */
    function dividirEmTrechos(texto) {
        const frases = texto.replace(/\s+/g, " ").trim().split(/([.!?;:])\s+/);
        const lista = [];
        let atual = "";

        frases.forEach((parte) => {
            if ((atual + " " + parte).trim().length > 220) {
                if (atual.trim()) lista.push(atual.trim());
                atual = parte;
            } else {
                atual += " " + parte;
            }
        });

        if (atual.trim()) lista.push(atual.trim());
        return lista.filter((t) => /[A-Za-zÀ-ÿ0-9]/.test(t));
    }

    function escolherVoz() {
        const todas = voz.getVoices() || [];
        const prefixo = idioma.slice(0, 2).toLowerCase();
        return todas.find((v) => v.lang && v.lang.toLowerCase().indexOf(prefixo) === 0) || null;
    }

    function mostrarEstado(texto) {
        barraEstado.textContent = texto;
    }

    function pararLeitura() {
        sessao++;
        voz.cancel();

        if (docVoz) {
            docVoz.destroy();
            docVoz = null;
        }

        if (botaoAtual) {
            botaoAtual.textContent = "Escutar áudio";
            botaoAtual = null;
        }

        pedacos = [];
        indice = 0;
        paginaVoz = 0;
        barraAudio.hidden = true;
        document.body.classList.remove("lendo-em-voz");
        botaoPausar.textContent = "Pausar";
    }

    /* Pega o texto da próxima página que tenha alguma palavra.
       Devolve false quando o livro acabou. */
    async function pegarProximaPagina(minha) {
        while (docVoz && paginaVoz < docVoz.numPages) {
            paginaVoz++;
            mostrarEstado("página " + paginaVoz + " de " + docVoz.numPages);

            const pagina = await docVoz.getPage(paginaVoz);
            const conteudo = await pagina.getTextContent();
            if (minha !== sessao) return false;

            const trechos = dividirEmTrechos(conteudo.items.map((i) => i.str).join(" "));

            if (trechos.length) {
                pedacos = trechos;
                indice = 0;
                return true;
            }
        }
        return false;
    }

    async function falarProximo(minha) {
        if (minha !== sessao) return;

        if (indice >= pedacos.length) {
            const tem = await pegarProximaPagina(minha);
            if (minha !== sessao) return;

            if (!tem) {
                mostrarEstado("leitura terminada");
                const guardada = sessao;
                setTimeout(() => { if (guardada === sessao) pararLeitura(); }, 4000);
                return;
            }
        }

        const fala = new SpeechSynthesisUtterance(pedacos[indice++]);
        fala.lang = idioma;
        const escolhida = escolherVoz();
        if (escolhida) fala.voice = escolhida;

        fala.onend = () => {
            errosSeguidos = 0;
            falarProximo(minha);
        };

        /* Um erro aqui costuma ser o "interrupted" de quem apertou Parar —
           e aí a sessão já mudou e nada mais é falado. Se o erro se repetir,
           é o navegador que não está conseguindo falar: melhor parar. */
        fala.onerror = () => {
            if (minha !== sessao) return;

            errosSeguidos++;
            if (errosSeguidos > 5) {
                pararLeitura();
                alert("Não foi possível ler este livro em voz alta neste navegador.\n\nVocê ainda pode baixar o PDF ou usar a seção de áudios.");
                return;
            }
            falarProximo(minha);
        };

        voz.speak(fala);
    }

    async function iniciarLeitura(botao) {
        if (!window.pdfjsLib) {
            alert("A leitura automática precisa do PDF.js, que não carregou.");
            return;
        }

        pararLeitura();

        const minha = sessao;
        const livro = botao.closest(".livro");
        const titulo = livro ? livro.querySelector("h3").textContent : "Livro";

        botaoAtual = botao;
        botao.textContent = "Parar áudio";
        idioma = botao.dataset.idioma || "pt-BR";
        barraTituloAudio.textContent = titulo;
        mostrarEstado("preparando a leitura…");
        barraAudio.hidden = false;
        document.body.classList.add("lendo-em-voz");
        errosSeguidos = 0;

        /* Fala o título agora, ainda dentro do clique. No celular a voz só
           é liberada se a primeira fala sair junto com o toque do visitante;
           esperar o PDF abrir seria tarde demais. */
        const anuncio = new SpeechSynthesisUtterance(titulo);
        anuncio.lang = idioma;
        voz.speak(anuncio);

        let aberto;
        try {
            aberto = await pdfjsLib.getDocument(botao.dataset.pdf).promise;
        } catch (e) {
            pararLeitura();
            alert("Não foi possível abrir " + botao.dataset.pdf + ".\n\nVerifique se o arquivo está na pasta.");
            return;
        }

        // alguém apertou Parar enquanto o livro abria
        if (minha !== sessao) {
            aberto.destroy();
            return;
        }

        docVoz = aberto;
        paginaVoz = 0;
        pedacos = [];
        indice = 0;
        falarProximo(minha);
    }

    botaoPausar.addEventListener("click", () => {
        if (voz.paused) {
            voz.resume();
            botaoPausar.textContent = "Pausar";
        } else {
            voz.pause();
            botaoPausar.textContent = "Continuar";
        }
    });

    botaoParar.addEventListener("click", pararLeitura);

    // sair da página sem deixar a voz falando sozinha
    window.addEventListener("beforeunload", () => voz.cancel());

    document.querySelectorAll(".escutar-audio").forEach((botao) => {
        botao.addEventListener("click", () => {
            if (botaoAtual === botao) {
                pararLeitura();
            } else {
                iniciarLeitura(botao);
            }
        });
    });

} else {
    // navegador sem leitura em voz alta: o botão avisa em vez de não fazer nada
    document.querySelectorAll(".escutar-audio").forEach((botao) => {
        botao.addEventListener("click", () => {
            alert("Este navegador não sabe ler em voz alta.\n\nVocê ainda pode baixar o PDF ou usar a seção de áudios.");
        });
    });
}

/* roda uma vez ao abrir a página */
aoRolar();
