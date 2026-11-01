import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@fontsource/playfair-display/latin-400.css";
import "@fontsource/playfair-display/latin-400-italic.css";
import "@fontsource/playfair-display/latin-600.css";
import "@fontsource/playfair-display/latin-600-italic.css";
import "@fontsource/lora/latin-400.css";
import "@fontsource/lora/latin-400-italic.css";
import "@fontsource/lora/latin-600.css";

import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/sections.css";

import App from "./App";

/**
 * Al navegar por un ancla el destino entra en pantalla de golpe: sin esto
 * aparecería con la animación de reveal (700 ms) y se vería como un parpadeo.
 * Durante el salto desactivamos la transición.
 */
function markAnchorJumps() {
  const root = document.documentElement;

  const jump = () => {
    root.classList.add("is-jumping");
    window.setTimeout(() => root.classList.remove("is-jumping"), 800);
  };

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest('a[href^="#"]')) jump();
    },
    true,
  );

  if (window.location.hash) jump();
}

markAnchorJumps();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
