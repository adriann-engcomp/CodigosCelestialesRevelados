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
    ".cartao, .lista-objetivos li, .foto, .video, .mensagem, .livro, .contato-item, .texto-duas-colunas p"
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
    const tela = document.getElementById("leitorCanvas");
    const rotuloPagina = document.getElementById("leitorPagina");
    const botaoAnterior = document.getElementById("leitorAnterior");
    const botaoProxima = document.getElementById("leitorProxima");
    const barraTitulo = leitor.querySelector(".leitor-titulo");
    const linkNovaAba = leitor.querySelector(".leitor-nova-aba");

    let documento = null;
    let paginaAtual = 1;
    let desenhando = false;

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
        tela.hidden = true;
    }

    function fecharLeitor() {
        leitor.hidden = true;
        leitor.dataset.aberto = "";
        if (documento) {
            documento.destroy();
            documento = null;
        }
    }

    async function desenharPagina(numero) {
        if (!documento || desenhando) return;
        desenhando = true;

        try {
            const pagina = await documento.getPage(numero);

            // ajusta a página à largura disponível, sem passar do dobro
            const disponivel = palco.clientWidth - 32;
            const original = pagina.getViewport({ scale: 1 });
            const escala = Math.min(disponivel / original.width, 2);

            // desenha na resolução da tela para não sair borrado
            const nitidez = window.devicePixelRatio || 1;
            const vista = pagina.getViewport({ scale: escala * nitidez });

            tela.width = vista.width;
            tela.height = vista.height;
            tela.style.width = (vista.width / nitidez) + "px";
            tela.style.height = (vista.height / nitidez) + "px";
            tela.hidden = false;

            const tarefa = pagina.render({
                canvasContext: tela.getContext("2d"),
                viewport: vista
            });

            /* Rede de segurança: se o desenho não terminar, mostra um aviso
               em vez de deixar a área em branco sem explicação. O PDF.js
               pausa o desenho quando a aba está em segundo plano, então só
               contamos o tempo com a aba à vista. */
            await Promise.race([
                tarefa.promise,
                new Promise((_, falhar) => {
                    setTimeout(() => {
                        if (!document.hidden) falhar(new Error("demorou demais"));
                    }, 20000);
                })
            ]);

            paginaAtual = numero;
            rotuloPagina.textContent = numero + " / " + documento.numPages;
            botaoAnterior.disabled = numero <= 1;
            botaoProxima.disabled = numero >= documento.numPages;
        } catch (e) {
            mostrarAviso("Não foi possível desenhar esta página. Use \"Abrir em nova aba\" para ler o arquivo.");
        } finally {
            desenhando = false;
        }
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

        limparAviso();
        barraTitulo.textContent = titulo;
        linkNovaAba.href = caminho;
        rotuloPagina.textContent = "abrindo…";
        botaoAnterior.disabled = true;
        botaoProxima.disabled = true;
        leitor.hidden = false;
        leitor.dataset.aberto = caminho;
        leitor.scrollIntoView({ behavior: "smooth", block: "start" });

        try {
            documento = await pdfjsLib.getDocument(caminho).promise;
            await desenharPagina(1);
        } catch (e) {
            documento = null;
            rotuloPagina.textContent = "—";
            mostrarAviso("Não foi possível abrir " + caminho + ". Verifique se o arquivo está na pasta.");
        }
    }

    botaoAnterior.addEventListener("click", () => desenharPagina(paginaAtual - 1));
    botaoProxima.addEventListener("click", () => desenharPagina(paginaAtual + 1));
    leitor.querySelector(".leitor-fechar").addEventListener("click", fecharLeitor);

    // setas do teclado viram os pés da página
    document.addEventListener("keydown", (e) => {
        if (leitor.hidden) return;
        if (e.key === "ArrowLeft") desenharPagina(paginaAtual - 1);
        if (e.key === "ArrowRight") desenharPagina(paginaAtual + 1);
    });

    // redesenha ao mudar a largura da janela (ex.: girar o celular)
    let esperandoRedesenho;
    window.addEventListener("resize", () => {
        if (leitor.hidden || !documento) return;
        clearTimeout(esperandoRedesenho);
        esperandoRedesenho = setTimeout(() => desenharPagina(paginaAtual), 250);
    });

    document.querySelectorAll(".abrir-pdf").forEach((botao) => {
        botao.addEventListener("click", () => {
            const livro = botao.closest(".livro");
            const titulo = livro ? livro.querySelector("h3").textContent : "Documento";
            abrirLeitor(botao.dataset.pdf, titulo);
        });
    });
}

/* roda uma vez ao abrir a página */
aoRolar();
