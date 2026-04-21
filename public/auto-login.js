// Auto-redirige al login de UPeU en cuanto React monta el botón OAuth.
// Usa MutationObserver para detectar cuando Chainlit inserta el botón al DOM.
(function () {
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

  function startObserver() {
    if (!isLoginPage()) return;

    // Intento inmediato por si el botón ya está
    if (clickOAuthButton()) return;

    // MutationObserver: dispara cada vez que React cambia el DOM
    var observer = new MutationObserver(function () {
      if (clickOAuthButton()) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Seguro: desconectar después de 10 segundos
    setTimeout(function () { observer.disconnect(); }, 10000);
  }

  if (document.body) {
    startObserver();
  } else {
    document.addEventListener("DOMContentLoaded", startObserver);
  }
})();
