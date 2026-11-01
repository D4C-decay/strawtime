import { SITE } from "../data/site";
import { telLink, waLink } from "../lib/whatsapp";
import { Flourish, InstagramIcon, StrawberryIcon, WhatsAppIcon } from "./icons";
import { Reveal } from "./Reveal";

export function Contact() {
  return (
    <section className="section contact" id="contacto">
      <div className="container">
        <Reveal>
          <div className="contact-card">
            <div className="contact-card__copy">
              <p className="eyebrow">Contacto</p>
              <h2 className="section-title section-title--left">
                Hagamos tu <em>pedido</em>
              </h2>
              <Flourish className="section-flourish section-flourish--left" />

              <p className="contact-card__lead">
                Escríbenos con el postre que quieres y la fecha. Te confirmamos
                disponibilidad, precio y entrega en el mismo chat.
              </p>

              <dl className="contact-list">
                <div>
                  <dt>WhatsApp</dt>
                  <dd>
                    <a className="contact-list__tel" href={telLink}>
                      {SITE.phoneDisplay}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>Horario</dt>
                  <dd>{SITE.hours}</dd>
                </div>
                <div>
                  <dt>Entregas</dt>
                  <dd>{SITE.delivery}</dd>
                </div>
                <div>
                  <dt>Pedidos</dt>
                  <dd>{SITE.leadTime}</dd>
                </div>
              </dl>

              {SITE.instagramUrl && (
                <a
                  className="contact-card__ig"
                  href={SITE.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InstagramIcon className="contact-card__ig-icon" />
                  {SITE.instagramHandle}
                </a>
              )}
            </div>

            <div className="contact-card__cta">
              <span className="contact-card__seal" aria-hidden="true">
                <StrawberryIcon className="contact-card__seal-icon" />
                StrawTime
              </span>
              <p className="contact-card__kicker">Pedidos por WhatsApp</p>
              <a
                className="btn btn--rose btn--lg"
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon className="btn__icon" />
                Abrir el chat
              </a>
              <p className="contact-card__hint">
                Se abre con un mensaje listo para enviar. Solo tienes que darle
                enviar.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
