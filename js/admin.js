/* =========================================================
   PAINEL DE CONTEÚDO — comportamento da página admin.html

   O caminho é sempre o mesmo:

     1. a pessoa entra com a conta do Google
     2. o painel confere se o e-mail dela está na tabela admins
     3. se estiver, mostra os espaços daquela seção para editar
     4. cada "Salvar" grava uma linha na tabela conteudos
     5. cada arquivo enviado vai para o espaço "arquivos" e o
        endereço dele fica guardado no campo certo

   Quem decide o que pode ou não pode são as regras do banco,
   criadas pelo supabase/esquema.sql. Este arquivo só mostra a
   tela: mesmo que alguém mexa no código daqui, não consegue
   salvar nada sem estar na tabela admins.
   ========================================================= */

/* ---------- 1. Peças da tela ---------- */

const telaEntrar = document.getElementById("telaEntrar");
const telaSemPermissao = document.getElementById("telaSemPermissao");
const telaEditor = document.getElementById("telaEditor");
const botaoEntrar = document.getElementById("botaoEntrar");
const botaoSair = document.getElementById("botaoSair");
const botaoSairOutra = document.getElementById("botaoSairOutra");
const avisoEntrar = document.getElementById("avisoEntrar");
const formEmail = document.getElementById("formEmail");
const campoEmail = document.getElementById("campoEmail");
const botaoEmail = document.getElementById("botaoEmail");
const adminEmail = document.getElementById("adminEmail");
const estado = document.getElementById("estado");
const lista = document.getElementById("lista");
const abas = document.getElementById("abas");

/* Como cada seção chama as suas coisas. Fica tudo num lugar só para
   os rótulos saírem em português certo, e não "audio 1", "tema 1". */
const SECOES = {
    audio: {
        rotulo: "Áudio",
        tituloMidia: "O áudio",
        ajudaMidia: "Arquivo grande (livro inteiro) fica melhor no YouTube ou no Internet Archive: envie lá e cole o endereço aqui.",
        oQue: "o áudio",
        aceita: "audio/*",
        temImagem: false
    },
    video: {
        rotulo: "Vídeo",
        tituloMidia: "O vídeo",
        ajudaMidia: "O vídeo fica no YouTube; aqui vai só o endereço dele.",
        aceita: null,
        temImagem: false
    },
    tema: {
        rotulo: "Texto",
        tituloMidia: "O arquivo do texto",
        ajudaMidia: "Em PDF. É o que a pessoa vai baixar, ler na tela e escutar.",
        oQue: "o PDF",
        aceita: ".pdf",
        temImagem: true
    },
    "livro-pt": {
        rotulo: "Livro",
        tituloMidia: "O arquivo do livro",
        ajudaMidia: "Em PDF. Enquanto estiver vazio, o livro aparece no site com a faixa “arquivo em breve”.",
        oQue: "o PDF",
        aceita: ".pdf",
        temImagem: true,
        eLivro: true
    },
    "livro-es": {
        rotulo: "Livro",
        tituloMidia: "O arquivo do livro",
        ajudaMidia: "Em PDF. Enquanto estiver vazio, o livro aparece no site com a faixa “arquivo em breve”.",
        oQue: "o PDF",
        aceita: ".pdf",
        temImagem: true,
        eLivro: true
    }
};

let cliente = null;
let usuario = null;
let tipoAtual = "audio";

/* ---------- 2. Ajudinhas ---------- */

function criar(etiqueta, classe, texto) {
    const el = document.createElement(etiqueta);
    if (classe) el.className = classe;
    if (texto !== undefined && texto !== null) el.textContent = texto;
    return el;
}

function mostrar(qual) {
    telaEntrar.hidden = qual !== "entrar";
    telaSemPermissao.hidden = qual !== "sem-permissao";
    telaEditor.hidden = qual !== "editor";
}

function dizer(texto, erro) {
    estado.textContent = texto;
    estado.classList.toggle("erro", Boolean(erro));
}

/* ---------- 3. Começo ---------- */

async function comecar() {
    if (!supabaseConfigurado()) {
        avisoEntrar.textContent =
            "O painel ainda não foi ligado ao Supabase. Falta preencher o endereço e a " +
            "chave no arquivo js/config.js.";
        botaoEntrar.disabled = true;
        botaoEmail.disabled = true;
        campoEmail.disabled = true;
        return;
    }

    cliente = window.supabase.createClient(SUPABASE.ENDERECO, SUPABASE.CHAVE);

    /* Depois do Google devolver a pessoa para cá, a biblioteca guarda a
       sessão sozinha; aqui só perguntamos se existe uma. */
    const { data } = await cliente.auth.getSession();

    if (data.session) {
        await entrou(data.session.user);
    } else {
        mostrar("entrar");
    }

    cliente.auth.onAuthStateChange((evento) => {
        if (evento === "SIGNED_OUT") {
            usuario = null;
            adminEmail.textContent = "";
            botaoSair.hidden = true;
            mostrar("entrar");
        }
    });
}

async function entrou(quem) {
    usuario = quem;
    adminEmail.textContent = quem.email;
    botaoSair.hidden = false;

    /* A regra do banco só deixa um administrador enxergar a tabela de
       administradores. Então: se a consulta volta vazia, esta conta não
       é administradora. Não dá para burlar mexendo nesta linha, porque
       quem decide é o banco, não o navegador. */
    const { data, error } = await cliente
        .from("admins")
        .select("email")
        .eq("email", quem.email);

    if (error) {
        mostrar("entrar");
        avisoEntrar.textContent =
            "Não consegui falar com o banco: " + error.message +
            " — confira se o supabase/esquema.sql foi rodado.";
        return;
    }

    if (!data || data.length === 0) {
        mostrar("sem-permissao");
        return;
    }

    mostrar("editor");
    await carregar(tipoAtual);
}

/* ---------- 4. Entrar e sair ---------- */

botaoEntrar.addEventListener("click", async () => {
    avisoEntrar.textContent = "Abrindo a tela do Google…";

    const { error } = await cliente.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.href.split("?")[0] }
    });

    if (error) {
        avisoEntrar.textContent = "Não deu para entrar: " + error.message;
    }
});

/* A segunda porta: um link enviado por e-mail. Não passa pelo Google,
   então funciona com Yahoo, Outlook, o que for.

   Entrar aqui NÃO dá permissão nenhuma: quem decide continua sendo a
   tabela admins. Quem não estiver nela entra e vê "Conta sem permissão". */
formEmail.addEventListener("submit", async (e) => {
    e.preventDefault();

    const endereco = campoEmail.value.trim();
    if (!endereco) return;

    botaoEmail.disabled = true;
    avisoEntrar.textContent = "Enviando o link…";

    const { error } = await cliente.auth.signInWithOtp({
        email: endereco,
        options: { emailRedirectTo: window.location.href.split("?")[0] }
    });

    botaoEmail.disabled = false;

    if (error) {
        avisoEntrar.textContent = "Não deu para enviar: " + error.message;
        return;
    }

    avisoEntrar.textContent =
        "Pronto. Mandamos um link para " + endereco + ". Abra o e-mail e clique nele — " +
        "pode levar um minuto, e às vezes cai no spam.";
});

async function sair() {
    await cliente.auth.signOut();
    window.location.reload();
}

botaoSair.addEventListener("click", sair);
botaoSairOutra.addEventListener("click", sair);

/* ---------- 5. As abas ---------- */

abas.addEventListener("click", async (e) => {
    const aba = e.target.closest(".admin-aba");
    if (!aba) return;

    abas.querySelectorAll(".admin-aba").forEach((b) => {
        b.classList.toggle("ativa", b === aba);
    });

    tipoAtual = aba.dataset.tipo;
    await carregar(tipoAtual);
});

/* ---------- 6. Carregar os espaços ---------- */

async function carregar(tipo) {
    dizer("Carregando…");
    lista.innerHTML = "";

    const { data, error } = await cliente
        .from("conteudos")
        .select("*")
        .eq("tipo", tipo)
        .order("posicao");

    if (error) {
        dizer("Não consegui carregar: " + error.message, true);
        return;
    }

    if (!data.length) {
        dizer("Nenhum espaço nesta seção ainda. Falta rodar o supabase/esquema-livros.sql.", true);
        return;
    }

    data.forEach((item) => lista.appendChild(cartao(item)));

    /* A última posição usada. O espaço novo entra logo depois dela. */
    const ultima = data.reduce((maior, i) => Math.max(maior, i.posicao), 0);
    lista.appendChild(botaoAcrescentar(tipo, ultima));

    dizer(data.length + " espaços. Clique em um para escrever.");
}

/* Acrescenta um espaço no fim da seção. Fica no fim da lista, que é
   onde a pessoa procura depois de rolar os que já existem. */
function botaoAcrescentar(tipo, ultima) {
    const secao = SECOES[tipo];
    const caixa = criar("div", "admin-acrescentar");

    const botao = criar("button", "admin-acrescentar-botao",
        "+ Acrescentar " + (secao.eLivro ? "um livro" : "um espaço de " + secao.rotulo.toLowerCase()));
    botao.type = "button";

    const recado = criar("span", "admin-recado");

    botao.addEventListener("click", async () => {
        botao.disabled = true;
        recado.textContent = "Criando…";
        recado.classList.remove("erro");

        const posicao = ultima + 1;

        const { error } = await cliente.from("conteudos").insert({
            tipo: tipo,
            posicao: posicao,
            titulo: secao.rotulo + " " + posicao
        });

        botao.disabled = false;

        if (error) {
            recado.textContent = "Não deu: " + error.message;
            recado.classList.add("erro");
            return;
        }

        recado.textContent = "";
        await carregar(tipo);

        /* abre o espaço novo já aberto, para a pessoa escrever na hora */
        const cartoes = lista.querySelectorAll(".admin-item-topo");
        const ultimo = cartoes[cartoes.length - 1];
        if (ultimo) {
            ultimo.click();
            ultimo.scrollIntoView({ block: "center", behavior: "smooth" });
        }
    });

    caixa.appendChild(botao);
    caixa.appendChild(recado);
    return caixa;
}

/* ---------- 7. As peças do formulário ---------- */

function campo(rotulo, valor, linhas, ajuda) {
    const bloco = document.createElement("label");
    bloco.className = "admin-campo";

    bloco.appendChild(criar("span", "admin-campo-titulo", rotulo));
    if (ajuda) bloco.appendChild(criar("span", "admin-campo-ajuda", ajuda));

    const entrada = document.createElement(linhas > 1 ? "textarea" : "input");
    if (linhas > 1) entrada.rows = linhas;
    entrada.value = valor || "";
    bloco.appendChild(entrada);

    bloco.entrada = entrada;
    return bloco;
}

/* Um passo do formulário: um número, um título e o que vai dentro. */
function passo(numero, titulo, ajuda) {
    const bloco = criar("section", "admin-passo");

    const cabeca = criar("h4", "admin-passo-titulo");
    cabeca.appendChild(criar("span", "admin-passo-num", numero));
    cabeca.appendChild(criar("span", null, titulo));
    bloco.appendChild(cabeca);

    if (ajuda) bloco.appendChild(criar("p", "admin-passo-ajuda", ajuda));

    return bloco;
}

/* Tira o nome do arquivo de um endereço comprido, para a tela mostrar
   "livro-base.pdf" em vez da linha inteira do Supabase. */
function nomeDoArquivo(endereco) {
    if (!endereco) return "";
    if (/youtube|youtu\.be|archive\.org/i.test(endereco)) return endereco;

    const limpo = endereco.split("?")[0].split("/").pop();
    try {
        return decodeURIComponent(limpo) || endereco;
    } catch (e) {
        return limpo || endereco;
    }
}

/* Tira acento, espaço e maiúscula do nome do arquivo. No endereço do
   site, espaço vira %20 e acento vira %C3%B3 — melhor não ter. */
function nomeLimpo(nome) {
    return nome
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9.]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/* ---------- O bloco de um arquivo ----------

   Três partes, de cima para baixo:
     1. a área de arrastar, que diz o que recebe
     2. o que já está guardado: o nome do arquivo e, se for imagem, a
        miniatura, com um botão de tirar
     3. um "ou colar um endereço", fechado, para quem prefere apontar
        para o YouTube ou o Internet Archive em vez de enviar

   O endereço comprido fica guardado num campo escondido: quem olha a
   tela vê o nome do arquivo, não a linha gigante.                     */
function blocoArquivo(item, coluna, aceita, oQue, valorInicial, ehImagem) {
    const bloco = criar("div", "admin-arquivo");

    const guardado = document.createElement("input");
    guardado.type = "hidden";
    guardado.value = valorInicial || "";

    const convite = "ou arraste " + oQue + " para cá";

    const area = criar("div", "admin-envio");

    /* A janela de arquivos já abre filtrada: pedindo PDF, a pessoa só vê
       PDF na pasta dela. É o "accept" do input que faz isso. */
    const escolher = document.createElement("input");
    escolher.type = "file";
    escolher.accept = aceita;
    escolher.hidden = true;

    const botao = criar("button", "admin-envio-botao", "Escolher " + oQue + " no computador");
    botao.type = "button";
    botao.addEventListener("click", (ev) => {
        ev.stopPropagation();   // senão o clique da área dispara de novo
        escolher.click();
    });

    const texto = criar("p", "admin-envio-texto", convite);

    area.appendChild(botao);
    area.appendChild(texto);
    area.appendChild(escolher);

    const situacao = criar("div", "admin-arquivo-estado");

    const detalhes = document.createElement("details");
    detalhes.className = "admin-arquivo-endereco";
    detalhes.appendChild(criar("summary", null, "Ou colar um endereço"));

    const colar = document.createElement("input");
    colar.type = "text";
    colar.value = valorInicial || "";
    colar.placeholder = "https://…";
    detalhes.appendChild(colar);

    function mostrarSituacao() {
        situacao.innerHTML = "";
        const valor = guardado.value.trim();

        if (!valor) {
            situacao.appendChild(criar("span", "admin-arquivo-vazio", "Nenhum arquivo ainda."));
            return;
        }

        if (ehImagem) {
            const mini = document.createElement("img");
            mini.className = "admin-arquivo-mini";
            mini.src = valor;
            mini.alt = "";
            situacao.appendChild(mini);
        }

        situacao.appendChild(criar("span", "admin-arquivo-nome", nomeDoArquivo(valor)));

        const tirar = criar("button", "admin-arquivo-tirar", "Tirar");
        tirar.type = "button";
        tirar.addEventListener("click", () => {
            guardado.value = "";
            colar.value = "";
            texto.textContent = convite;
            area.classList.remove("erro");
            mostrarSituacao();
        });
        situacao.appendChild(tirar);
    }

    colar.addEventListener("input", () => {
        guardado.value = colar.value.trim();
        mostrarSituacao();
    });

    /* O "accept" só filtra a janela de escolher arquivo; quem arrasta
       passa por cima dele. Então a conferência é feita aqui. */
    function tipoErrado(arquivo) {
        if (aceita === ".pdf" && !/\.pdf$/i.test(arquivo.name)) {
            return "Esta área é só para PDF. “" + arquivo.name + "” não é um PDF.";
        }
        if (aceita === "image/*" && !arquivo.type.startsWith("image/")) {
            return "Esta área é só para imagem. “" + arquivo.name + "” não é uma imagem.";
        }
        if (aceita === "audio/*" && !arquivo.type.startsWith("audio/")) {
            return "Esta área é só para áudio. “" + arquivo.name + "” não é um áudio.";
        }
        return "";
    }

    async function enviar(arquivo) {
        if (!arquivo) return;

        const problema = tipoErrado(arquivo);
        if (problema) {
            texto.textContent = problema;
            area.classList.add("erro");
            return;
        }

        area.classList.remove("erro");
        area.classList.add("enviando");
        texto.textContent = "Enviando " + arquivo.name + "…";

        const caminho =
            item.tipo + "/" + coluna + "-" + item.posicao + "-" +
            Date.now() + "-" + nomeLimpo(arquivo.name);

        const { error } = await cliente.storage
            .from("arquivos")
            .upload(caminho, arquivo, { upsert: true });

        area.classList.remove("enviando");

        if (error) {
            texto.textContent = "Não enviou: " + error.message;
            area.classList.add("erro");
            return;
        }

        const { data } = cliente.storage.from("arquivos").getPublicUrl(caminho);
        guardado.value = data.publicUrl;
        colar.value = data.publicUrl;
        texto.textContent = "Enviado. Agora é só apertar Salvar, lá embaixo.";
        mostrarSituacao();
    }

    area.addEventListener("click", () => escolher.click());
    escolher.addEventListener("change", () => enviar(escolher.files[0]));

    ["dragenter", "dragover"].forEach((e) =>
        area.addEventListener(e, (ev) => { ev.preventDefault(); area.classList.add("sobre"); })
    );
    ["dragleave", "drop"].forEach((e) =>
        area.addEventListener(e, (ev) => { ev.preventDefault(); area.classList.remove("sobre"); })
    );
    area.addEventListener("drop", (ev) => enviar(ev.dataTransfer.files[0]));

    bloco.appendChild(area);
    bloco.appendChild(situacao);
    bloco.appendChild(detalhes);
    bloco.appendChild(guardado);

    mostrarSituacao();

    bloco.valor = () => guardado.value.trim();

    /* usado pelos botoes de desfazer e de esvaziar */
    bloco.repor = (novoValor) => {
        guardado.value = novoValor || "";
        colar.value = novoValor || "";
        texto.textContent = convite;
        area.classList.remove("erro");
        mostrarSituacao();
    };

    return bloco;
}

/* ---------- O cartão de um espaço ---------- */

function cartao(item) {
    const secao = SECOES[item.tipo];

    const caixa = criar("article", "admin-item");

    /* a linha que fica sempre visível */
    const topo = criar("button", "admin-item-topo");
    topo.appendChild(criar("span", "admin-item-num", item.posicao));

    const nome = criar("span", "admin-item-nome",
        item.titulo || secao.rotulo + " " + item.posicao);
    topo.appendChild(nome);

    const sinal = criar("span", "admin-item-sinal", item.midia ? "pronto" : "vazio");
    sinal.classList.toggle("vazio", !item.midia);
    topo.appendChild(sinal);

    caixa.appendChild(topo);

    const corpo = criar("div", "admin-item-corpo");
    corpo.hidden = true;

    /* ----- passo 1: o texto ----- */
    const p1 = passo("1", secao.eLivro ? "O livro" : "O que é");

    const fTitulo = campo(
        secao.eLivro ? "Nome do livro (em português)" : "Título",
        item.titulo, 1);

    const fResumo = secao.eLivro
        ? campo("Nome traduzido", item.resumo, 1,
            "Aparece entre parênteses abaixo do nome. Pode ficar vazio.")
        : campo("Descrição curta", item.resumo, 3,
            "2 ou 3 frases. É o que aparece no cartão, no site.");

    const fDescricao = campo("Descrição completa", item.descricao, 5,
        secao.eLivro
            ? "Ainda não aparece no site; fica guardada para depois."
            : "Só aparece quando a pessoa aperta o botão. Pode ficar vazia.");

    p1.appendChild(fTitulo);
    p1.appendChild(fResumo);
    p1.appendChild(fDescricao);
    corpo.appendChild(p1);

    /* ----- passo 2: o arquivo, ou o endereço do vídeo ----- */
    const p2 = passo("2", secao.tituloMidia, secao.ajudaMidia);
    let bMidia = null;
    let fLink = null;

    if (secao.aceita) {
        bMidia = blocoArquivo(item, "midia", secao.aceita, secao.oQue, item.midia, false);
        p2.appendChild(bMidia);
    } else {
        fLink = campo("Endereço do vídeo", item.midia, 1,
            "Cole o endereço inteiro do YouTube, ou só o código dele.");
        p2.appendChild(fLink);
    }
    corpo.appendChild(p2);

    /* ----- passo 3: a capa ----- */
    let bImagem = null;
    if (secao.temImagem) {
        const p3 = passo("3", secao.eLivro ? "A capa do livro" : "O desenho da capa",
            "Aparece no formato de capa de livro, em pé.");
        bImagem = blocoArquivo(item, "imagem", "image/*",
            secao.eLivro ? "a capa" : "o desenho", item.imagem, true);
        p3.appendChild(bImagem);
        corpo.appendChild(p3);
    }

    /* ----- salvar, e as saídas de emergência -----

       São três coisas diferentes, de propósito:

         Desfazer   volta os campos para o que está salvo. Serve para
                    quando a pessoa se enrolou digitando e ainda não
                    salvou. Não mexe no banco.
         Esvaziar   limpa tudo e salva vazio. Serve para quando ela
                    salvou errado: o espaço continua, mas volta a ficar
                    "vazio" no site.
         Apagar     some com o espaço inteiro. Esse não tem volta.      */
    const acoes = criar("div", "admin-item-acoes");
    const salvar = criar("button", "botao botao-principal", "Salvar");
    const recado = criar("span", "admin-recado");

    const desfazer = criar("button", "admin-secundario", "Desfazer");
    desfazer.type = "button";
    desfazer.title = "Volta os campos para o que está salvo";

    const esvaziar = criar("button", "admin-secundario", "Esvaziar");
    esvaziar.type = "button";
    esvaziar.title = "Limpa tudo e salva vazio, mantendo o espaço";

    const apagar = criar("button", "admin-apagar", "Apagar este espaço");
    apagar.type = "button";

    acoes.appendChild(salvar);
    acoes.appendChild(recado);
    acoes.appendChild(desfazer);
    acoes.appendChild(esvaziar);
    acoes.appendChild(apagar);

    /* repoe os campos com um conjunto de valores */
    function repor(valores) {
        fTitulo.entrada.value = valores.titulo || "";
        fResumo.entrada.value = valores.resumo || "";
        fDescricao.entrada.value = valores.descricao || "";

        if (bMidia) bMidia.repor(valores.midia);
        if (fLink) fLink.entrada.value = valores.midia || "";
        if (bImagem) bImagem.repor(valores.imagem);
    }

    desfazer.addEventListener("click", () => {
        repor(item);
        recado.textContent = "Campos voltaram ao que está salvo.";
        recado.classList.remove("erro");
        setTimeout(() => { recado.textContent = ""; }, 3000);
    });

    esvaziar.addEventListener("click", async () => {
        if (!window.confirm(
            "Esvaziar o espaço " + item.posicao + "? " +
            "O espaço continua, mas tudo o que está escrito nele é apagado."
        )) return;

        repor({});
        esvaziar.disabled = true;
        recado.textContent = "Esvaziando…";
        recado.classList.remove("erro");

        const vazio = {
            tipo: item.tipo,
            posicao: item.posicao,
            titulo: secao.rotulo + " " + item.posicao,
            resumo: "",
            descricao: "",
            midia: "",
            imagem: ""
        };

        const { error } = await cliente
            .from("conteudos")
            .upsert(vazio, { onConflict: "tipo,posicao" });

        esvaziar.disabled = false;

        if (error) {
            recado.textContent = "Não esvaziou: " + error.message;
            recado.classList.add("erro");
            return;
        }

        repor(vazio);
        nome.textContent = vazio.titulo;
        sinal.textContent = "vazio";
        sinal.classList.add("vazio");
        recado.textContent = "Esvaziado.";
        setTimeout(() => { recado.textContent = ""; }, 3000);
    });
    corpo.appendChild(acoes);

    apagar.addEventListener("click", async () => {
        const nomeAtual = nome.textContent;
        if (!window.confirm(
            "Apagar o espaço " + item.posicao + " (" + nomeAtual + ")? " +
            "Ele some do site, e não dá para desfazer."
        )) return;

        apagar.disabled = true;
        recado.textContent = "Apagando…";

        const { error } = await cliente
            .from("conteudos")
            .delete()
            .eq("tipo", item.tipo)
            .eq("posicao", item.posicao);

        if (error) {
            apagar.disabled = false;
            recado.textContent = "Não apagou: " + error.message;
            recado.classList.add("erro");
            return;
        }

        await carregar(item.tipo);
    });

    if (item.atualizado_por) {
        corpo.appendChild(criar("p", "admin-carimbo",
            "Última alteração: " + item.atualizado_por + " em " +
            new Date(item.atualizado_em).toLocaleString("pt-BR")));
    }

    salvar.addEventListener("click", async () => {
        salvar.disabled = true;
        recado.textContent = "Salvando…";
        recado.classList.remove("erro");

        const novo = {
            tipo: item.tipo,
            posicao: item.posicao,
            titulo: fTitulo.entrada.value.trim(),
            resumo: fResumo.entrada.value.trim(),
            descricao: fDescricao.entrada.value.trim(),
            midia: bMidia ? bMidia.valor() : fLink.entrada.value.trim(),
            imagem: bImagem ? bImagem.valor() : (item.imagem || "")
        };

        const { error } = await cliente
            .from("conteudos")
            .upsert(novo, { onConflict: "tipo,posicao" });

        salvar.disabled = false;

        if (error) {
            recado.textContent = "Não salvou: " + error.message;
            recado.classList.add("erro");
            return;
        }

        recado.textContent = "Salvo.";
        nome.textContent = novo.titulo || secao.rotulo + " " + item.posicao;
        sinal.textContent = novo.midia ? "pronto" : "vazio";
        sinal.classList.toggle("vazio", !novo.midia);

        setTimeout(() => { recado.textContent = ""; }, 3000);
    });

    topo.addEventListener("click", () => {
        corpo.hidden = !corpo.hidden;
        caixa.classList.toggle("aberto", !corpo.hidden);
    });

    caixa.appendChild(corpo);
    return caixa;
}

/* ---------- 8. Roda ao abrir ---------- */

comecar();
