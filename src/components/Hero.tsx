import { SITE } from "../data/site";
import { waLink } from "../lib/whatsapp";
import { GlareHover } from "./reactbits/GlareHover";
import { TiltedCard } from "./reactbits/TiltedCard";
import { ArrowIcon, Flourish, StrawberryIcon, WhatsAppIcon } from "./icons";

export function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="eyebrow">
            <span className="eyebrow__rule" aria-hidden="true" />
            Repostería artesanal · Hecho en casa
          </p>

          <h1 className="hero__title">
            Postres de fresa con
            <em> sabor a otra época.</em>
          </h1>

          <p className="hero__lead">
            Fresas del día, crema batida a mano y recetas de familia. En{" "}
            {SITE.name} cada postre se arma al momento, como en una carta de
            repostería de antes.
          </p>

          <div className="hero__actions">
            <a className="btn btn--rose" href="#carta">
              Ver la carta
              <ArrowIcon className="btn__icon" />
            </a>
            <a
              className="btn btn--ghost"
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="btn__icon" />
              Pedir por WhatsApp
            </a>
          </div>

          <ul className="hero__notes">
            <li>
              <StrawberryIcon className="hero__note-icon" />
              Fresas frescas del día
            </li>
            <li>
              <StrawberryIcon className="hero__note-icon" />
              Crema batida artesanal
            </li>
            <li>
              <StrawberryIcon className="hero__note-icon" />
              {SITE.leadTime}
            </li>
          </ul>
        </div>

        <div className="hero__figure">
          <TiltedCard className="hero__tilt">
            <div className="photo-frame">
              <GlareHover className="photo-frame__media">
                <img
                  src="/img/hero.webp"
                  width={736}
                  height={981}
                  alt="Postre de temporada StrawTime con fresas frescas y crema"
                  fetchPriority="high"
                  decoding="async"
                />
              </GlareHover>
              <p className="photo-frame__caption">
                Hecho hoy, con fresas del día
              </p>
            </div>
          </TiltedCard>

          <div className="seal" aria-hidden="true">
            <span>Hecho</span>
            <StrawberryIcon className="seal__icon" />
            <span>a mano</span>
          </div>
        </div>
      </div>

      <Flourish className="hero__flourish" />
    </section>
  );
}
