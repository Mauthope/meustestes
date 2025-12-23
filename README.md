# Mapa Interativo — Arquitetura da Presença Digital

SPA mobile-first em HTML/CSS/JS puro, pronta para GitHub Pages.

## Rodar localmente

Use qualquer servidor estático. Exemplo com Python:

```bash
python -m http.server 8000
```

Acesse `http://localhost:8000`.

## Publicar no GitHub Pages

1. Suba este repositório para o GitHub.
2. No repositório, abra **Settings → Pages**.
3. Em **Branch**, selecione `main` e a pasta raiz (`/`).
4. Salve. Em alguns minutos, a URL pública ficará disponível.

## Substituir imagens das personas

As imagens `.png` não são incluídas no repositório para evitar problemas com binários.
Para inserir suas imagens:

1. Prepare imagens `.png` (ex: `p01.png`, `p02.png`, ...).
2. Coloque os arquivos em `assets/personas/` mantendo os nomes.
3. Ajuste os caminhos e descrições no arquivo `data/personas.json` se necessário.

Enquanto as imagens não existem, o app usa um placeholder embutido.

## Configurar AULA1_URL e WhatsApp

Abra `app.js` e edite:

```js
const AULA1_URL = "https://seulink.com/aula1";
const WHATSAPP_NUMBER = "55SEUNUMERO";
```

> O número deve estar no formato internacional somente com dígitos (ex: `5511999999999`).

## Conectar captura de e-mail (Mailchimp/Brevo)

O HTML já tem um bloco pronto para embed. No `index.html`, localize:

```html
<div id="email-embed" class="note-block">
  Cole aqui um embed de formulário (Mailchimp/Brevo) se quiser captura real.
</div>
```

Substitua esse bloco pelo script/embed do seu serviço. Se preferir não usar embed, o e-mail fica salvo apenas no `localStorage`.

## Estado e reinício

As escolhas ficam salvas no `localStorage`. O botão **Reiniciar** limpa o estado e volta ao início.
