import { waLink } from "../lib/whatsapp";
import { WhatsAppIcon } from "./icons";
import { Magnet } from "./reactbits/Magnet";

export function WhatsAppFab() {
  return (
    <>
      <Magnet className="fab-wrap" strength={12} radius={150}>
        <a
          className="fab"
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Pedir por WhatsApp"
        >
          <WhatsAppIcon className="fab__icon" />
          <span className="fab__text">Pedir</span>
        </a>
      </Magnet>

      <a
        className="mobile-bar"
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
      >
        <WhatsAppIcon className="mobile-bar__icon" />
        Pedir por WhatsApp
      </a>
    </>
  );
}
