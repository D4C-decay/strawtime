export type Faq = { id: string; q: string; a: string };

export const FAQS: Faq[] = [
  {
    id: "entregas",
    q: "¿Hacen entregas a domicilio?",
    a: "Sí. Entregamos en Santiago y alrededores. Coordinamos la zona, la hora y el costo de envío por WhatsApp al confirmar tu pedido.",
  },
  {
    id: "anticipacion",
    q: "¿Con cuánta anticipación debo pedir?",
    a: "Lo ideal es avisar con 24 horas. Para tartas completas, mesas de postres o pedidos grandes, escríbenos con al menos 48 horas.",
  },
  {
    id: "eventos",
    q: "¿Puedo pedir para un evento o catering?",
    a: "Claro. Armamos mesas de postres personalizadas para cumpleaños, reuniones y eventos de empresa. Cuéntanos cuántas personas esperas y te preparamos una propuesta.",
  },
  {
    id: "alergias",
    q: "¿Tienen opciones sin lácteos o sin gluten?",
    a: "Nuestra especialidad gira alrededor de la crema y la fresa, así que la mayoría de los postres llevan lácteos. Escríbenos y revisamos juntos qué opción se ajusta a tu caso.",
  },
  {
    id: "conservacion",
    q: "¿Cómo conservo mi postre?",
    a: "En refrigeración y lejos de la humedad. Los postres con crema se disfrutan mejor el mismo día; la tarta aguanta hasta 48 horas bien tapada.",
  },
];
