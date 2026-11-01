import { FAQS } from "../data/faqs";
import { Flourish } from "./icons";
import { Reveal } from "./Reveal";

export function Faq() {
  return (
    <section className="section faq" id="preguntas">
      <div className="container faq__grid">
        <Reveal>
          <header className="section-head section-head--left">
            <p className="eyebrow">Preguntas frecuentes</p>
            <h2 className="section-title section-title--left">
              Antes de <em>pedir</em>
            </h2>
            <Flourish className="section-flourish section-flourish--left" />
            <p className="section-lead">
              Si tu duda no está aquí, escríbenos por WhatsApp: contestamos en
              horario de tienda.
            </p>
          </header>
        </Reveal>

        <div className="faq__list">
          {FAQS.map((faq, index) => (
            <Reveal key={faq.id} delay={index * 40}>
              <details className="faq__item">
                <summary className="faq__q">
                  <span>{faq.q}</span>
                  <span className="faq__sign" aria-hidden="true" />
                </summary>
                <p className="faq__a">{faq.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
