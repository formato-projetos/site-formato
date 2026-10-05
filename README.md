# Formato Projetos e Consultoria · site institucional

Site institucional da Formato Projetos e Consultoria: consultoria técnica em limpeza urbana, gestão de resíduos sólidos e propostas para licitações.

## Tecnologias

HTML, CSS e JavaScript puros. Sem frameworks e sem etapa de build.

## Estrutura

| Caminho | O que é |
|---|---|
| `index.html` | Página única com todas as seções |
| `style.css` | Todo o visual do site |
| `script.js` | Menu no celular, header ao rolar, ano no rodapé, formulário de contato (Netlify Forms), linhas do mapa, vídeo do aterro e troca das fotos do topo (tempo em `TEMPO_FOTO`) |
| `assets/logo-formato.svg` | Logo oficial (versão para fundo claro), vetorizada a partir do JPG |
| `assets/logo-formato-clara.svg` | Logo (versão para fundo escuro) |
| `assets/icone-formato-2.svg` | Ícone da aba do navegador (o "F" da logo) |
| `assets/manrope.woff2` | Fonte dos textos |
| `assets/img/` | Fotos (JPG), mapas (SVG) e vídeo do aterro. Veja a tabela abaixo |

## Fotos do site (como trocar)

Para trocar uma foto, **salve a nova em JPG com exatamente o mesmo nome** dentro de `assets/img/`,
substituindo o arquivo antigo. Não precisa mexer no código. Depois abra o site com Ctrl+F5.

| Arquivo | Onde aparece |
|---|---|
| `topo-salvador.jpg` | Topo do site, 1ª foto (é a que carrega primeiro) |
| `topo-rio-de-janeiro.jpg` | Topo, 2ª foto |
| `topo-sao-paulo.jpg` | Topo, 3ª foto |
| `topo-curitiba.jpg` | Topo, 4ª foto |
| `topo-recife.jpg` | Topo, 5ª foto |
| `servicos.jpg` | Seção "O que fazemos", foto à esquerda da lista |
| `faixa-coleta.jpg` | Faixa "Do mapa para a rua" |
| `aterro.mp4` | Vídeo do quadro "Aterros sanitários" |
| `aterro-capa.jpg` | Imagem parada que aparece antes do vídeo carregar |
| `mapa-mooca.svg` | Mapa central da Mooca |
| `mapa-zoom-coleta.svg` | Zoom 1, setores de coleta |
| `mapa-zoom-varricao.svg` | Zoom 2, circuitos de varrição |

Dicas: foto na horizontal, com cerca de 1600 px de largura e até uns 400 KB.
Nome sempre em minúsculas, sem espaço e sem acento. No Windows, ative
"Extensões de nomes de arquivos" para ter certeza de que o arquivo termina em `.jpg`.

## Como rodar no computador

Na pasta do projeto, no terminal:

```
python -m http.server 5500
```

Depois abra http://localhost:5500 no navegador. Para parar: `Ctrl + C`.

## Pendências

- [ ] Logo em vetor original (SVG, PDF, AI ou EPS), se a empresa tiver
- [ ] Domínio e e-mail novos (hoje: gruponp.net)
- [ ] E-mail oficial de contato (hoje: comercial@gruponp.net, no index.html e em EMAIL_CONTATO no script.js)
- [ ] No Netlify: ativar o aviso por e-mail em Site configuration > Forms > Form notifications
- [ ] Quadro de dimensionamento: números de exemplo; trocar por dados reais, se puderem ser mostrados
- [ ] Ano de fundação (hoje: "+30 anos")
- [ ] Validar a seção "Como trabalhamos" com a empresa

## Créditos

- Fonte: Manrope (licença SIL Open Font License).
- Mapas: ruas © OpenStreetMap contributors (licença ODbL). Setores de coleta e circuitos de varrição são exemplos ilustrativos.
- Fotos: Unsplash e Pexels (licenças gratuitas para uso comercial). Autores indicados em comentários no `index.html`.
- Vídeo do aterro: enviado pela empresa.
