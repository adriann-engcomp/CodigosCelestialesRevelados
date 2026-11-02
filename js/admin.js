/* =========================================================
   PAINEL DE CONTEÚDO — comportamento da página admin.html

   O caminho é sempre o mesmo:

     1. a pessoa entra com a conta do Google
     2. o painel confere se o e-mail dela está na tabela admins
     3. se estiver, mostra os 36 espaços de cada seção para editar
     4. cada "Salvar" grava uma linha na tabela conteudos
     5. cada arquivo enviado vai para o espaço "arquivos" e o
        endereço dele é preenchido sozinho no campo

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
const adminEmail = document.getElementById("adminEmail");
const estado = document.getElementById("estado");
const lista = document.getElementById("lista");
const abas = document.getElementById("abas");

/* O que cada seção chama as suas coisas, para os rótulos saírem
   em português certo em vez de "audio 1", "tema 1". */
const SECOES = {
    audio: {
        rotulo: "Áudio",
        midia: "Endereço do áudio (link do YouTube, do Internet Archive, ou arquivo enviado)",
        aceita: "audio/*",
        temImagem: false
    },
    video: {
        rotulo: "Vídeo",
        midia: "Link do vídeo no YouTube (o endereço inteiro ou só o código)",
        aceita: null,
        temImagem: false
    },
    tema: {
        rotulo: "Texto",
        midia: "PDF do texto (envie o arquivo abaixo)",
        aceita: ".pdf",
        temImagem: true
    }
};

let cliente = null;
let usuario = null;
let tipoAtual = "audio";

/* ---------- 2. Avisos na tela ---------- */

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

    cliente.auth.onAuthStateChange((evento, sessao) => {
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

/* ---------- 6. Carregar e desenhar os espaços ---------- */

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

    data.forEach((item) => lista.appendChild(cartao(item)));
    dizer(data.length + " espaços. Clique em um para escrever.");
}

function campo(rotulo, valor, linhas, ajuda) {
    const bloco = document.createElement("label");
    bloco.className = "admin-campo";

    const titulo = document.createElement("span");
    titulo.className = "admin-campo-titulo";
    titulo.textContent = rotulo;
    bloco.appendChild(titulo);

    if (ajuda) {
        const dica = document.createElement("span");
        dica.className = "admin-campo-ajuda";
        dica.textContent = ajuda;
        bloco.appendChild(dica);
    }

    const entrada = document.createElement(linhas > 1 ? "textarea" : "input");
    if (linhas > 1) entrada.rows = linhas;
    entrada.value = valor || "";
    bloco.appendChild(entrada);

    bloco.entrada = entrada;
    return bloco;
}

function cartao(item) {
    const secao = SECOES[item.tipo];

    const caixa = document.createElement("article");
    caixa.className = "admin-item";

    /* a linha que fica sempre visível */
    const topo = document.createElement("button");
    topo.className = "admin-item-topo";
    topo.innerHTML =
        '<span class="admin-item-num">' + item.posicao + "</span>" +
        '<span class="admin-item-nome"></span>' +
        '<span class="admin-item-sinal"></span>';
    topo.querySelector(".admin-item-nome").textContent =
        item.titulo || secao.rotulo + " " + item.posicao;

    const sinal = topo.querySelector(".admin-item-sinal");
    sinal.textContent = item.midia ? "pronto" : "vazio";
    sinal.classList.toggle("vazio", !item.midia);

    caixa.appendChild(topo);

    /* o formulário, que abre ao clicar */
    const corpo = document.createElement("div");
    corpo.className = "admin-item-corpo";
    corpo.hidden = true;

    const fTitulo = campo("Título", item.titulo, 1);
    const fResumo = campo("Descrição curta", item.resumo, 3,
        "2 ou 3 frases. É o que aparece no cartão.");
    const fDescricao = campo("Descrição completa", item.descricao, 6,
        "Só aparece quando a pessoa aperta o botão. Pode ficar vazia.");
    const fMidia = campo(secao.midia, item.midia, 1);

    corpo.appendChild(fTitulo);
    corpo.appendChild(fResumo);
    corpo.appendChild(fDescricao);
    corpo.appendChild(fMidia);

    let fImagem = null;
    if (secao.temImagem) {
        fImagem = campo("Desenho da capa", item.imagem, 1);
        corpo.appendChild(fImagem);
        corpo.appendChild(areaEnvio(item, "imagem", "image/*", fImagem.entrada));
    }

    if (secao.aceita) {
        corpo.appendChild(areaEnvio(item, "midia", secao.aceita, fMidia.entrada));
    }

    /* salvar */
    const acoes = document.createElement("div");
    acoes.className = "admin-item-acoes";

    const salvar = document.createElement("button");
    salvar.className = "botao botao-principal";
    salvar.textContent = "Salvar";

    const recado = document.createElement("span");
    recado.className = "admin-recado";

    acoes.appendChild(salvar);
    acoes.appendChild(recado);
    corpo.appendChild(acoes);

    if (item.atualizado_por) {
        const quando = document.createElement("p");
        quando.className = "admin-carimbo";
        quando.textContent =
            "Última alteração: " + item.atualizado_por + " em " +
            new Date(item.atualizado_em).toLocaleString("pt-BR");
        corpo.appendChild(quando);
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
            midia: fMidia.entrada.value.trim(),
            imagem: fImagem ? fImagem.entrada.value.trim() : item.imagem
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
        topo.querySelector(".admin-item-nome").textContent =
            novo.titulo || secao.rotulo + " " + item.posicao;
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

/* ---------- 7. Envio de arquivo: arrastar ou escolher ---------- */

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

function areaEnvio(item, coluna, aceita, destino) {
    const area = document.createElement("div");
    area.className = "admin-envio";

    const texto = document.createElement("p");
    texto.className = "admin-envio-texto";
    texto.textContent = "Arraste o arquivo para cá, ou clique para escolher.";

    const entrada = document.createElement("input");
    entrada.type = "file";
    entrada.accept = aceita;
    entrada.hidden = true;

    area.appendChild(texto);
    area.appendChild(entrada);

    async function enviar(arquivo) {
        if (!arquivo) return;

        texto.textContent = "Enviando " + arquivo.name + "…";
        area.classList.add("enviando");

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
        destino.value = data.publicUrl;

        area.classList.remove("erro");
        texto.textContent = "Enviado. Agora é só apertar Salvar.";
    }

    area.addEventListener("click", () => entrada.click());
    entrada.addEventListener("change", () => enviar(entrada.files[0]));

    ["dragenter", "dragover"].forEach((e) =>
        area.addEventListener(e, (ev) => {
            ev.preventDefault();
            area.classList.add("sobre");
        })
    );

    ["dragleave", "drop"].forEach((e) =>
        area.addEventListener(e, (ev) => {
            ev.preventDefault();
            area.classList.remove("sobre");
        })
    );

    area.addEventListener("drop", (ev) => {
        enviar(ev.dataTransfer.files[0]);
    });

    return area;
}

/* ---------- 8. Roda ao abrir ---------- */

comecar();
