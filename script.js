const STORAGE_KEY = "enxoval-pedro-maju";

// Remove o fundo verde da imagem pedroemaju.png usando canvas
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

      // Detecta verde forte do fundo e deixa transparente
      if (g > 120 && r < 100 && b < 120) {
        dados[i + 3] = 0;
      }
    }

    ctx.putImageData(imagem, 0, 0);
  };
}

function salvarDados() {
  const itens = [];

  document.querySelectorAll(".bloco li").forEach((li) => {
    const checkbox = li.querySelector("input");
    const texto = li.querySelector("span");

    itens.push({
      texto: texto.innerText.trim(),
      marcado: checkbox.checked
    });
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
}

function carregarDados() {
  const dadosSalvos = localStorage.getItem(STORAGE_KEY);

  if (!dadosSalvos) {
    return;
  }

  const itens = JSON.parse(dadosSalvos);
  const elementos = document.querySelectorAll(".bloco li");

  elementos.forEach((li, index) => {
    if (itens[index]) {
      li.querySelector("span").innerText = itens[index].texto;
      li.querySelector("input").checked = itens[index].marcado;
    }
  });
}

function limparMarcacoes() {
  document.querySelectorAll(".bloco input[type='checkbox']").forEach((checkbox) => {
    checkbox.checked = false;
  });

  salvarDados();
}

function restaurarOriginal() {
  const confirmar = confirm("Tem certeza que deseja restaurar a lista original? As edições serão apagadas.");

  if (confirmar) {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  carregarImagemSemFundoVerde();
  carregarDados();

  document.querySelectorAll(".bloco input[type='checkbox']").forEach((checkbox) => {
    checkbox.addEventListener("change", salvarDados);
  });

  document.querySelectorAll(".bloco span").forEach((span) => {
    span.addEventListener("input", salvarDados);
    span.addEventListener("blur", salvarDados);
  });

  document.getElementById("salvar").addEventListener("click", () => {
    salvarDados();
    alert("Alterações salvas!");
  });

  document.getElementById("limpar").addEventListener("click", limparMarcacoes);
  document.getElementById("restaurar").addEventListener("click", restaurarOriginal);
});