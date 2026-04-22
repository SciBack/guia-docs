// ── GUIA UPeU — Login scripts ────────────────────────────────
// 1. Auto-redirige al OAuth de UPeU cuando el botón aparece.
// 2. Inyecta <video> de fondo en el panel derecho del login.
// ─────────────────────────────────────────────────────────────

(function () {
  "use strict";

  // ── 1. Auto-click OAuth ──────────────────────────────────────
  function clickOAuthButton() {
    var buttons = document.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) {
      var text = (buttons[i].textContent || "").toLowerCase();
      if (text.includes("upeu") || text.includes("correo") || text.includes("continuar con")) {
        buttons[i].click();
        return true;
      }
    }
    return false;
  }

  function isLoginPage() {
    return window.location.pathname === "/login" ||
           window.location.pathname === "/";
  }

  function startOAuthObserver() {
    if (!isLoginPage()) return;
    if (clickOAuthButton()) return;

    var observer = new MutationObserver(function () {
      if (clickOAuthButton()) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(function () { observer.disconnect(); }, 10000);
  }

  // ── 2. Inyección de <video> en panel derecho ─────────────────
  // El panel derecho es div.bg-muted.overflow-hidden (Chainlit 2.11.x)
  // Contiene un <img> estático que ocultamos con CSS y reemplazamos con video.
  function injectVideoPanel() {
    var panel = document.querySelector("div.bg-muted.overflow-hidden");
    if (!panel) return false;

    // Evitar doble inyección
    if (panel.querySelector(".guia-video")) return true;

    // Crear <video>
    var video = document.createElement("video");
    video.className = "guia-video";
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("aria-hidden", "true");

    var source = document.createElement("source");
    source.src = "/public/guia-bg.mp4";
    source.type = "video/mp4";
    video.appendChild(source);

    // Overlay oscuro + degradado izquierdo para que el card no compita con el video
    var overlay = document.createElement("div");
    overlay.className = "guia-video-overlay";

    panel.appendChild(video);
    panel.appendChild(overlay);

    // Intentar reproducir manualmente (algunos navegadores bloquean autoplay sin interacción)
    video.play().catch(function () {
      // Si falla, el fondo CSS se ve igual — degradamos con gracia
    });

    return true;
  }

  function startVideoObserver() {
    if (!isLoginPage()) return;
    if (injectVideoPanel()) return;

    var observer = new MutationObserver(function () {
      if (injectVideoPanel()) observer.disconnect();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(function () { observer.disconnect(); }, 15000);
  }

  // ── Bootstrap ────────────────────────────────────────────────
  function init() {
    startOAuthObserver();
    startVideoObserver();
  }

  if (document.body) {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
