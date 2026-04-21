// Auto-redirige al login de UPeU sin mostrar la pantalla intermedia de Chainlit.
// Cliquea el primer botón OAuth disponible en la página de login.
(function () {
  var MAX_ATTEMPTS = 30;
  var INTERVAL_MS = 200;

  function clickOAuthButton() {
    // Chainlit renderiza botones OAuth con data-testid o dentro del form de login
    var buttons = document.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i];
      var text = btn.textContent || btn.innerText || "";
      // Coincide con cualquier variante del botón OAuth (upeu, Correo, etc.)
      if (
        text.toLowerCase().includes("upeu") ||
        text.toLowerCase().includes("correo") ||
        text.toLowerCase().includes("continuar con")
      ) {
        btn.click();
        return true;
      }
    }
    return false;
  }

  function tryClick(remaining) {
    if (remaining <= 0) return;
    if (!clickOAuthButton()) {
      setTimeout(function () { tryClick(remaining - 1); }, INTERVAL_MS);
    }
  }

  // Solo actuar en la página de login
  function onNavigate() {
    var path = window.location.pathname;
    if (path === "/login" || path === "/" || path === "") {
      tryClick(MAX_ATTEMPTS);
    }
  }

  // Arrancar cuando el DOM esté listo
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(function () { onNavigate(); }, 300);
    });
  } else {
    setTimeout(function () { onNavigate(); }, 300);
  }
})();
