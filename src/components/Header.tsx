import { useEffect, useRef, useState } from "react";
import { NAV, SITE } from "../data/site";
import { waLink } from "../lib/whatsapp";
import { StrawberryIcon, WhatsAppIcon } from "./icons";

/** Breakpoint a partir del cual el menú móvil deja de existir (ver sections.css). */
const DESKTOP_QUERY = "(min-width: 961px)";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloquea el scroll del fondo mientras el menú está abierto.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape cierra y devuelve el foco; un clic fuera también cierra.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      burgerRef.current?.focus();
    };

    const onPointerDown = (event: PointerEvent) => {
      const header = headerRef.current;
      if (!header || !(event.target instanceof Node)) return;
      if (!header.contains(event.target)) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  // Al cruzar a escritorio (rotar tablet, ensanchar ventana) el menú se cierra:
  // si no, quedaría abierto sin burger visible y con el scroll bloqueado.
  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => {
      if (desktop.matches) setOpen(false);
    };

    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  return (
    <header ref={headerRef} className={`header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="header__inner container">
        <a className="brand" href="#inicio">
          <StrawberryIcon className="brand__mark" />
          <span className="brand__text">
            <span className="brand__name">{SITE.name}</span>
            <span className="brand__sub">Postres de fresa · Est. {SITE.since}</span>
          </span>
        </a>

        <nav className="header__nav" aria-label="Navegación principal">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="navlink">
              {item.label}
            </a>
          ))}
        </nav>

        <a
          className="btn btn--rose header__cta"
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon className="btn__icon" />
          Pedir por WhatsApp
        </a>

        <button
          ref={burgerRef}
          type="button"
          className="burger"
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div id="menu-movil" className={`mobile-menu ${open ? "is-open" : ""}`}>
        <nav aria-label="Navegación móvil">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>
        <a
          className="btn btn--rose"
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
        >
          <WhatsAppIcon className="btn__icon" />
          Pedir por WhatsApp
        </a>
        <p className="mobile-menu__note">
          {SITE.hours}
          <br />
          {SITE.phoneDisplay}
        </p>
      </div>
    </header>
  );
}
