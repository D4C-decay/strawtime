import { CurvedLoop } from "./reactbits/CurvedLoop";

const ITEMS = [
  "Fresas frescas del día",
  "Crema batida artesanal",
  "Recetas de la casa",
  "Pedidos con 24 h",
  "Hecho al momento",
];

/**
 * Separador entre el Hero y la carta. Antes era una cinta recta; ahora es una
 * marquesina curva que se puede arrastrar.
 */
export function Ribbon() {
  return (
    <div className="loop">
      <CurvedLoop
        marqueeText={ITEMS.join("  ")}
        separator="✦"
        speed={1.1}
        scrollBoost={0.8}
        edgeFade={0.1}
      />
    </div>
  );
}
