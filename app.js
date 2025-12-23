const AULA1_URL = "https://exemplo.com/aula1";
const WHATSAPP_NUMBER = "55SEUNUMERO";
const WHATSAPP_MESSAGE =
  "Olá! Eu concluí minha Arquitetura da Presença Digital e quero receber o link da Aula 1 + minha Persona Digital.";

const STORAGE_KEY = "mapaPresencaState";
const TOTAL_STEPS = 7;
const PLACEHOLDER_IMAGE =
  "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoIAAIAAAAcJaQAA3AA/vuUAAA=";

const identityQuestions = [
  {
    question: "O que mais te atrapalha hoje na hora de criar conteúdo?",
    options: [
      "Ter que aparecer em vídeo o tempo todo",
      "Gravar várias vezes até “ficar bom”",
      "Criar conteúdo sem saber se alguém vai ver",
      "Não conseguir manter frequência",
      "Depender da minha disposição todos os dias",
    ],
  },
  {
    question: "O que você já cansou de fazer para tentar crescer na internet?",
    options: [
      "Aparecer constantemente",
      "Postar todos os dias",
      "Ficar seguindo tendência",
      "Trabalhar mais horas",
      "Viver correndo atrás de algoritmo",
    ],
  },
  {
    question: "O que você queria que fosse mais fácil quando pensa em criar conteúdo?",
    options: [
      "Continuar funcionando mesmo quando eu não posto",
      "Me representar sem eu precisar aparecer",
      "Reduzir o tempo que gasto criando conteúdo",
      "Não depender da minha energia todo dia",
      "Funcionar mesmo em semanas corridas",
    ],
  },
];

const memoryStorage = new Map();
let storageAvailable = true;

function getStorageItem(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    storageAvailable = false;
    return memoryStorage.get(key) ?? null;
  }
}

function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    storageAvailable = false;
    memoryStorage.set(key, value);
  }
}

const fallbackPersonas = [
  {
    id: "p01",
    name: "Arquiteto Silencioso",
    description:
      "Presença técnica, consistente e de baixa exposição, guiada por precisão e foco.",
    image: "assets/personas/p01.webp",
    tags: {
      formats: ["text", "visual"],
      pace: "low",
      involvement: "minimal",
    },
  },
  {
    id: "p02",
    name: "Narrador Preciso",
    description: "Voz clara, narrativa enxuta e autoridade sem exageros.",
    image: "assets/personas/p02.webp",
    tags: {
      formats: ["audio", "text"],
      pace: "moderate",
      involvement: "minimal",
    },
  },
  {
    id: "p03",
    name: "Diretor de Ritmo",
    description: "Conteúdo em cadência moderada, com estrutura leve e decisão firme.",
    image: "assets/personas/p03.webp",
    tags: {
      formats: ["video", "text"],
      pace: "moderate",
      involvement: "moderate",
    },
  },
  {
    id: "p04",
    name: "Curador Visual",
    description: "Estética silenciosa, sinais visuais consistentes e pouca fricção.",
    image: "assets/personas/p04.webp",
    tags: {
      formats: ["visual", "text"],
      pace: "low",
      involvement: "moderate",
    },
  },
  {
    id: "p05",
    name: "Mentor Contido",
    description: "Ensino objetivo, presença controlada e foco em clareza.",
    image: "assets/personas/p05.webp",
    tags: {
      formats: ["video", "text"],
      pace: "low",
      involvement: "minimal",
    },
  },
  {
    id: "p06",
    name: "Sintetizador",
    description:
      "Resumo estratégico, conteúdo leve e entrega contínua sem desgaste.",
    image: "assets/personas/p06.webp",
    tags: {
      formats: ["text", "audio"],
      pace: "moderate",
      involvement: "minimal",
    },
  },
  {
    id: "p07",
    name: "Cartógrafo de Referência",
    description: "Presença visual estável, escolhas claras e mínima exposição.",
    image: "assets/personas/p07.webp",
    tags: {
      formats: ["visual", "audio"],
      pace: "low",
      involvement: "minimal",
    },
  },
  {
    id: "p08",
    name: "Moderador de Conversa",
    description:
      "Contato humano controlado com ritmo consistente e previsível.",
    image: "assets/personas/p08.webp",
    tags: {
      formats: ["audio", "video"],
      pace: "moderate",
      involvement: "moderate",
    },
  },
  {
    id: "p09",
    name: "Analista de Campo",
    description: "Conteúdo analítico e presença firme, sem excesso de volume.",
    image: "assets/personas/p09.webp",
    tags: {
      formats: ["text", "video"],
      pace: "moderate",
      involvement: "minimal",
    },
  },
  {
    id: "p10",
    name: "Arquiteta de Ecos",
    description:
      "Foco em repetição elegante e narrativa visual consistente.",
    image: "assets/personas/p10.webp",
    tags: {
      formats: ["visual", "video"],
      pace: "moderate",
      involvement: "moderate",
    },
  },
  {
    id: "p11",
    name: "Curador de Ritmo Baixo",
    description: "Presença discreta e consciente, com impacto gradual.",
    image: "assets/personas/p11.webp",
    tags: {
      formats: ["text", "audio"],
      pace: "low",
      involvement: "minimal",
    },
  },
  {
    id: "p12",
    name: "Atlas Premium",
    description: "Persona ampla para qualquer cenário quando o match não é preciso.",
    image: "assets/personas/p12.webp",
    tags: {
      formats: ["video", "text", "audio", "visual"],
      pace: "moderate",
      involvement: "moderate",
    },
  },
];

const defaultState = {
  identityAnswers: [],
  identityStep: 0,
  formats: [],
  pace: "",
  involvement: "",
  persona: null,
  email: "",
  currentScreen: 0,
};

let state = loadState();
let personas = [];

const screens = Array.from(document.querySelectorAll(".screen"));
const progressIndicator = document.getElementById("progress-indicator");
const toast = document.getElementById("toast");
const loadingOverlay = document.getElementById("loading-overlay");

const startButton = document.getElementById("start-button");
const identityQuestion = document.getElementById("identity-question");
const identityOptions = document.getElementById("identity-options");
const identityContinue = document.getElementById("identity-continue");

const formatCards = document.querySelectorAll("[data-format]");
const formatsContinue = document.getElementById("formats-continue");

const paceOptions = document.querySelectorAll("[data-pace]");
const involvementOptions = document.querySelectorAll("[data-involvement]");
const structureContinue = document.getElementById("structure-continue");

const composeButton = document.getElementById("compose-persona");
const personaImage = document.getElementById("persona-image");
const personaName = document.getElementById("persona-name");
const personaDescription = document.getElementById("persona-description");
const personaContinue = document.getElementById("persona-continue");

const emailInput = document.getElementById("email-input");
const emailContinue = document.getElementById("email-continue");

const aula1Link = document.getElementById("aula1-link");
const whatsappLink = document.getElementById("whatsapp-link");
const resetButton = document.getElementById("reset-button");

function loadState() {
  const stored = getStorageItem(STORAGE_KEY);
  if (!stored) return { ...defaultState };
  try {
    const parsed = JSON.parse(stored);
    const next = { ...defaultState, ...parsed };
    const maxStep = identityQuestions.length - 1;
    if (Number.isNaN(Number(next.identityStep))) {
      next.identityStep = 0;
    }
    if (next.identityStep < 0) next.identityStep = 0;
    if (next.identityStep > maxStep) next.identityStep = maxStep;
    if (!Array.isArray(next.identityAnswers)) next.identityAnswers = [];
    return next;
  } catch (error) {
    return { ...defaultState };
  }
}

function saveState() {
  setStorageItem(STORAGE_KEY, JSON.stringify(state));
}

function showScreen(index) {
  const bounded = Math.max(0, Math.min(index, screens.length - 1));
  screens.forEach((screen, idx) => {
    screen.classList.toggle("is-active", idx === bounded);
  });
  state.currentScreen = bounded;
  document.body.className = `stage-${bounded}`;
  if (bounded === 1) {
    updateIdentityUI();
  }
  if (bounded === 0) {
    progressIndicator.textContent = "";
  } else {
    progressIndicator.textContent = `Etapa ${bounded}/${TOTAL_STEPS}`;
  }
  saveState();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 1800);
}

function updateIdentityUI() {
  if (!identityOptions || !identityQuestion) return;
  const maxStep = identityQuestions.length - 1;
  const step =
    typeof state.identityStep === "number" && state.identityStep >= 0
      ? Math.min(state.identityStep, maxStep)
      : 0;
  state.identityStep = step;
  const current = identityQuestions[step] || identityQuestions[0];
  identityQuestion.textContent = current.question;
  identityOptions.innerHTML = "";
  current.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "identity-option";
    button.textContent = option;
    button.dataset.value = option;
    button.classList.toggle(
      "is-selected",
      state.identityAnswers[step] === option
    );
    button.addEventListener("click", () => {
      state.identityAnswers[step] = option;
      saveState();
      updateIdentityUI();
    });
    identityOptions.appendChild(button);
  });
}

function updateFormatsUI() {
  formatCards.forEach((card) => {
    const format = card.dataset.format;
    card.classList.toggle("is-selected", state.formats.includes(format));
  });
  formatsContinue.disabled = state.formats.length !== 2;
}

function updateStructureUI() {
  paceOptions.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.pace === state.pace);
  });
  involvementOptions.forEach((button) => {
    button.classList.toggle(
      "is-selected",
      button.dataset.involvement === state.involvement
    );
  });
  structureContinue.disabled = !(state.pace && state.involvement);
}

function updatePersonaUI() {
  if (!state.persona) return;
  personaImage.src = state.persona.image || PLACEHOLDER_IMAGE;
  personaImage.onerror = () => {
    personaImage.src = PLACEHOLDER_IMAGE;
  };
  personaName.textContent = state.persona.name;
  personaDescription.textContent = state.persona.description;
}

function updateLinks() {
  aula1Link.href = AULA1_URL;
  const encoded = encodeURIComponent(WHATSAPP_MESSAGE);
  whatsappLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

function matchPersona() {
  if (!personas.length) return null;
  let bestScore = -1;
  let best = [];
  personas.forEach((persona) => {
    let score = 0;
    const formats = persona.tags.formats || [];
    state.formats.forEach((format) => {
      if (formats.includes(format)) score += 2;
    });
    if (persona.tags.pace === state.pace) score += 2;
    if (persona.tags.involvement === state.involvement) score += 2;
    if (score > bestScore) {
      bestScore = score;
      best = [persona];
    } else if (score === bestScore) {
      best.push(persona);
    }
  });
  if (!best.length) return personas[0];
  return best[Math.floor(Math.random() * best.length)];
}

function hydrateFromState() {
  updateIdentityUI();
  updateFormatsUI();
  updateStructureUI();
  updatePersonaUI();
  emailInput.value = state.email || "";
  personaContinue.disabled = true;
  if (state.currentScreen === 5 && state.persona) {
    setTimeout(() => {
      personaContinue.disabled = false;
    }, 1200);
  }
  showScreen(state.currentScreen || 0);
}

startButton.addEventListener("click", () => {
  updateIdentityUI();
  showScreen(1);
});

identityContinue.addEventListener("click", () => {
  const answer = state.identityAnswers[state.identityStep];
  if (!answer) {
    showToast("Escolha uma opção antes de continuar.");
    return;
  }
  state.identityStep += 1;
  if (state.identityStep >= identityQuestions.length) {
    saveState();
    showScreen(2);
    return;
  }
  saveState();
  updateIdentityUI();
});

formatCards.forEach((card) => {
  card.addEventListener("click", () => {
    const format = card.dataset.format;
    if (state.formats.includes(format)) {
      state.formats = state.formats.filter((item) => item !== format);
    } else {
      if (state.formats.length >= 2) {
        showToast("Excesso enfraquece a arquitetura.");
        return;
      }
      state.formats = [...state.formats, format];
    }
    saveState();
    updateFormatsUI();
  });
});

formatsContinue.addEventListener("click", () => {
  showScreen(3);
});

paceOptions.forEach((button) => {
  button.addEventListener("click", () => {
    state.pace = button.dataset.pace;
    saveState();
    updateStructureUI();
  });
});

involvementOptions.forEach((button) => {
  button.addEventListener("click", () => {
    state.involvement = button.dataset.involvement;
    saveState();
    updateStructureUI();
  });
});

structureContinue.addEventListener("click", () => {
  showScreen(4);
});

composeButton.addEventListener("click", async () => {
  loadingOverlay.classList.add("is-visible");
  if (!personas.length) {
    await loadPersonas();
  }
  const delay = 1600;
  setTimeout(() => {
    state.persona = matchPersona() || personas.find((p) => p.id === "p12");
    saveState();
    updatePersonaUI();
    loadingOverlay.classList.remove("is-visible");
    showScreen(5);
    personaContinue.disabled = true;
    setTimeout(() => {
      personaContinue.disabled = false;
    }, 2000);
  }, delay);
});

personaContinue.addEventListener("click", () => {
  showScreen(6);
});

emailInput.addEventListener("input", (event) => {
  state.email = event.target.value;
  saveState();
});

emailContinue.addEventListener("click", () => {
  const email = emailInput.value.trim();
  if (!email || !email.includes("@")) {
    showToast("Digite um e-mail válido para continuar.");
    return;
  }
  state.email = email;
  saveState();
  showScreen(7);
});

resetButton.addEventListener("click", () => {
  state = { ...defaultState };
  saveState();
  updateIdentityUI();
  updateFormatsUI();
  updateStructureUI();
  showScreen(0);
});

async function loadPersonas() {
  try {
    const response = await fetch("./data/personas.json");
    if (!response.ok) {
      personas = fallbackPersonas;
      return;
    }
    personas = await response.json();
  } catch (error) {
    personas = fallbackPersonas;
  }
}

updateLinks();
loadPersonas();
hydrateFromState();
