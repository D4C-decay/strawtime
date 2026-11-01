const ITEMS = [
  "Fresas frescas del día",
  "Crema batida artesanal",
  "Recetas de la casa",
  "Pedidos con 24 h",
  "Hecho al momento",
];

export function Ribbon() {
  const track = [...ITEMS, ...ITEMS];
  return (
    <div className="ribbon" aria-hidden="true">
      <div className="ribbon__track">
        {track.map((item, index) => (
          <span key={`${item}-${index}`} className="ribbon__item">
            {item}
            <span className="ribbon__dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
