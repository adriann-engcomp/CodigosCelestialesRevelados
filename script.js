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

document.querySelectorAll(".video").forEach((caixa) => {
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

/* roda uma vez ao abrir a página */
aoRolar();
