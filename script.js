import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
  onValue
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAKBpLrINoYOHcsaQ9pHeb00e06K4GGmYk",
  authDomain: "lista-enxoval-pedro-maju-48d3e.firebaseapp.com",
  databaseURL: "https://lista-enxoval-pedro-maju-48d3e-default-rtdb.firebaseio.com/",
  projectId: "lista-enxoval-pedro-maju-48d3e",
  storageBucket: "lista-enxoval-pedro-maju-48d3e.firebasestorage.app",
  messagingSenderId: "379961136744",
  appId: "1:379961136744:web:f07057545b75454cfdcddd"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const listaRef = ref(database, "listaEnxoval");

let carregandoDados = false;

function carregarImagemSemFundoVerde() {
  const canvas = document.getElementById("fotoCasalCanvas");

  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext("2d");

  const img = new Image();
  img.src = "pedroemaju.png";

  img.onload = function () {
    canvas.width = 300;
    canvas.height = 300;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const proporcao = Math.min(canvas.width / img.width, canvas.height / img.height);
    const largura = img.width * proporcao;
    const altura = img.height * proporcao;

    const x = (canvas.width - largura) / 2;
    const y = (canvas.height - altura) / 2;

    ctx.drawImage(img, x, y, largura, altura);

    const imagem = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const dados = imagem.data;

    for (let i = 0; i < dados.length; i += 4) {
      const r = dados[i];
      const g = dados[i + 1];
      const b = dados[i + 2];

      if (g > 120 && r < 110 && b < 130) {
        dados[i + 3] = 0;
      }
    }

    ctx.putImageData(imagem, 0, 0);
  };
}

function mudarCategoria(categoria) {
  const listas = document.querySelectorAll(".lista");
  const abas = document.querySelectorAll(".aba");
  const titulo = document.getElementById("tituloCategoria");

  listas.forEach((lista) => {
    lista.classList.remove("ativa");
  });

  abas.forEach((aba) => {
    aba.classList.remove("ativa");
  });

  const listaEscolhida = document.getElementById(categoria);
  const abaEscolhida = document.querySelector(`[data-categoria="${categoria}"]`);

  if (listaEscolhida) {
    listaEscolhida.classList.add("ativa");
  }

  if (abaEscolhida) {
    abaEscolhida.classList.add("ativa");
  }

  const nomes = {
    cozinha: "Cozinha",
    quarto: "Quarto",
    banheiro: "Banheiro",
    sala: "Sala",
    servicos: "Área de serviços"
  };

  if (titulo) {
    titulo.innerText = nomes[categoria];
  }
}

function coletarDadosDaTela() {
  const dados = {};

  document.querySelectorAll(".lista").forEach((lista) => {
    const categoria = lista.id;
    dados[categoria] = [];

    lista.querySelectorAll(".item").forEach((item) => {
      const checkbox = item.querySelector("input");
      const texto = item.querySelector("span");

      dados[categoria].push({
        texto: texto.innerText,
        marcado: checkbox.checked
      });
    });
  });

  return dados;
}

function aplicarDadosNaTela(dados) {
  if (!dados) {
    return;
  }

  carregandoDados = true;

  document.querySelectorAll(".lista").forEach((lista) => {
    const categoria = lista.id;

    if (!dados[categoria]) {
      return;
    }

    const itens = lista.querySelectorAll(".item");

    itens.forEach((item, index) => {
      if (dados[categoria][index]) {
        const texto = item.querySelector("span");
        const checkbox = item.querySelector("input");

        texto.innerText = dados[categoria][index].texto;
        checkbox.checked = dados[categoria][index].marcado;
      }
    });
  });

  carregandoDados = false;
}

async function salvarOnline() {
  const dados = coletarDadosDaTela();

  try {
    await set(listaRef, dados);
    mostrarMensagem("Lista salva online!");
  } catch (erro) {
    console.error("Erro ao salvar:", erro);
    alert("Erro ao salvar online. Verifique se o Realtime Database está ativado em modo de teste.");
  }
}

async function carregarOnlinePrimeiraVez() {
  try {
    const snapshot = await get(listaRef);

    if (snapshot.exists()) {
      aplicarDadosNaTela(snapshot.val());
    } else {
      await salvarOnline();
    }
  } catch (erro) {
    console.error("Erro ao carregar:", erro);
    alert("Erro ao carregar dados online. Verifique as regras do Firebase.");
  }
}

function acompanharMudancasOnline() {
  onValue(listaRef, (snapshot) => {
    if (snapshot.exists()) {
      aplicarDadosNaTela(snapshot.val());
    }
  });
}

function limparChecks() {
  document.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
    checkbox.checked = false;
  });

  salvarOnline();
}

function restaurarOriginal() {
  const confirmar = confirm("Deseja restaurar a lista original? As edições serão apagadas para todos.");

  if (confirmar) {
    const listasOriginais = criarListaOriginal();
    set(listaRef, listasOriginais);
  }
}

function criarListaOriginal() {
  return {
    cozinha: [
      { texto: "Geladeira", marcado: false },
      { texto: "Fogão", marcado: false },
      { texto: "Armário", marcado: false },
      { texto: "Micro-ondas", marcado: false },
      { texto: "Forno", marcado: false },
      { texto: "Mesa", marcado: false },
      { texto: "Jogo de panelas", marcado: false },
      { texto: "Liquidificador", marcado: false },
      { texto: "Panela de pressão", marcado: false },
      { texto: "Porta temperos", marcado: false },
      { texto: "Escorredor", marcado: false },
      { texto: "Peneira", marcado: false },
      { texto: "Jogo de talheres", marcado: false },
      { texto: "Jogo de copos", marcado: false },
      { texto: "Pratos", marcado: false },
      { texto: "Panos de prato", marcado: false },
      { texto: "Potes herméticos", marcado: false },
      { texto: "Kit de utensílios", marcado: false },
      { texto: "Air fryer", marcado: false },
      { texto: "Batedeira", marcado: false },
      { texto: "Tábua de cortar", marcado: false },
      { texto: "Xícaras", marcado: false },
      { texto: "Lixeira", marcado: false },
      { texto: "Kit de facas", marcado: false }
    ],
    quarto: [
      { texto: "Jogos de cama", marcado: false },
      { texto: "Cobre leitos", marcado: false },
      { texto: "Cortina", marcado: false },
      { texto: "Cama", marcado: false },
      { texto: "Guarda roupa", marcado: false },
      { texto: "Cabeceira", marcado: false },
      { texto: "Mesa de cabeceira", marcado: false },
      { texto: "Toalha de banho", marcado: false },
      { texto: "Toalha de rosto", marcado: false },
      { texto: "Cobertores", marcado: false },
      { texto: "Travesseiros", marcado: false },
      { texto: "Enchimento de almofada", marcado: false },
      { texto: "Capa de almofada", marcado: false },
      { texto: "Tapete", marcado: false },
      { texto: "Decoração", marcado: false },
      { texto: "", marcado: false },
      { texto: "", marcado: false }
    ],
    banheiro: [
      { texto: "Jogo de banheiro", marcado: false },
      { texto: "Escova sanitária", marcado: false },
      { texto: "Lixeira", marcado: false },
      { texto: "Tapetes de banheiro", marcado: false },
      { texto: "Chuveiro", marcado: false },
      { texto: "Suporte de banheiro", marcado: false },
      { texto: "Porta sabonete", marcado: false },
      { texto: "Porta escova de dentes", marcado: false },
      { texto: "Toalhas", marcado: false },
      { texto: "Espelho", marcado: false },
      { texto: "", marcado: false },
      { texto: "", marcado: false },
      { texto: "", marcado: false }
    ],
    sala: [
      { texto: "Sofá", marcado: false },
      { texto: "TV", marcado: false },
      { texto: "Painel de TV", marcado: false },
      { texto: "Tapete", marcado: false },
      { texto: "Decoração", marcado: false },
      { texto: "Quadros", marcado: false },
      { texto: "Enchimento de almofada", marcado: false },
      { texto: "Capa de almofada", marcado: false },
      { texto: "Manta de sofá", marcado: false },
      { texto: "Mesa de centro", marcado: false },
      { texto: "Cortina", marcado: false },
      { texto: "", marcado: false },
      { texto: "", marcado: false }
    ],
    servicos: [
      { texto: "Máquina de lavar", marcado: false },
      { texto: "Aspirador de pó", marcado: false },
      { texto: "Prendedor de roupa", marcado: false },
      { texto: "Porta prendedor de roupas", marcado: false },
      { texto: "Varal de roupas íntimas", marcado: false },
      { texto: "Vassoura", marcado: false },
      { texto: "Pá de lixo", marcado: false },
      { texto: "Rodo", marcado: false },
      { texto: "Balde", marcado: false },
      { texto: "Ferro de passar", marcado: false },
      { texto: "Mop", marcado: false },
      { texto: "Pano de chão", marcado: false },
      { texto: "Tapete", marcado: false },
      { texto: "", marcado: false },
      { texto: "", marcado: false }
    ]
  };
}

function mostrarMensagem(texto) {
  let mensagem = document.querySelector(".mensagem-salvo");

  if (!mensagem) {
    mensagem = document.createElement("div");
    mensagem.className = "mensagem-salvo";
    document.body.appendChild(mensagem);
  }

  mensagem.innerText = texto;
  mensagem.classList.add("aparecer");

  setTimeout(() => {
    mensagem.classList.remove("aparecer");
  }, 1800);
}

document.addEventListener("DOMContentLoaded", async () => {
  carregarImagemSemFundoVerde();

  await carregarOnlinePrimeiraVez();
  acompanharMudancasOnline();

  document.querySelectorAll(".aba").forEach((botao) => {
    botao.addEventListener("click", () => {
      mudarCategoria(botao.dataset.categoria);
    });
  });

  document.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      if (!carregandoDados) {
        salvarOnline();
      }
    });
  });

  document.querySelectorAll("[contenteditable='true']").forEach((campo) => {
    campo.addEventListener("blur", () => {
      if (!carregandoDados) {
        salvarOnline();
      }
    });

    campo.addEventListener("keydown", (evento) => {
      if (evento.key === "Enter") {
        evento.preventDefault();
        campo.blur();
      }
    });
  });

  const botaoSalvar = document.getElementById("salvar");
  const botaoLimpar = document.getElementById("limpar");
  const botaoRestaurar = document.getElementById("restaurar");

  if (botaoSalvar) {
    botaoSalvar.addEventListener("click", salvarOnline);
  }

  if (botaoLimpar) {
    botaoLimpar.addEventListener("click", limparChecks);
  }

  if (botaoRestaurar) {
    botaoRestaurar.addEventListener("click", restaurarOriginal);
  }
});
