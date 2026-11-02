/* =========================================================
   CÓDIGOS CELESTIAIS REVELADOS — ligação com o Supabase

   É AQUI que entram as duas linhas que você copia do painel
   do Supabase, em Project Settings -> API Keys:

       ENDERECO  o "Project URL"
       CHAVE     a "Publishable key" (começa com sb_publishable_)

   Estas duas são públicas de propósito: ficam visíveis no
   código do site, como tem de ser num site estático. Quem
   garante a segurança são as regras criadas pelo
   supabase/esquema.sql — mesmo com as duas, quem não estiver
   na tabela de admins não consegue salvar nada.

   NUNCA ponha aqui a "Secret key" (sb_secret_...) nem a senha
   do banco: essas passam por cima de todas as regras.

   Enquanto estiver com os valores de exemplo abaixo, o site
   funciona normalmente, usando o conteúdo do conteudos.js.
   ========================================================= */

const SUPABASE = {
    ENDERECO: "https://gtnidukyldjpfoffxicl.supabase.co",
    CHAVE: "sb_publishable_rKXzL1g2Nvw_bpZ8FlSWqQ_ihULMp2A"
};

/* Diz se já foi preenchido. O site usa isto para decidir se
   busca o conteúdo no Supabase ou se usa o conteudos.js. */
function supabaseConfigurado() {
    return (
        SUPABASE.ENDERECO.indexOf("http") === 0 &&
        SUPABASE.CHAVE.indexOf("COLE_AQUI") !== 0 &&
        SUPABASE.CHAVE.length > 20
    );
}
