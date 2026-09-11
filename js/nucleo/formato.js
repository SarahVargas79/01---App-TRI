/* ══════════════════════════════════════════════════════════════════════
   NÚCLEO / FORMATO — utilitários puros (sem DOM, sem estado).
   ══════════════════════════════════════════════════════════════════════ */
window.App = window.App || {};

App.Formato = (function () {
  /* moeda brasileira: 26.5 → "R$ 26,50" */
  function brl(v) { return 'R$ ' + v.toFixed(2).replace('.', ','); }

  /* QR Code ilustrativo (padrão determinístico — apenas visual, não escaneável) */
  function qrSvg(semente, px) {
    const n = 21, cel = 9;
    let s = semente;
    const rnd = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
    let r = '';
    for (let lin = 0; lin < n; lin++) {
      for (let col = 0; col < n; col++) {
        const finder = (lin < 7 && col < 7) || (lin < 7 && col >= n - 7) || (lin >= n - 7 && col < 7);
        if (!finder && rnd() < 0.45) r += '<rect x="' + (col * cel) + '" y="' + (lin * cel) + '" width="' + cel + '" height="' + cel + '" fill="#1F2430"/>';
      }
    }
    const olho = (x, y) =>
      '<rect x="' + (x * cel) + '" y="' + (y * cel) + '" width="' + (7 * cel) + '" height="' + (7 * cel) + '" fill="#1F2430"/>' +
      '<rect x="' + ((x + 1) * cel) + '" y="' + ((y + 1) * cel) + '" width="' + (5 * cel) + '" height="' + (5 * cel) + '" fill="#FFFFFF"/>' +
      '<rect x="' + ((x + 2) * cel) + '" y="' + ((y + 2) * cel) + '" width="' + (3 * cel) + '" height="' + (3 * cel) + '" fill="#1F2430"/>';
    r += olho(0, 0) + olho(n - 7, 0) + olho(0, n - 7);
    return '<svg viewBox="0 0 ' + (n * cel) + ' ' + (n * cel) + '" width="' + px + '" height="' + px + '" xmlns="http://www.w3.org/2000/svg">' + r + '</svg>';
  }

  return { brl, qrSvg };
})();
