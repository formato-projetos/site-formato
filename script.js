/* ==========================================================================
   Formato Projetos e Consultoria: comportamentos do site
   1. Menu mobile  2. Header ao rolar  3. Ano no rodapé  4. Formulário
   5. Linhas do mapa  6. Vídeo do aterro  7. Fotos do topo
   O site funciona sem JavaScript; este arquivo só melhora a experiência.
   ========================================================================== */

// 1. MENU MOBILE -------------------------------------------------------------
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#menu");

function setMenu(aberto) {
  toggle.setAttribute("aria-expanded", String(aberto));
  toggle.querySelector(".visually-hidden").textContent = aberto ? "Fechar menu" : "Abrir menu";
  nav.classList.toggle("is-open", aberto);
}

toggle.addEventListener("click", () => {
  setMenu(toggle.getAttribute("aria-expanded") !== "true");
});

// Fecha ao clicar em um link do menu
nav.addEventListener("click", (e) => {
  if (e.target.closest("a")) setMenu(false);
});

// Fecha com a tecla Esc e devolve o foco ao botão
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("is-open")) {
    setMenu(false);
    toggle.focus();
  }
});

// 2. HEADER AO ROLAR ---------------------------------------------------------
const header = document.querySelector(".header");
const atualizarHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
window.addEventListener("scroll", atualizarHeader, { passive: true });
atualizarHeader();

// 3. ANO NO RODAPÉ -----------------------------------------------------------
document.querySelectorAll("[data-ano]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// 4. FORMULÁRIO --------------------------------------------------------------
// Envia sem recarregar a página. O recebimento é feito pelo Netlify Forms
// (atributo data-netlify no HTML): a mensagem fica no painel do Netlify e um
// aviso chega no e-mail da empresa. Só funciona com o site publicado no Netlify;
// testando no computador, aparece a mensagem de erro com o e-mail para contato.
const form = document.querySelector(".form");
const status = form.querySelector(".form__status");
const EMAIL_CONTATO = "comercial@gruponp.net"; // PENDENTE: trocar pelo e-mail oficial

function mostrarStatus(texto, tipo) {
  status.textContent = texto;
  status.className = `form__status is-${tipo}`;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Validação: marca os campos inválidos e leva o foco ao primeiro
  const campos = [...form.querySelectorAll("input:not([type=hidden]):not([name=website]), textarea")];
  campos.forEach((c) => c.setAttribute("aria-invalid", String(!c.checkValidity())));
  const invalido = campos.find((c) => !c.checkValidity());
  if (invalido) {
    mostrarStatus("Preencha os campos obrigatórios corretamente.", "error");
    invalido.focus();
    return;
  }

  const botao = form.querySelector("button[type=submit]");
  botao.disabled = true;
  mostrarStatus("Enviando…", "ok");

  try {
    const resposta = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(form)).toString(),
    });
    if (!resposta.ok) throw new Error(resposta.status);

    form.reset();
    mostrarStatus("Mensagem enviada. Obrigado pelo contato! Responderemos pelo e-mail informado.", "ok");
  } catch {
    mostrarStatus(`Não foi possível enviar agora. Escreva para ${EMAIL_CONTATO}.`, "error");
  } finally {
    botao.disabled = false;
  }
});

// 5. LINHAS DO MAPA ----------------------------------------------------------
// Liga cada quadro de zoom à sua área no mapa com uma linha tracejada.
// As áreas vêm do atributo data-zonas da figura, em % da imagem
// (esquerda, topo, direita, base), separadas por ";".
const palco = document.querySelector(".map-stage");

if (palco) {
  const svg = palco.querySelector(".map-stage__lines");
  const figura = palco.querySelector(".map-stage__map");
  const imgMapa = figura.querySelector("img");
  const zonas = figura.dataset.zonas.split(";").map((z) => z.split(",").map(Number));
  const NS = "http://www.w3.org/2000/svg";

  function desenharLinhas() {
    svg.replaceChildren();
    if (getComputedStyle(svg).display === "none") return; // só no computador

    const palcoBox = palco.getBoundingClientRect();
    const mapa = imgMapa.getBoundingClientRect();

    palco.querySelectorAll(".map-card[data-zona]").forEach((card) => {
      const [esq, topo, , baixo] = zonas[Number(card.dataset.zona) - 1];
      const c = card.getBoundingClientRect();

      // Saída: meio da borda direita do quadro. Chegada: meio da borda esquerda da área.
      const x1 = c.right - palcoBox.left;
      const y1 = c.top + c.height / 2 - palcoBox.top;
      const x2 = mapa.left - palcoBox.left + (mapa.width * esq) / 100;
      const y2 = mapa.top - palcoBox.top + (mapa.height * (topo + baixo)) / 200;

      const linha = document.createElementNS(NS, "line");
      Object.entries({ x1, y1, x2, y2 }).forEach(([k, v]) => linha.setAttribute(k, v.toFixed(1)));
      const ponto = document.createElementNS(NS, "circle");
      ponto.setAttribute("cx", x2.toFixed(1));
      ponto.setAttribute("cy", y2.toFixed(1));
      ponto.setAttribute("r", "4");
      svg.append(linha, ponto);
    });
  }

  // Redesenha quando o mapa carrega e sempre que o tamanho do palco muda
  imgMapa.addEventListener("load", desenharLinhas);
  new ResizeObserver(desenharLinhas).observe(palco);
}

// 6. VÍDEO DO ATERRO ---------------------------------------------------------
// Só toca quando aparece na tela (economiza dados) e nunca para quem pediu
// menos movimento nas configurações do sistema; nesse caso fica a imagem parada.
const video = document.querySelector(".map-card__video");
const menosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (video && !menosMovimento) {
  new IntersectionObserver((entradas) => {
    entradas.forEach((e) => (e.isIntersecting ? video.play().catch(() => {}) : video.pause()));
  }, { threshold: 0.25 }).observe(video);
}

// 7. FOTOS DO TOPO -----------------------------------------------------------
// Troca a foto da cidade a cada 4 segundos, com esmaecimento de 1 s (CSS).
// Só a primeira foto vem com a página; as outras carregam depois que tudo abriu.
// Para quem pediu menos movimento no sistema, fica parada na primeira foto.
const TEMPO_FOTO = 4000; // milissegundos

const fotos = [...document.querySelectorAll(".hero__photo")];
const nomeCidade = document.querySelector("[data-cidade-atual]");
const botaoPausa = document.querySelector(".hero__pause");

if (fotos.length > 1 && !menosMovimento) {
  let atual = 0;
  let timer = null;
  let pausado = false;

  // Carrega as outras fotos em segundo plano
  window.addEventListener("load", () => {
    fotos.slice(1).forEach((img) => {
      img.src = img.dataset.src;
    });
  });

  function mostrar(i) {
    fotos[atual].classList.remove("is-active");
    atual = i;
    fotos[atual].classList.add("is-active");
    nomeCidade.textContent = fotos[atual].dataset.cidade;
  }

  function proxima() {
    const i = (atual + 1) % fotos.length;
    // Só troca se a próxima foto já terminou de carregar
    if (fotos[i].complete && fotos[i].naturalWidth) mostrar(i);
  }

  const iniciar = () => { if (!pausado && !timer) timer = setInterval(proxima, TEMPO_FOTO); };
  const parar = () => { clearInterval(timer); timer = null; };

  // Botão de pausa (acessibilidade: conteúdo que se move precisa poder parar)
  botaoPausa.hidden = false;
  botaoPausa.addEventListener("click", () => {
    pausado = !pausado;
    botaoPausa.setAttribute("aria-pressed", String(pausado));
    botaoPausa.setAttribute("aria-label", pausado ? "Continuar a troca de fotos" : "Pausar a troca de fotos");
    botaoPausa.firstElementChild.textContent = pausado ? "▶" : "❚❚";
    pausado ? parar() : iniciar();
  });

  // Não gasta processamento com a aba escondida
  document.addEventListener("visibilitychange", () => (document.hidden ? parar() : iniciar()));

  iniciar();
}
