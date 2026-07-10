// Ordem oficial do Script Mínimo
const FIELD_ORDER = [
  { name: "contrato",     question: "Possui contrato no mercado?" },
  { name: "quitado",      question: "Será quitado?" },
  { name: "entrada",      question: "Composição da entrada?" },
  { name: "renda",        question: "Composição da renda?" },
  { name: "estadoCivil",  question: "Estado Civil?" },
  { name: "declaraIR",    question: "Declara IR?" }
];

const state = {
  contrato: null,
  quitado: null,
  entrada: null,
  renda: null,
  estadoCivil: null,
  declaraIR: null
};

const outputBox = document.getElementById("output");
const copyBtn = document.getElementById("copyBtn");
const copyLabel = document.getElementById("copyLabel");
const celularInput = document.getElementById("celular");
const bancoInput = document.getElementById("banco");
const clearBtn = document.getElementById("clearBtn");

// Seleção das opções (toggle único por grupo)
document.querySelectorAll(".options").forEach(group => {
  const name = group.dataset.name;
  group.querySelectorAll(".opt").forEach(btn => {
    btn.addEventListener("click", () => {
      const alreadySelected = btn.classList.contains("selected");
      group.querySelectorAll(".opt").forEach(b => b.classList.remove("selected"));
      if (!alreadySelected) {
        btn.classList.add("selected");
        state[name] = btn.dataset.value;
      } else {
        state[name] = null;
      }
      render();
    });
  });
});

celularInput.addEventListener("input", render);
bancoInput.addEventListener("input", render);

clearBtn.addEventListener("click", () => {
  Object.keys(state).forEach(k => state[k] = null);
  document.querySelectorAll(".opt.selected").forEach(b => b.classList.remove("selected"));
  celularInput.value = "";
  bancoInput.value = "";
  render();
});

const INTRO_TEXT = "Olá, tudo bem? Solicito reanálise conforme as informações a seguir:";

function buildParts() {
  const parts = [];

  FIELD_ORDER.forEach(f => {
    if (state[f.name]) {
      parts.push(`${f.question} ${state[f.name]}`);
    }
  });

  const celular = celularInput.value.trim();
  const banco = bancoInput.value.trim();
  if (celular) {
    const bancoTxt = banco ? banco : "xxxx";
    parts.push(`Celular: ${celular} (Chave Pix vinculado - Banco ${bancoTxt})`);
  }

  return parts;
}

function buildText() {
  const parts = buildParts();
  if (parts.length === 0) return "";
  return `${INTRO_TEXT}\n\n${parts.join(" / ")}`;
}

function render() {
  const text = buildText();

  if (!text) {
    outputBox.innerHTML = `<span class="placeholder">Preencha os campos ao lado para gerar o texto do script mínimo.</span>`;
    return;
  }

  outputBox.textContent = text;
  resetCopyState();
}

function resetCopyState() {
  copyBtn.classList.remove("copied");
  copyLabel.textContent = "Copiar texto";
}

copyBtn.addEventListener("click", async () => {
  const text = buildText();
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // fallback para navegadores/contextos sem permissão de clipboard
    const temp = document.createElement("textarea");
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
  }

  copyBtn.classList.add("copied");
  copyLabel.textContent = "Copiado!";
  setTimeout(resetCopyState, 1800);
});

render();
