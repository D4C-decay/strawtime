import type { Product } from "../data/products";
import { waLink } from "../lib/whatsapp";
import { ArrowIcon, WhatsAppIcon } from "./icons";
import { GlareHover } from "./reactbits/GlareHover";
import { SpotlightCard } from "./reactbits/SpotlightCard";

type Props = {
  product: Product;
  wide?: boolean;
};

export function ProductCard({ product, wide = false }: Props) {
  return (
    <SpotlightCard className={`card ${wide ? "card--wide" : ""}`}>
      <GlareHover className="card__media">
        <img
          src={product.image}
          width={product.imageWidth}
          height={product.imageHeight}
          alt={`${product.name} — postre artesanal de fresa de StrawTime`}
          loading="lazy"
          decoding="async"
        />
        <span className="card__number" aria-hidden="true">
          {product.number}
        </span>
        {product.seasonal && <span className="card__flag">Temporada</span>}
      </GlareHover>

      <div className="card__body">
        <div className="card__head">
          <h3 className="card__name">{product.name}</h3>
          <span className="card__price">{product.price ?? "Consultar"}</span>
        </div>

        <p className="card__desc">{product.description}</p>

        <ul className="tags" aria-label="Características">
          {product.tags.map((tag, index) => (
            <li key={`${tag}-${index}`} className="tag">
              {tag}
            </li>
          ))}
        </ul>

        <p className="card__allergens">{product.allergens}</p>

        <a
          className="card__cta"
          href={waLink(product.message)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Consultar por WhatsApp sobre ${product.name}`}
        >
          <WhatsAppIcon className="card__cta-icon" />
          Consultar por WhatsApp
          <ArrowIcon className="card__cta-arrow" />
        </a>
      </div>
    </SpotlightCard>
  );
}
