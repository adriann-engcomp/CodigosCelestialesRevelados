# Códigos Celestiais Revelados

Site de página única (um `index.html` só, com menu por âncoras), no mesmo
estilo de construção do EncantosDoLar.

## Arquivos do projeto

| Arquivo | Para que serve |
|---|---|
| `index.html` | Todo o **conteúdo** e os textos do site |
| `style.css` | As **cores, fontes e o layout** |
| `script.js` | Os **comportamentos** (menu, galeria, vídeos, leitor de PDF, leitura em voz alta) |
| `imagens/` | Onde ficam as fotos da galeria (veja o `LEIA-ME.txt` lá dentro) |
| `livros/` | Os livros em PDF e as capas (veja o `LEIA-ME.txt` lá dentro) |
| `audios/` | Os áudios gravados em MP3 (veja o `LEIA-ME.txt` lá dentro) |
| `recados.html` | Página particular onde o cliente escreve os pedidos de mudança |
| `recados.js` | O envio dessa página |

## Para ver o site no seu computador

Dê dois cliques no `index.html`. Ele abre no navegador. Depois de editar
qualquer arquivo, é só apertar **F5** na página para ver a mudança.

---

# Como publicar no GitHub Pages

Sim, o GitHub Pages é uma boa escolha aqui: é **gratuito**, não expira, já é
o que você usa no EncantosDoLar, e serve exatamente para sites feitos de
HTML + CSS + JS como este.

O caminho abaixo é **pelo site do GitHub**, sem instalar nada e sem usar
comandos.

## Passo 1 — Criar o repositório

1. Entre em <https://github.com> com a sua conta (`adriann-engcomp`).
2. Clique no **+** no canto superior direito → **New repository**.
3. Em *Repository name*, escreva: `CodigosCelestialesRevelados`
4. Deixe marcado **Public**.
5. **Não** marque "Add a README file" (você já tem um aqui).
6. Clique em **Create repository**.

## Passo 2 — Enviar os arquivos

1. Na página que abrir, clique em **uploading an existing file**
   (ou vá em **Add file** → **Upload files**).
2. Abra a pasta `CodigosCelestialesRevelados` no seu computador,
   selecione **todos os arquivos e a pasta `imagens`** e arraste para
   dentro da janela do navegador.
3. Espere terminar de subir e clique no botão verde **Commit changes**.

## Passo 3 — Ligar o GitHub Pages

1. Dentro do repositório, clique em **Settings** (no menu de cima).
2. Na coluna da esquerda, clique em **Pages**.
3. Em *Source*, escolha **Deploy from a branch**.
4. Em *Branch*, escolha **main** e a pasta **/ (root)**.
5. Clique em **Save**.

Espere de 1 a 3 minutos e recarregue a página. O endereço do site vai
aparecer ali em cima:

```
https://adriann-engcomp.github.io/CodigosCelestialesRevelados/
```

## Passo 4 — Fazer alterações depois

1. No repositório, clique no arquivo que quer mudar (ex.: `index.html`).
2. Clique no ícone de **lápis** (Edit this file).
3. Faça a alteração e clique em **Commit changes**.
4. Em cerca de 1 minuto o site já está atualizado.

> Se a mudança não aparecer, o navegador está mostrando a versão antiga
> guardada. Aperte **Ctrl + F5** para forçar o recarregamento.

---

## O que trocar no site (checklist)

- [ ] `index.html` → seção **CONTATO**: e-mail, WhatsApp e cidade reais
      (procure por `seuemail@exemplo.com` e `5588999999999`)
- [ ] `index.html` → seções **VÍDEOS** e **ENTREVISTAS**: trocar `COLE_O_ID_AQUI`
      pelo código do vídeo do YouTube (em `youtube.com/watch?v=**AbC123**`, o ID é `AbC123`)
- [ ] `index.html` → seção **LINKS**: trocar o `href="#"` e os textos pelos
      endereços e nomes reais das outras páginas e espaços
- [ ] `audios/` → colocar `audio1.mp3`, `audio2.mp3`, `audio3.mp3` e trocar
      os títulos e descrições na seção **ÁUDIOS** do `index.html`
- [ ] `livros/` → colocar os PDFs que ainda faltam, e as capas de
      **Dharma Supremo** e **Aperfeiçoamento** em `livros/ImagensDosLivros`
      (veja o `LEIA-ME.txt` da pasta `livros`)
- [ ] `style.css` → mudar as cores, se quiser: tudo está no bloco `:root`,
      nas primeiras linhas do arquivo

## A página de pedidos de mudança

O `recados.html` é uma página à parte, **fora do menu**: ela não aparece no
site, não está no `sitemap.xml` e pede ao Google para não indexá-la. Só chega
lá quem receber o endereço de você:

```
https://adriann-engcomp.github.io/CodigosCelestialesRevelados/recados.html
```

O cliente escreve o pedido ali e você recebe por e-mail. Como o site é feito só
de arquivos (não tem um programa por trás), quem recebe o texto e te manda o
e-mail é o **Formspree**, gratuito para até 50 mensagens por mês.

**Para ligar a página ao seu e-mail (uma vez só):**

1. Entre em <https://formspree.io> e crie a conta com o seu e-mail.
2. Clique em **New form**, dê o nome "Códigos Celestiais" e salve.
3. Ele mostra um endereço assim: `https://formspree.io/f/abcdwxyz`.
   O pedaço final (`abcdwxyz`) é o seu código.
4. Abra o `recados.html`, procure por `COLE_AQUI_O_CODIGO_DO_FORMSPREE` e
   troque por esse código. Não mexa em mais nada.
5. Mande uma mensagem de teste pela página. Na primeira vez o Formspree pede
   que você confirme o e-mail — confirme e está pronto.

Enquanto o código não estiver lá, a página avisa em português em vez de fingir
que enviou. E se o envio falhar (internet caiu, serviço fora do ar), ela oferece
um link que abre o e-mail com o pedido já escrito — ninguém perde o texto.

> O link de emergência usa o `seuemail@exemplo.com` do `recados.js`: troque pelo
> seu e-mail de verdade, junto com os da seção de contato.

## Aparecer no Google

Já está pronto no site (não custa nada):

- `sitemap.xml` — a lista de endereços que o Google deve visitar
- `robots.txt` — libera o acesso dos robôs e aponta o sitemap
- `<link rel="canonical">` — evita que o mesmo conteúdo conte como duplicado
- Meta tags Open Graph + `imagens/capa-social.jpg` — a prévia com imagem que
  aparece ao mandar o link no WhatsApp, Facebook ou Telegram
- Ficha JSON-LD com o nome do site e a grafia em espanhol como nome alternativo

**Falta um passo, e é grátis: cadastrar o site no Google Search Console**
(<https://search.google.com/search-console>). Entre com a mesma conta Google,
escolha **Prefixo do URL**, cole o endereço do site e confirme a posse. Depois,
no menu **Sitemaps**, envie:

```
sitemap.xml
```

Sem isso o Google até acha o site sozinho, mas demora muito mais.

> Detalhe: o `robots.txt` só passa a valer de verdade quando o site tiver
> domínio próprio. Os buscadores só leem esse arquivo na raiz do endereço
> (`adriann-engcomp.github.io/robots.txt`), e a raiz não pertence a este
> repositório. O `sitemap.xml` funciona normalmente do jeito que está, desde
> que seja enviado pelo Search Console.

## Domínio próprio (opcional)

O GitHub Pages aceita um domínio comprado por você
(ex.: `codigoscelestiaisrevelados.com.br`). Depois que o site estiver no ar,
é em **Settings → Pages → Custom domain**. Só vale a pena depois que o
conteúdo estiver pronto.
