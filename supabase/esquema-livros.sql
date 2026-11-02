-- =====================================================================
-- CÓDIGOS CELESTIAIS REVELADOS — os livros no painel
--
-- Rode este arquivo UMA VEZ no SQL Editor do Supabase, DEPOIS do
-- esquema.sql. Ele acrescenta os livros ao painel:
--
--   1. passa a aceitar os tipos "livro-pt" e "livro-es"
--   2. guarda os 21 livros que já estão no site, do jeito que estão
--
-- Pode rodar de novo sem medo: nada é apagado nem duplicado.
--
-- Como as colunas são usadas pelos livros:
--
--   titulo     o nome do livro, escrito em português
--   resumo     a tradução entre parênteses (só o Eka Tantra tem)
--   descricao  uma descrição do livro, se um dia quiserem pôr
--   midia      o PDF do livro
--   imagem     a capa
--
-- A língua da leitura em voz alta vem do tipo: livro-pt lê em
-- português, livro-es lê em espanhol.
-- =====================================================================


-- 1. aceitar os dois tipos novos
alter table public.conteudos
    drop constraint if exists conteudos_tipo_check;

alter table public.conteudos
    add constraint conteudos_tipo_check
    check (tipo in ('audio', 'video', 'tema', 'livro-pt', 'livro-es'));


-- 2. os 21 livros que já estão no site
insert into public.conteudos (tipo, posicao, titulo, resumo, midia, imagem) values
    ('livro-pt',  1, 'Código Celestial do Aperfeiçoamento',             '',                        '',                                                      'livros/ImagensDosLivros/codigo-celestial-do-aperfeicoamento.png'),
    ('livro-pt',  2, 'Código Celestial Céu e Terra',                    '',                        'livros/codigo-celestial-ceu-e-terra.pdf',               'livros/ImagensDosLivros/codigo-celestial-ceu-e-terra.png'),
    ('livro-pt',  3, 'Código Celestial do Dharma Supremo',              '',                        '',                                                      'livros/ImagensDosLivros/codigo-celestial-do-dharma-supremo.png'),
    ('livro-es',  1, 'Código Celestial Eka Tantra',                     'Revelação da Unidade',    'livros/eka-tantra.pdf',                                 'livros/ImagensDosLivros/eka-tantra.png'),
    ('livro-es',  2, 'Código Celestial da Justiça Divina',              '',                        'livros/codigo_de_la_justicia_divina.pdf',               'livros/ImagensDosLivros/codigo-de-la-justicia-divina.jpg'),
    ('livro-es',  3, 'Código Celestial da Síntese Holística',           '',                        'livros/codigo-de-sintesis-holistico.pdf',               'livros/ImagensDosLivros/codigo-de-sistesis-holistico.png'),
    ('livro-es',  4, 'Código Celestial Alfa e Ômega Galáctico',         '',                        'livros/codigo-tantrico-alfa-y-omega-galactico.pdf',     'livros/ImagensDosLivros/codigo-tantrico-alfa-y-omega-galactico.png'),
    ('livro-es',  5, 'Código Celestial do Tao Galáctico',               '',                        '',                                                      'livros/ImagensDosLivros/codigo-tantrico-tao-galactico.jpg'),
    ('livro-es',  6, 'Código Celestial do Divino Deus Uno Absoluto',    '',                        '',                                                      'livros/ImagensDosLivros/codigo-tantrico-divino-dios-uno-absoluto.jpeg'),
    ('livro-es',  7, 'Código Celestial Céu e Terra',                    '',                        '',                                                      'livros/ImagensDosLivros/el-codigo-tupa-cielo-y-tierra.jpeg'),
    ('livro-es',  8, 'Código Celestial Universal',                      '',                        '',                                                      'livros/ImagensDosLivros/codigo-tantrico-universal.png'),
    ('livro-es',  9, 'Código Celestial Andino',                         '',                        '',                                                      'livros/ImagensDosLivros/codigo-tantrico-andino.png'),
    ('livro-es', 10, 'Código Celestial da Flor da Vida',                '',                        'livros/codigo-tantrico-la-flor-de-la-vida.pdf',         'livros/ImagensDosLivros/codigo-tantrico-la-flor-de-la-vida.jpeg'),
    ('livro-es', 11, 'Código Celestial da Flor do Coração',             '',                        '',                                                      'livros/ImagensDosLivros/codigo-tantrico-la-flor-del-corazon-01.jpeg'),
    ('livro-es', 12, 'Código Celestial da Árvore da Vida',              '',                        '',                                                      'livros/ImagensDosLivros/codigo-tantrico-el-arbol-de-la-vida.jpeg'),
    ('livro-es', 13, 'Código Celestial dos Reinos Superiores',          '',                        '',                                                      'livros/ImagensDosLivros/divino-codigo-de-los-reinos-superiores.jpg'),
    ('livro-es', 14, 'Código Celestial da Joia do Coração I',           '',                        '',                                                      'livros/ImagensDosLivros/codigo-tantrico-la-joya-del-corazon-1.jpeg'),
    ('livro-es', 15, 'Código Celestial da Joia do Coração II',          '',                        '',                                                      'livros/ImagensDosLivros/codigo-tantrico-la-joya-del-corazon-2.jpeg'),
    ('livro-es', 16, 'Código Celestial da Joia do Coração III',         '',                        '',                                                      'livros/ImagensDosLivros/codigo-tantrico-la-joya-del-corazon-3.jpeg'),
    ('livro-es', 17, 'Código Celestial da Joia do Coração IV',          '',                        '',                                                      'livros/ImagensDosLivros/codigo-tantrico-la-joya-del-corazon-4.jpg'),
    ('livro-es', 18, 'Código Celestial Ekadanta Bhakti Siddhanta',      '',                        '',                                                      'livros/ImagensDosLivros/ekadanta-bhakti-siddhanta.jpeg')
on conflict (tipo, posicao) do nothing;


-- CONFERÊNCIA
select tipo, count(*) as espacos from public.conteudos group by tipo order by tipo;
