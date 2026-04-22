/**
 * GUIA Brand — estiliza "IA" en gold dentro de "GUIA"
 * Inyección externa, no modifica archivos de Chainlit.
 * Usa MutationObserver para sobrevivir re-renders de React.
 */
(function () {
  'use strict';

  var PROCESSED = 'data-guia-styled';

  function styleTextNode(node) {
    if (node.textContent !== 'GUIA') return;
    var parent = node.parentElement;
    if (!parent || parent.hasAttribute(PROCESSED)) return;
    var span = document.createElement('span');
    span.className = 'guia-wordmark';
    span.setAttribute(PROCESSED, '1');
    span.innerHTML = 'GU<span class="guia-ia">IA</span>';
    parent.replaceChild(span, node);
  }

  function walkTree(root) {
    if (!root) return;
    var walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    var nodes = [];
    var node;
    while ((node = walker.nextNode())) {
      if (node.textContent === 'GUIA') nodes.push(node);
    }
    nodes.forEach(styleTextNode);
  }

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      m.addedNodes.forEach(function (n) {
        if (n.nodeType === Node.ELEMENT_NODE) walkTree(n);
        else if (n.nodeType === Node.TEXT_NODE) styleTextNode(n);
      });
    });
  });

  function init() {
    walkTree(document.body);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
