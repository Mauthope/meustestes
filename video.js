const WHATSAPP_NUMBER = "5549988971962";
const WHATSAPP_MESSAGE =
  "Olá! Eu confirmei meu e-mail e quero continuar minha presença digital.";

const whatsappLink = document.getElementById("whatsapp-link");
const videoFrame = document.querySelector("iframe");

function updateLinks() {
  const encoded = encodeURIComponent(WHATSAPP_MESSAGE);
  whatsappLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

function getVideoUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("video");
}

function setVideoSource() {
  const url = getVideoUrl();
  if (!url || !videoFrame) return;
  videoFrame.src = url;
}

updateLinks();
setVideoSource();
