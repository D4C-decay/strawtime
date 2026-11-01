import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

import { PRODUCTS } from './src/data/products'
import { SITE } from './src/data/site'

/** Dominio de reserva: evita publicar rutas relativas si falta la variable. */
const FALLBACK_URL = 'https://strawtime.example'

/**
 * Datos estructurados del negocio. Se generan desde `products.ts` para que
 * añadir o renombrar un postre no deje el schema desactualizado.
 */
function buildJsonLd(siteUrl: string) {
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'Bakery',
      '@id': `${siteUrl}/#bakery`,
      name: SITE.name,
      description: 'Repostería artesanal especializada en postres de fresa.',
      url: `${siteUrl}/`,
      telephone: `+${SITE.phone}`,
      servesCuisine: 'Postres, repostería',
      priceRange: '$$',
      image: `${siteUrl}/og.jpg`,
      hasMenu: {
        '@type': 'Menu',
        name: `La carta de ${SITE.name}`,
        hasMenuSection: {
          '@type': 'MenuSection',
          name: 'Postres de fresa',
          hasMenuItem: PRODUCTS.map((product) => ({
            '@type': 'MenuItem',
            name: product.name,
            description: product.description,
          })),
        },
      },
    },
    null,
    2,
  )
}

/**
 * `llms.txt` con enlaces absolutos: Lighthouse exige al menos un enlace y los
 * agentes necesitan rutas resueltas. Se genera con el mismo origen que el
 * sitemap para no repetir datos a mano.
 */
function buildLlmsTxt(siteUrl: string) {
  return [
    `# ${SITE.name}`,
    '',
    `> ${SITE.tagline}. Fresas del día, crema batida a mano y recetas de casa. Pedidos por WhatsApp y entrega en Santiago, República Dominicana.`,
    '',
    '## Carta',
    '',
    ...PRODUCTS.map((product) => `- **${product.name}** — ${product.description}`),
    '',
    '## Pedidos',
    '',
    `- [Pedir por WhatsApp](${siteUrl}/#contacto)`,
    `- Teléfono: ${SITE.phoneDisplay}`,
    `- Horario: ${SITE.hours}`,
    `- ${SITE.leadTime}`,
    `- ${SITE.delivery}`,
    '',
    '## Enlaces',
    '',
    `- [Inicio](${siteUrl}/)`,
    `- [La carta](${siteUrl}/#carta)`,
    `- [Nuestra receta](${siteUrl}/#receta)`,
    `- [Cómo pedir](${siteUrl}/#como-pedir)`,
    `- [Preguntas frecuentes](${siteUrl}/#preguntas)`,
    `- [Contacto](${siteUrl}/#contacto)`,
    '',
    '## Notas',
    '',
    '- Los precios se confirman por WhatsApp; la carta no publica precios.',
    '- Cada postre indica sus alérgenos en la tarjeta del catálogo.',
    '',
  ].join('\n')
}

/**
 * Resuelve `__SITE_URL__` y `__JSON_LD__` en el HTML y emite `sitemap.xml`
 * y `llms.txt`.
 *
 * Los crawlers de WhatsApp y Facebook exigen `og:image` absoluta; con esto
 * el dominio se define en `.env` y el HTML nunca queda con rutas relativas.
 */
function sitePlugin(siteUrl: string): Plugin {
  const jsonLd = buildJsonLd(siteUrl)

  return {
    name: 'strawtime-site',
    transformIndexHtml(html) {
      return html
        .replaceAll('__JSON_LD__', jsonLd)
        .replaceAll('__SITE_URL__', siteUrl)
    },
    generateBundle() {
      const sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        '  <url>',
        `    <loc>${siteUrl}/</loc>`,
        '    <changefreq>monthly</changefreq>',
        '    <priority>1.0</priority>',
        '  </url>',
        '</urlset>',
        '',
      ].join('\n')

      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap })
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: buildLlmsTxt(siteUrl) })
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: [
          'User-agent: *',
          'Allow: /',
          '',
          `Sitemap: ${siteUrl}/sitemap.xml`,
          '',
          `# ${SITE.name} — ${SITE.tagline}`,
          '',
        ].join('\n'),
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || FALLBACK_URL).replace(/\/+$/, '')

  if (!env.VITE_SITE_URL) {
    console.warn(
      `[strawtime] VITE_SITE_URL sin definir: se usa ${FALLBACK_URL}. ` +
        'Define tu dominio en .env antes de publicar.',
    )
  }

  return {
    plugins: [react(), sitePlugin(siteUrl)],
  }
})
