// Ordem oficial do Script Mínimo
const FIELD_ORDER = [
  { name: "contrato",     question: "Possui contrato no mercado?" },
  { name: "quitado",      question: "Será quitado?" },
  { name: "entrada",      question: "Composição da entrada?" },
  { name: "renda",        question: "Composição da renda?" },
  { name: "estadoCivil",  question: "Estado Civil?" },
  { name: "declaraIR",    question: "Declara IR?" },
  { name: "experienciaCredito", question: "Possui experiência de crédito?" }
];

// Configuração dos campos condicionais (abrem um input extra quando uma resposta específica é escolhida)
const CONDITIONALS = {
  contrato: {
    triggerValue: "Sim",
    containerId: "contratoExtra",
    inputId: "contratoBanco",
    extraLabel: "Banco"
  },
  renda: {
    triggerValue: "Holerite + Outros",
    containerId: "rendaExtra",
    inputId: "rendaOutrosDesc",
    extraLabel: "Descrição"
  },
  estadoCivil: {
    triggerValue: "Casado(a)",
    containerId: "estadoCivilExtra",
    inputId: "estadoCivilEsposa",
    extraLabel: "Dados da esposa"
  },
  experienciaCredito: {
    triggerValue: "Sim",
    containerId: "experienciaCreditoExtra",
    inputId: "experienciaCreditoInfo",
    extraLabel: "Informação"
  }
};

const state = {
  contrato: null,
  quitado: null,
  entrada: null,
  renda: null,
  estadoCivil: null,
  declaraIR: null,
  experienciaCredito: null
};

const outputBox = document.getElementById("output");
const copyBtn = document.getElementById("copyBtn");
const copyLabel = document.getElementById("copyLabel");
const celularInput = document.getElementById("celular");
const bancoInput = document.getElementById("banco");
const checagemDataInput = document.getElementById("checagemData");
const checagemHoraInput = document.getElementById("checagemHora");
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

      updateConditional(name);
      render();
    });
  });
});

// Mostra/oculta o campo condicional de um grupo, de acordo com a resposta selecionada
function updateConditional(name) {
  const config = CONDITIONALS[name];
  if (!config) return;

  const container = document.getElementById(config.containerId);
  const input = document.getElementById(config.inputId);
  const shouldShow = state[name] === config.triggerValue;

  container.classList.toggle("open", shouldShow);

  if (!shouldShow) {
    input.value = "";
  }
}

// Liga os inputs condicionais à renderização do texto
Object.values(CONDITIONALS).forEach(config => {
  document.getElementById(config.inputId).addEventListener("input", render);
});

celularInput.addEventListener("input", render);
bancoInput.addEventListener("input", render);
checagemDataInput.addEventListener("input", render);
checagemHoraInput.addEventListener("input", render);

clearBtn.addEventListener("click", () => {
  Object.keys(state).forEach(k => state[k] = null);
  document.querySelectorAll(".opt.selected").forEach(b => b.classList.remove("selected"));
  document.querySelectorAll(".conditional").forEach(c => c.classList.remove("open"));
  document.querySelectorAll(".conditional .text-input").forEach(i => i.value = "");
  celularInput.value = "";
  bancoInput.value = "";
  checagemDataInput.value = "";
  checagemHoraInput.value = "";
  render();
});

const INTRO_TEXT = "Olá, tudo bem? Seguindo o formato de script mínimo, solicito reanálise conforme as informações abaixo:";

function buildParts() {
  const parts = [];

  FIELD_ORDER.forEach(f => {
    if (!state[f.name]) return;

    let line = `${f.question} ${state[f.name]}`;

    const config = CONDITIONALS[f.name];
    if (config && state[f.name] === config.triggerValue) {
      const extraValue = document.getElementById(config.inputId).value.trim();
      if (extraValue) {
        line += ` (${config.extraLabel}: ${extraValue})`;
      }
    }

    parts.push(line);
  });

  const celular = celularInput.value.trim();
  const banco = bancoInput.value.trim();
  if (celular) {
    const bancoTxt = banco ? banco : "xxxx";
    parts.push(`Celular: ${celular} (Chave Pix vinculado - Banco ${bancoTxt})`);
  }

  return parts;
}

function formatDateBR(isoDate) {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

function buildText() {
  const parts = buildParts();
  if (parts.length === 0) return "";

  let text = `${INTRO_TEXT}\n\n${parts.join("   /   ")}`;

  const data = checagemDataInput.value;
  const hora = checagemHoraInput.value;
  if (data && hora) {
    text += `\n\nChecagem realizada com a cliente pelo número celular do cadastro, em ${formatDateBR(data)} as ${hora} hs.`;
  }

  return text;
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
