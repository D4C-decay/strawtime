import { SITE } from "../data/site";
import { PRODUCT_COUNT } from "../data/products";
import { Counter } from "./reactbits/Counter";
import { DriftWall, type DriftItem } from "./reactbits/DriftWall";
import { Flourish, StrawberryIcon } from "./icons";
import { Reveal } from "./Reveal";

const MOMENTS: DriftItem[] = [
  { image: "/img/copa.webp", caption: "La copa de la casa" },
  { image: "/img/terciopelo.webp", caption: "Bañadas, sin prisa" },
  { image: "/img/mordiscos.webp", caption: "Para picar" },
  { image: "/img/tarta.webp", caption: "Tarta de fresa" },
  { image: "/img/chocoflan.webp", caption: "Chocoflan" },
  { image: "/img/temporada.webp", caption: "La de temporada" },
  { image: "/img/hero.webp", caption: "Fresas del día" },
];

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
          <DriftWall items={MOMENTS} />
          <p className="sr-only">
            Collage de nuestros postres: la copa de la casa, fresas bañadas,
            mordiscos para picar, tarta de fresa, chocoflan y la pieza de
            temporada.
          </p>
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
