import { NAV, SITE } from "../data/site";
import { telLink, waLink } from "../lib/whatsapp";
import { StrawberryIcon, WhatsAppIcon } from "./icons";

const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <StrawberryIcon className="footer__mark" />
          <div>
            <p className="footer__name">{SITE.name}</p>
            <p className="footer__tag">{SITE.tagline}</p>
          </div>
        </div>

        <nav className="footer__nav" aria-label="Navegación del pie">
          {NAV.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="footer__contact">
          <a
            className="footer__wa"
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon className="footer__wa-icon" />
            {SITE.phoneDisplay}
          </a>
          <a className="footer__tel" href={telLink}>
            Llamar
          </a>
        </div>
      </div>

      <div className="container footer__legal">
        <p>
          © {YEAR} {SITE.name} · Postres artesanales de fresa
        </p>
        <p>Hecho con fresas de verdad.</p>
      </div>
    </footer>
  );
}
