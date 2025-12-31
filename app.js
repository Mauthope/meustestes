const VIDEO_URL = "https://www.youtube.com/embed/dQw4w9WgXcQ";
const WHATSAPP_NUMBER = "5549988971962";
const WHATSAPP_MESSAGE =
  "Olá! Eu confirmei meu e-mail e quero continuar minha presença digital.";
const LEARN_MORE_URL = "https://seulink.com";

const SUPABASE_URL = "https://SEU-PROJETO.supabase.co";
const SUPABASE_ANON_KEY = "SUA_SUPABASE_ANON_KEY";
const SUPABASE_TABLE = "leads";
const COUNTER_KEY = "apd_access_count";
const COUNTER_SESSION_KEY = "apd_access_session";
const MAX_SLOTS = 100;

const emailInput = document.getElementById("email-input");
const status = document.getElementById("status");
const watchButton = document.getElementById("watch-button");
const counterBadge = document.getElementById("neon-counter");
const thumbnail = document.getElementById("thumbnail");
const videoWrapper = document.getElementById("video-wrapper");
const videoIframe = document.getElementById("video-iframe");
const actions = document.getElementById("actions");
const whatsappLink = document.getElementById("whatsapp-link");
const learnMoreLink = document.getElementById("learn-more");

function supabaseConfigured() {
  return (
    SUPABASE_URL !== "https://SEU-PROJETO.supabase.co" &&
    SUPABASE_ANON_KEY !== "SUA_SUPABASE_ANON_KEY"
  );
}

function updateLinks() {
  const encoded = encodeURIComponent(WHATSAPP_MESSAGE);
  whatsappLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
  learnMoreLink.href = LEARN_MORE_URL;
}

async function saveEmailToSupabase(email) {
  if (!supabaseConfigured()) {
    return { ok: false, skipped: true };
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ email, created_at: new Date().toISOString() }),
      }
    );

    if (!response.ok) {
      return { ok: false, skipped: false };
    }

    return { ok: true, skipped: false };
  } catch (error) {
    return { ok: false, skipped: false };
  }
}

function setStatus(message) {
  status.textContent = message;
}

function isValidEmail(value) {
  return value.includes("@") && value.includes(".");
}

function getStoredCount() {
  try {
    const stored = localStorage.getItem(COUNTER_KEY);
    const parsed = Number.parseInt(stored, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  } catch (error) {
    return 0;
  }
}

function setStoredCount(value) {
  try {
    localStorage.setItem(COUNTER_KEY, String(value));
  } catch (error) {
    return;
  }
}

function hasSessionCounted() {
  try {
    return sessionStorage.getItem(COUNTER_SESSION_KEY) === "true";
  } catch (error) {
    return false;
  }
}

function setSessionCounted() {
  try {
    sessionStorage.setItem(COUNTER_SESSION_KEY, "true");
  } catch (error) {
    return;
  }
}

function updateCounterBadge() {
  if (!counterBadge) return;
  counterBadge.textContent = "Você é um dos 100 primeiros";
}

function initAccessCounter() {
  let count = getStoredCount();
  if (!hasSessionCounted()) {
    count += 1;
    setStoredCount(count);
    setSessionCounted();
  }
  updateCounterBadge(count);
}

function unlockVideo() {
  thumbnail.classList.add("hidden");
  videoWrapper.classList.remove("hidden");
  actions.classList.remove("hidden");
  videoIframe.src = VIDEO_URL;
}

async function handleWatchClick() {
  const email = emailInput.value.trim();
  if (!email || !isValidEmail(email)) {
    setStatus("Digite um e-mail válido para liberar o acesso.");
    return;
  }

  setStatus("Liberando acesso...");
  const result = await saveEmailToSupabase(email);
  if (!result.ok && !result.skipped) {
    setStatus("Não foi possível salvar agora. Tente novamente.");
    return;
  }

  setStatus("Acesso liberado. Assista ao vídeo abaixo.");
  unlockVideo();
}

watchButton.addEventListener("click", () => {
  handleWatchClick();
});

emailInput.addEventListener("input", () => {
  setStatus("");
});

updateLinks();
initAccessCounter();
