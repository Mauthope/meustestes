const VIDEO_URL = "https://seuvideo.com";
const WHATSAPP_NUMBER = "5549988971962";
const WHATSAPP_MESSAGE =
  "Olá! Eu confirmei meu e-mail e quero continuar minha presença digital.";

const SUPABASE_URL = "https://SEU-PROJETO.supabase.co";
const SUPABASE_ANON_KEY = "SUA_SUPABASE_ANON_KEY";
const SUPABASE_TABLE = "leads";

const form = document.getElementById("email-form");
const emailInput = document.getElementById("email-input");
const status = document.getElementById("status");
const actions = document.getElementById("actions");
const thumbnail = document.getElementById("thumbnail");
const videoWrapper = document.getElementById("video-wrapper");
const videoLink = document.getElementById("video-link");
const whatsappLink = document.getElementById("whatsapp-link");

function supabaseConfigured() {
  return (
    SUPABASE_URL !== "https://SEU-PROJETO.supabase.co" &&
    SUPABASE_ANON_KEY !== "SUA_SUPABASE_ANON_KEY"
  );
}

function updateLinks() {
  videoLink.href = VIDEO_URL;
  const encoded = encodeURIComponent(WHATSAPP_MESSAGE);
  whatsappLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
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

function unlockAccess() {
  thumbnail.classList.add("hidden");
  videoWrapper.classList.remove("hidden");
  actions.classList.remove("hidden");
}

function setStatus(message) {
  status.textContent = message;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = emailInput.value.trim();
  if (!email || !email.includes("@")) {
    setStatus("Digite um e-mail válido para liberar o acesso.");
    return;
  }

  setStatus("Validando e liberando acesso...");
  const result = await saveEmailToSupabase(email);

  if (result.ok || result.skipped) {
    setStatus("Acesso liberado. O vídeo está disponível abaixo.");
    unlockAccess();
    form.querySelector("button").disabled = true;
    emailInput.disabled = true;
    return;
  }

  setStatus("Não foi possível salvar agora. Tente novamente em instantes.");
});

updateLinks();
