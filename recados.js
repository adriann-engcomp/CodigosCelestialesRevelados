/* =========================================================
   PÁGINA DE PEDIDOS DE MUDANÇA (recados.html)

   Envia o formulário sem sair da página e mostra a resposta
   em português. Quem recebe o texto e manda por e-mail é o
   Formspree — veja as instruções dentro do recados.html.
   ========================================================= */

const formulario = document.getElementById("formulario");
const botaoEnviar = document.getElementById("botaoEnviar");
const estado = document.getElementById("estado");
const pronto = document.getElementById("pronto");
const botaoOutro = document.getElementById("botaoOutro");

/* O endereço ainda com o texto de exemplo significa que o código do
   Formspree não foi colado. Melhor avisar do que fingir que enviou. */
function faltaConfigurar() {
    return formulario.action.indexOf("COLE_AQUI_O_CODIGO") !== -1;
}

function avisar(texto, tipo) {
    estado.textContent = texto;
    estado.className = "recados-estado" + (tipo ? " " + tipo : "");
}

/* Se o envio falhar (internet caiu, serviço fora do ar), o pedido não se
   perde: este link abre o e-mail já com tudo escrito. */
function linkDeSocorro() {
    const dados = new FormData(formulario);
    const corpo =
        "Nome: " + (dados.get("nome") || "") + "\n" +
        "Contato: " + (dados.get("contato") || "") + "\n" +
        "Parte do site: " + (dados.get("parte") || "") + "\n" +
        "O que é para fazer: " + (dados.get("tipo") || "") + "\n\n" +
        (dados.get("mensagem") || "");

    return "mailto:seuemail@exemplo.com" +
        "?subject=" + encodeURIComponent("Pedido de mudança no site Códigos Celestiais") +
        "&body=" + encodeURIComponent(corpo);
}

function mostrarSocorro() {
    avisar("Não consegui enviar agora. ", "erro");

    const link = document.createElement("a");
    link.href = linkDeSocorro();
    link.textContent = "Mandar por e-mail";
    link.className = "recados-socorro";
    estado.appendChild(link);
}

formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (faltaConfigurar()) {
        avisar("Esta página ainda não foi ligada ao e-mail. Avise quem cuida do site.", "erro");
        return;
    }

    botaoEnviar.disabled = true;
    avisar("Enviando…");

    try {
        const resposta = await fetch(formulario.action, {
            method: "POST",
            body: new FormData(formulario),
            headers: { Accept: "application/json" }
        });

        if (!resposta.ok) throw new Error("recusado");

        formulario.hidden = true;
        pronto.hidden = false;
        pronto.scrollIntoView({ behavior: "smooth", block: "center" });
        avisar("");
    } catch (erro) {
        mostrarSocorro();
    } finally {
        botaoEnviar.disabled = false;
    }
});

botaoOutro.addEventListener("click", () => {
    formulario.reset();
    formulario.hidden = false;
    pronto.hidden = true;
    avisar("");
    formulario.scrollIntoView({ behavior: "smooth", block: "start" });
});
