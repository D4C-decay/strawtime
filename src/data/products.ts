export type Product = {
  id: string;
  number: string;
  name: string;
  description: string;
  tags: string[];
  allergens: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  /** Mensaje propio que se precarga en WhatsApp al pedir este postre. */
  message: string;
  /**
   * Precio visible en la tarjeta (por ejemplo, "Desde RD$ 1,200").
   * Si se omite, la tarjeta muestra "Consultar".
   */
  price?: string;
  seasonal?: boolean;
};

export const PRODUCTS: Product[] = [
  {
    id: "chocoflan",
    number: "01",
    name: "Chocoflán Carmesí",
    description:
      "Flan de caramelo sobre bizcocho de chocolate, coronado con fresas frescas y un hilo de crema. El contraste que se pide solo.",
    tags: ["fresa fresca", "caramelo", "para compartir"],
    allergens: "Contiene lácteos, huevo y gluten.",
    image: "/img/chocoflan.webp",
    imageWidth: 736,
    imageHeight: 920,
    message:
      "¡Hola StrawTime! 🍓 Quisiera pedir el Chocoflán Carmesí. ¿Está disponible hoy?",
  },
  {
    id: "tarta",
    number: "02",
    name: "Tarta del Huerto",
    description:
      "Base quebrada, crema pastelera de la casa y fresas maceradas. Receta de domingo, servida en porción generosa.",
    tags: ["crema pastelera", "receta de casa"],
    allergens: "Contiene lácteos, huevo y gluten.",
    image: "/img/tarta.webp",
    imageWidth: 405,
    imageHeight: 506,
    message:
      "¡Hola StrawTime! 🍓 Quisiera pedir la Tarta del Huerto. ¿Está disponible hoy?",
  },
  {
    id: "copa",
    number: "03",
    name: "Copa Doña Rosa",
    description:
      "Fresas seleccionadas, crema batida artesanal y topping a elección. La favorita de la vitrina.",
    tags: ["crema batida", "topping a elección"],
    allergens: "Contiene lácteos.",
    image: "/img/copa.webp",
    imageWidth: 736,
    imageHeight: 920,
    message:
      "¡Hola StrawTime! 🍓 Quisiera pedir una Copa Doña Rosa. ¿Qué toppings tienen hoy?",
  },
  {
    id: "terciopelo",
    number: "04",
    name: "Fresas de Terciopelo",
    description:
      "Fresas enteras bañadas en chocolate, con acabado brillante y un toque de sal. Se acaban primero.",
    tags: ["chocolate", "fresa entera"],
    allergens: "Contiene lácteos. Puede contener trazas de frutos secos.",
    image: "/img/terciopelo.webp",
    imageWidth: 736,
    imageHeight: 920,
    message:
      "¡Hola StrawTime! 🍓 Quisiera pedir Fresas de Terciopelo. ¿Cuántas vienen por orden?",
  },
  {
    id: "mordiscos",
    number: "05",
    name: "Mordiscos de la Abuela",
    description:
      "Bocados de fresa en porciones pequeñas, pensados para picar sin culpa y compartir en la mesa.",
    tags: ["bocado pequeño", "ideal para picar"],
    allergens: "Contiene lácteos y gluten.",
    image: "/img/mordiscos.webp",
    imageWidth: 675,
    imageHeight: 843,
    message:
      "¡Hola StrawTime! 🍓 Quisiera pedir Mordiscos de la Abuela. ¿Los tienen por bandeja?",
  },
  {
    id: "temporada",
    number: "06",
    name: "Sensación de Julio",
    description:
      "Nuestra creación de temporada: capas de fresa y crema sobre una base ligera. Solo mientras dure la cosecha.",
    tags: ["edición limitada", "de temporada"],
    allergens: "Contiene lácteos. Consulta por otras alergias.",
    image: "/img/temporada.webp",
    imageWidth: 736,
    imageHeight: 920,
    message:
      "¡Hola StrawTime! 🍓 Quisiera probar la Sensación de Julio antes de que se acabe la temporada.",
    seasonal: true,
  },
];

export const VITRINA = PRODUCTS.filter((p) => !p.seasonal);
export const TEMPORADA = PRODUCTS.filter((p) => p.seasonal);

/** Se usa en titulares y contadores: evita repetir el número a mano. */
export const PRODUCT_COUNT = PRODUCTS.length;
