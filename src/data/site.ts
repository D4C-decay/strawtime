/**
 * Datos de contacto y configuración de la marca.
 * Todo lo editable del negocio vive aquí: un solo sitio para cambiar
 * el número, el horario o las redes.
 */

export const SITE = {
  name: "StrawTime",
  tagline: "Postres artesanales de fresa",
  since: "2026",

  /** Formato internacional sin "+" ni espacios (lo exige wa.me). */
  phone: "18294104960",
  phoneDisplay: "+1 (829) 410-4960",

  /** Mensaje que se abre precargado en el chat. */
  whatsappMessage:
    "¡Hola StrawTime! 🍓 Vi su página y quiero hacer un pedido. ¿Me ayudan con disponibilidad y precios?",

  // TODO confirmar con el negocio antes de publicar.
  hours: "Lunes a sábado · 10:00 a 19:00",
  delivery: "Entrega en Santiago y alrededores",
  leadTime: "Pedidos con 24 horas de anticipación",

  /** Deja vacío para ocultar el enlace de Instagram. */
  instagramUrl: "",
  instagramHandle: "@strawtime",
} as const;

export const NAV = [
  { href: "#carta", label: "La Carta" },
  { href: "#receta", label: "Nuestra Receta" },
  { href: "#como-pedir", label: "Cómo Pedir" },
  { href: "#contacto", label: "Contacto" },
] as const;
