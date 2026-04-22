// ── GUIA UPeU — Login scripts ────────────────────────────────
// 1. Auto-redirige al OAuth de UPeU cuando el botón aparece.
// 2. Inyecta SVG inline del radar para que CSS pueda animarlo.
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

  // ── 2. Inyección de SVG inline del radar ─────────────────────
  // El SVG de upeu-bg.svg se sirve como <img> — CSS no puede
  // animar sus internos. Reemplazamos el img con SVG inline
  // y añadimos data-attributes para que CSS lo anime.
  function injectRadarSVG() {
    var panel = document.querySelector("div.grid > div:last-child");
    if (!panel) return;

    var img = panel.querySelector("img");
    if (!img) return;

    // Si ya inyectamos, no repetir
    if (panel.querySelector(".guia-radar")) return;

    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    svg.classList.add("guia-radar");
    svg.setAttribute("xmlns", svgNS);
    svg.setAttribute("viewBox", "0 0 800 900");
    svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
    svg.setAttribute("aria-hidden", "true");

    // ── Definiciones: gradientes y máscaras ──────────────────
    var defs = document.createElementNS(svgNS, "defs");

    function makeLinearGradient(id, stops) {
      var g = document.createElementNS(svgNS, "linearGradient");
      g.setAttribute("id", id);
      g.setAttribute("x1", "0%"); g.setAttribute("y1", "0%");
      g.setAttribute("x2", "60%"); g.setAttribute("y2", "100%");
      stops.forEach(function (s) {
        var stop = document.createElementNS(svgNS, "stop");
        stop.setAttribute("offset", s.offset);
        stop.setAttribute("stop-color", s.color);
        if (s.opacity !== undefined) stop.setAttribute("stop-opacity", s.opacity);
        g.appendChild(stop);
      });
      return g;
    }

    function makeRadialGradient(id, cx, cy, r, stops) {
      var g = document.createElementNS(svgNS, "radialGradient");
      g.setAttribute("id", id);
      g.setAttribute("cx", cx); g.setAttribute("cy", cy); g.setAttribute("r", r);
      stops.forEach(function (s) {
        var stop = document.createElementNS(svgNS, "stop");
        stop.setAttribute("offset", s.offset);
        stop.setAttribute("stop-color", s.color);
        stop.setAttribute("stop-opacity", s.opacity);
        g.appendChild(stop);
      });
      return g;
    }

    function makePattern(id) {
      var p = document.createElementNS(svgNS, "pattern");
      p.setAttribute("id", id);
      p.setAttribute("x", "0"); p.setAttribute("y", "0");
      p.setAttribute("width", "28"); p.setAttribute("height", "28");
      p.setAttribute("patternUnits", "userSpaceOnUse");
      var c = document.createElementNS(svgNS, "circle");
      c.setAttribute("cx", "14"); c.setAttribute("cy", "14"); c.setAttribute("r", "1.3");
      c.setAttribute("fill", "#2ea3f2"); c.setAttribute("opacity", "0.22");
      p.appendChild(c);
      return p;
    }

    defs.appendChild(makeLinearGradient("g-bg", [
      { offset: "0%",   color: "#001929" },
      { offset: "100%", color: "#023052" }
    ]));
    defs.appendChild(makeRadialGradient("g-glow1", "35%", "28%", "55%", [
      { offset: "0%",   color: "#2ea3f2", opacity: "0.13" },
      { offset: "100%", color: "#2ea3f2", opacity: "0" }
    ]));
    defs.appendChild(makeRadialGradient("g-glow2", "72%", "78%", "40%", [
      { offset: "0%",   color: "#f8a900", opacity: "0.06" },
      { offset: "100%", color: "#f8a900", opacity: "0" }
    ]));
    defs.appendChild(makeRadialGradient("g-dotfade", "50%", "45%", "48%", [
      { offset: "0%",   color: "white", opacity: "1" },
      { offset: "75%",  color: "white", opacity: "0" }
    ]));
    defs.appendChild(makePattern("g-dots"));

    var mask = document.createElementNS(svgNS, "mask");
    mask.setAttribute("id", "g-mdots");
    var maskRect = document.createElementNS(svgNS, "rect");
    maskRect.setAttribute("width", "800"); maskRect.setAttribute("height", "900");
    maskRect.setAttribute("fill", "url(#g-dotfade)");
    mask.appendChild(maskRect);
    defs.appendChild(mask);

    svg.appendChild(defs);

    // ── Capas de fondo ───────────────────────────────────────
    function makeRect(fill, extra) {
      var r = document.createElementNS(svgNS, "rect");
      r.setAttribute("width", "800"); r.setAttribute("height", "900");
      r.setAttribute("fill", fill);
      if (extra) Object.keys(extra).forEach(function (k) { r.setAttribute(k, extra[k]); });
      return r;
    }

    svg.appendChild(makeRect("url(#g-bg)"));
    svg.appendChild(makeRect("url(#g-glow1)"));
    svg.appendChild(makeRect("url(#g-glow2)"));
    svg.appendChild(makeRect("url(#g-dots)", { mask: "url(#g-mdots)" }));

    // ── Anillos concéntricos con data-ring ──────────────────
    // Los data-ring="N" son los hooks que CSS usa para las animaciones
    var rings = [
      { r: "120", sw: "0.8", op: "0.20", ring: "1" },
      { r: "200", sw: "0.7", op: "0.16", ring: "2" },
      { r: "290", sw: "0.6", op: "0.12", ring: "3" },
      { r: "390", sw: "0.5", op: "0.08", ring: "4" }
    ];

    rings.forEach(function (cfg) {
      var c = document.createElementNS(svgNS, "circle");
      c.setAttribute("cx", "400"); c.setAttribute("cy", "420");
      c.setAttribute("r", cfg.r);
      c.setAttribute("fill", "none");
      c.setAttribute("stroke", "#2ea3f2");
      c.setAttribute("stroke-width", cfg.sw);
      c.setAttribute("opacity", cfg.op);
      c.setAttribute("data-ring", cfg.ring);
      svg.appendChild(c);
    });

    // ── Punto central (origen del sonar) ────────────────────
    var center = document.createElementNS(svgNS, "circle");
    center.setAttribute("cx", "400"); center.setAttribute("cy", "420");
    center.setAttribute("r", "5");
    center.setAttribute("fill", "#2ea3f2");
    center.setAttribute("opacity", "0.55");
    center.setAttribute("data-center", "true");
    svg.appendChild(center);

    // ── Anillo interior del crosshair (el que gira) ──────────
    var crosshair = document.createElementNS(svgNS, "circle");
    crosshair.setAttribute("cx", "400"); crosshair.setAttribute("cy", "420");
    crosshair.setAttribute("r", "12");
    crosshair.setAttribute("fill", "none");
    crosshair.setAttribute("stroke", "#2ea3f2");
    crosshair.setAttribute("stroke-width", "1.0");
    crosshair.setAttribute("stroke-dasharray", "4 8");
    crosshair.setAttribute("opacity", "0.35");
    crosshair.setAttribute("data-crosshair", "true");
    svg.appendChild(crosshair);

    // ── Corner accents ───────────────────────────────────────
    function makeLine(x1, y1, x2, y2, stroke, op) {
      var l = document.createElementNS(svgNS, "line");
      l.setAttribute("x1", x1); l.setAttribute("y1", y1);
      l.setAttribute("x2", x2); l.setAttribute("y2", y2);
      l.setAttribute("stroke", stroke);
      l.setAttribute("stroke-width", "2");
      l.setAttribute("opacity", op);
      return l;
    }

    svg.appendChild(makeLine("0",   "0",   "80",  "0",   "#2ea3f2", "0.35"));
    svg.appendChild(makeLine("0",   "0",   "0",   "80",  "#2ea3f2", "0.35"));
    svg.appendChild(makeLine("800", "900", "720", "900", "#f8a900", "0.22"));
    svg.appendChild(makeLine("800", "900", "800", "820", "#f8a900", "0.22"));
    svg.appendChild(makeLine("0",   "450", "180", "450", "#2ea3f2", "0.15"));
    svg.appendChild(makeLine("620", "390", "800", "390", "#2ea3f2", "0.15"));

    // Insertar SVG antes del img (o al inicio del panel)
    panel.insertBefore(svg, img);
  }

  // ── Observador para el panel derecho ─────────────────────────
  function startRadarObserver() {
    if (!isLoginPage()) return;

    // Intento inmediato
    injectRadarSVG();

    var observer = new MutationObserver(function () {
      injectRadarSVG();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    // Después de 15s asumimos que ya no hay cambios de DOM en el login
    setTimeout(function () { observer.disconnect(); }, 15000);
  }

  // ── Bootstrap ────────────────────────────────────────────────
  function init() {
    startOAuthObserver();
    startRadarObserver();
  }

  if (document.body) {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
