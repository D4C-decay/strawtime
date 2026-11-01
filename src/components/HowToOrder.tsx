import { SITE } from "../data/site";
import { waLink } from "../lib/whatsapp";
import { Flourish, WhatsAppIcon } from "./icons";
import { Reveal } from "./Reveal";

const STEPS = [
  {
    n: "I",
    title: "Elige tu postre",
    text: "Recorre la carta y anota el nombre del que se te antoja. Si dudas, pregúntanos por el del día.",
  },
  {
    n: "II",
    title: "Escríbenos",
    text: "El botón abre WhatsApp con el mensaje ya listo. Solo confirmas cantidad, fecha y forma de entrega.",
  },
  {
    n: "III",
    title: "Retira o recibe",
    text: "Preparamos tu pedido el mismo día. Puedes buscarlo en el punto de venta o pedir entrega a domicilio.",
  },
];

export function HowToOrder() {
  return (
    <section className="section how" id="como-pedir">
      <div className="container">
        <Reveal>
          <header className="section-head">
            <p className="eyebrow eyebrow--center">Cómo pedir</p>
            <h2 className="section-title">
              Tres pasos y <em>listo</em>
            </h2>
            <Flourish className="section-flourish" />
          </header>
        </Reveal>

        <ol className="steps">
          {STEPS.map((step, index) => (
            <Reveal key={step.n} delay={index * 80} as="li" className="step">
              <span className="step__num" aria-hidden="true">
                {step.n}
              </span>
              <h3 className="step__title">{step.title}</h3>
              <p className="step__text">{step.text}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={120}>
          <div className="how__note">
            <p>
              <strong>Anticipación:</strong> {SITE.leadTime.toLowerCase()}.
              Para eventos grandes, avísanos con 48 horas.
            </p>
            <a
              className="btn btn--rose"
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="btn__icon" />
              Empezar mi pedido
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
