const STORAGE_KEY = "lista-enxoval-pedro-maju-v2";

function carregarImagemSemFundoVerde() {
  const canvas = document.getElementById("fotoCasalCanvas");
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

  document.getElementById(categoria).classList.add("ativa");
  document.querySelector(`[data-categoria="${categoria}"]`).classList.add("ativa");

  const nomes = {
    cozinha: "Cozinha",
    quarto: "Quarto",
    banheiro: "Banheiro",
    sala: "Sala",
    servicos: "Área de serviços"
  };

  titulo.innerText = nomes[categoria];
}

function salvarDados() {
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

  localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
}

function carregarDados() {
  const dadosSalvos = localStorage.getItem(STORAGE_KEY);

  if (!dadosSalvos) {
    return;
  }

  const dados = JSON.parse(dadosSalvos);

  document.querySelectorAll(".lista").forEach((lista) => {
    const categoria = lista.id;

    if (!dados[categoria]) {
      return;
    }

    const itens = lista.querySelectorAll(".item");

    itens.forEach((item, index) => {
      if (dados[categoria][index]) {
        item.querySelector("span").innerText = dados[categoria][index].texto;
        item.querySelector("input").checked = dados[categoria][index].marcado;
      }
    });
  });
}

function limparChecks() {
  document.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
    checkbox.checked = false;
  });

  salvarDados();
}

function restaurarOriginal() {
  const confirmar = confirm("Deseja restaurar a lista original? As edições serão apagadas.");

  if (confirmar) {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  carregarImagemSemFundoVerde();
  carregarDados();

  document.querySelectorAll(".aba").forEach((botao) => {
    botao.addEventListener("click", () => {
      mudarCategoria(botao.dataset.categoria);
    });
  });

  document.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
    checkbox.addEventListener("change", salvarDados);
  });

  document.querySelectorAll("[contenteditable='true']").forEach((campo) => {
    campo.addEventListener("input", salvarDados);
    campo.addEventListener("blur", salvarDados);
  });

  document.getElementById("salvar").addEventListener("click", () => {
    salvarDados();
    alert("Lista salva!");
  });

  document.getElementById("limpar").addEventListener("click", limparChecks);
  document.getElementById("restaurar").addEventListener("click", restaurarOriginal);
});
