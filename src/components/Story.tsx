import { SITE } from "../data/site";
import { PRODUCT_COUNT } from "../data/products";
import { Counter } from "./reactbits/Counter";
import { Flourish, StrawberryIcon } from "./icons";
import { Reveal } from "./Reveal";

const SEALS = [
  { to: PRODUCT_COUNT, suffix: "", label: "postres en carta" },
  { to: 24, suffix: " h", label: "de anticipación" },
  { to: 100, suffix: " %", label: "fresa natural" },
];

export function Story() {
  return (
    <section className="section story" id="receta">
      <div className="container story__grid">
        <Reveal className="story__gallery">
          <figure className="polaroid polaroid--a">
            <img
              src="/img/copa.webp"
              width={736}
              height={920}
              alt="Copa de fresas con crema batida"
              loading="lazy"
              decoding="async"
            />
            <figcaption>La copa de la casa</figcaption>
          </figure>
          <figure className="polaroid polaroid--b">
            <img
              src="/img/terciopelo.webp"
              width={736}
              height={920}
              alt="Fresas bañadas en chocolate"
              loading="lazy"
              decoding="async"
            />
            <figcaption>Bañadas, sin prisa</figcaption>
          </figure>
          <figure className="polaroid polaroid--c">
            <img
              src="/img/mordiscos.webp"
              width={675}
              height={843}
              alt="Mordiscos de fresa en porciones pequeñas"
              loading="lazy"
              decoding="async"
            />
            <figcaption>Para picar</figcaption>
          </figure>
        </Reveal>

        <div className="story__copy">
          <Reveal>
            <p className="eyebrow">Nuestra receta</p>
            <h2 className="section-title section-title--left">
              Empezó como un <em>proyecto de casa</em>
            </h2>
            <Flourish className="section-flourish section-flourish--left" />
          </Reveal>

          <Reveal delay={80}>
            <p>
              {SITE.name} nació de una idea sencilla: convertir la fresa local en
              postres que se sientan hechos para alguien. Empezamos en una cocina
              pequeña, con una batidora prestada y una receta de crema que no
              hemos cambiado desde entonces.
            </p>
            <p>
              Hoy seguimos seleccionando la fruta a mano, batiendo la crema al
              momento y entregando el mismo día. Nada de atajos: si la fresa no
              está dulce, no sale a la vitrina.
            </p>
          </Reveal>

          <Reveal delay={140}>
            <ul className="seals">
              {SEALS.map((seal) => (
                <li key={seal.label} className="seal-stat">
                  <StrawberryIcon className="seal-stat__icon" />
                  <span className="seal-stat__num">
                    <Counter to={seal.to} suffix={seal.suffix} />
                  </span>
                  <span className="seal-stat__label">{seal.label}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
