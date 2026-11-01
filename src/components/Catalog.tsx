import { PRODUCT_COUNT, TEMPORADA, VITRINA } from "../data/products";
import { countWord } from "../lib/numbers";
import { Flourish } from "./icons";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";

export function Catalog() {
  return (
    <section className="section catalog" id="carta">
      <div className="container">
        <Reveal>
          <header className="section-head">
            <p className="eyebrow eyebrow--center">La carta</p>
            <h2 className="section-title">
              {PRODUCT_COUNT === 1 ? "Un postre" : `${countWord(PRODUCT_COUNT)} postres`},{" "}
              <em>una sola fruta</em>
            </h2>
            <Flourish className="section-flourish" />
            <p className="section-lead">
              Todo se prepara el mismo día. Elige tu favorito y escríbenos: te
              confirmamos disponibilidad y precio por WhatsApp.
            </p>
          </header>
        </Reveal>

        <div className="group">
          <Reveal>
            <div className="group__label">
              <span>De la vitrina</span>
            </div>
          </Reveal>
          <div className="card-grid">
            {VITRINA.map((product, index) => (
              <Reveal key={product.id} delay={index * 60}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>

        <div className="group group--season">
          <Reveal>
            <div className="group__label group__label--season">
              <span>De temporada</span>
            </div>
          </Reveal>
          <div className="card-grid card-grid--single">
            {TEMPORADA.map((product, index) => (
              <Reveal key={product.id} delay={index * 60}>
                <ProductCard product={product} wide />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
