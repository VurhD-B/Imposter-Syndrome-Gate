// Message to be displayed on the prompt
const MESSAGE = "Are you sure…? you're about to consume a dose of imposter syndrome";
const SUBTEXT = "Click proceed if you're ready!";

; (async function main() {

  // avoiding double injection since LinkedIn is an SPA
  if (window.__linkedin_reality_check_shown) return;
  window.__linkedin_reality_check_shown = true;

  // hide page when prompt is shown
  const prevOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = "hidden";

  // modal layout
  const overlay = document.createElement("div");
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 2147483647;
    display: flex; align-items: center; justify-content: center;
    background: rgba(0,0,0,0.5); backdrop-filter: blur(2px);
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  `;

  const card = document.createElement("div");
  card.style.cssText = `
    width: min(520px, 92vw); padding: 24px 20px; border-radius: 12px;
    background: #111; color: #f1f5f9; box-shadow: 0 10px 30px rgba(0,0,0,.35);
    border: 1px solid rgba(255,255,255,0.08);
  `;

  // content:
  const title = document.createElement("div");
  title.textContent = MESSAGE;
  title.style.cssText = "font-size: 20px; font-weight: 700; margin-bottom: 8px;";

  const sub = document.createElement("div");
  sub.textContent = SUBTEXT;
  sub.style.cssText = "opacity: .8; font-size: 14px; margin-bottom: 20px;";

  // buttons:
  const row = document.createElement("div");
  row.style.cssText = "display: flex; gap: 10px; flex-wrap: wrap;";

  function mkBtn(label, kind = "neutral") {
    const b = document.createElement("button");
    b.textContent = label;
    b.style.cssText = `
      cursor: pointer; padding: 10px 14px; border-radius: 10px;
      border: 1px solid transparent; font-weight: 600; font-size: 14px;
    `;
    if (kind === "primary") {
      b.style.background = "#22c55e";
      b.style.color = "#062b16";
    } else if (kind === "danger") {
      b.style.background = "#0b1220";
      b.style.color = "#e2e8f0";
      b.style.borderColor = "rgba(255,255,255,0.12)";
    } else {
      b.style.background = "transparent";
      b.style.color = "#e2e8f0";
      b.style.borderColor = "rgba(255,255,255,0.12)";
    }
    return b;
  }

  const proceed = mkBtn("Proceed", "primary");
  const bail = mkBtn("Take me back", "danger");

  // proceed makes you access the webpage
  proceed.addEventListener("click", () => { cleanup(); });

  // bail takes you back to prev page or blank page
  bail.addEventListener("click", () => {
    cleanup();
    if (history.length > 1) history.back();
    else location.replace("about:blank");
  });

  // cleanup func
  function cleanup() {
    document.documentElement.style.overflow = prevOverflow || "";
    overlay.remove();
    window.__linkedin_reality_check_shown = false;
  }

  // dom stuff
  row.appendChild(proceed);
  row.appendChild(bail);
  card.appendChild(title);
  card.appendChild(sub);
  card.appendChild(row);
  overlay.appendChild(card);
  document.documentElement.appendChild(overlay);

  // basic accessibility/UX
  proceed.focus();
  overlay.addEventListener("keydown", (e) => { if (e.key === "Escape") bail.click(); });
})();
