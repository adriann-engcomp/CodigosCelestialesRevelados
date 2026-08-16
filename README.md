# Códigos Celestiais Revelados

Site de página única (um `index.html` só, com menu por âncoras), no mesmo
estilo de construção do EncantosDoLar.

## Arquivos do projeto

| Arquivo | Para que serve |
|---|---|
| `index.html` | Todo o **conteúdo** e os textos do site |
| `style.css` | As **cores, fontes e o layout** |
| `script.js` | Os **comportamentos** (menu do celular, galeria, vídeos) |
| `imagens/` | Onde ficam as fotos (veja o `LEIA-ME.txt` lá dentro) |

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
- [ ] `index.html` → seção **VÍDEOS**: trocar `COLE_O_ID_AQUI` pelo código
      do vídeo do YouTube (em `youtube.com/watch?v=**AbC123**`, o ID é `AbC123`)
- [ ] `imagens/` → colocar `foto1.jpg` ... `foto6.jpg`, `livro1.jpg`, `livro2.jpg`
- [ ] `index.html` → revisar os textos das seções Apresentação, Quem somos,
      Objetivos, Mensagens e Livros (são textos-base, feitos para você editar)
- [ ] `style.css` → mudar as cores, se quiser: tudo está no bloco `:root`,
      nas primeiras linhas do arquivo

## Domínio próprio (opcional)

O GitHub Pages aceita um domínio comprado por você
(ex.: `codigoscelestiaisrevelados.com.br`). Depois que o site estiver no ar,
é em **Settings → Pages → Custom domain**. Só vale a pena depois que o
conteúdo estiver pronto.
