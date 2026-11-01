import { SITE } from "../data/site";

/**
 * Número en formato internacional, solo dígitos (lo que exige wa.me).
 * Si alguien edita `site.ts` con espacios o un "+", el enlace seguiría vivo.
 */
const PHONE = SITE.phone.replace(/\D/g, "");

if (import.meta.env.DEV && !/^\d{11,15}$/.test(PHONE)) {
  console.warn(
    `[strawtime] SITE.phone no parece un número internacional válido: "${SITE.phone}"`,
  );
}

/**
 * Construye un enlace de WhatsApp con mensaje precargado.
 */
export function waLink(message: string = SITE.whatsappMessage): string {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
}

/** Enlace telefónico para los usuarios que no tienen WhatsApp a mano. */
export const telLink = `tel:+${PHONE}`;
