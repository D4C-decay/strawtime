# StrawTime

Sitio de una sola página para **StrawTime**, repostería artesanal de fresa.
Estética de carta antigua: papel claro, rosa pastel y filetes plateados.
Todos los pedidos salen por WhatsApp con el mensaje ya escrito.

## Stack

- **Vite 8** + **React 19** + **TypeScript** (modo `strict`).
- CSS plano con tokens; sin framework de UI ni modo oscuro.
- Tipografías autoalojadas con `@fontsource` (Playfair Display + Lora, subset latin).
- Componentes de [react-bits](https://github.com/DavidHDev/react-bits) adaptados a CSS
  plano. Licencia en [`LICENSE-react-bits.md`](./LICENSE-react-bits.md).

## Scripts

```bash
npm install
npm run dev        # servidor de desarrollo
npm run build      # typecheck + build de producción en dist/
npm run preview    # sirve dist/ en http://localhost:4173
npm run lint       # oxlint sobre src/
```

Requiere **Node 20.19+** (lo exige Vite 8).

## Configuración

El dominio público se define en `.env` (copia `.env.example`):

```bash
VITE_SITE_URL=https://tu-dominio.com
```

Se usa para `canonical`, `og:url`, `og:image`, `twitter:image`, JSON-LD,
`sitemap.xml`, `robots.txt` y `llms.txt`. Si falta, el build avisa y usa
`https://strawtime.example`: no publiques así, WhatsApp y Facebook no podrán
mostrar la miniatura del enlace.

## Dónde se edita el contenido

| Qué | Archivo |
|---|---|
| Nombre, teléfono, horario, entrega, Instagram | `src/data/site.ts` |
| Carta (postres, precios opcionales, alérgenos) | `src/data/products.ts` |
| Preguntas frecuentes | `src/data/faqs.ts` |
| Paleta, tipografía, medidas | `src/styles/tokens.css` |
| Contrato visual | `DESIGN.md` |

La carta se escribe **una sola vez**: el catálogo, el contador de la sección
"Nuestra receta", el JSON-LD, `sitemap.xml` y `llms.txt` se generan desde
`src/data/products.ts`. Para añadir un postre basta con añadir un objeto a
`PRODUCTS`; el número de la carta y los textos derivados se actualizan solos.

Los precios son opcionales. Si un postre no tiene `price`, la tarjeta muestra
**Consultar** y el precio se confirma por WhatsApp.

## Estructura

```
src/
  components/        secciones y piezas de UI
  components/reactbits/  efectos adaptados (spotlight, glare, magnet, counter,
                         tilted, split-flap, sello circular)
  data/              contenido editable
  lib/               WhatsApp, reveal, utilidades
  styles/            tokens.css, base.css, sections.css
public/
  img/               fotos en WebP
  og.jpg             imagen para compartir (1200×630)
  favicon.svg
index.html           metadatos, JSON-LD y fallback sin JavaScript
vite.config.ts       dominio, sitemap, robots.txt, llms.txt
```

## Decisiones que conviene no deshacer

- **Sin modo oscuro por diseño.** `color-scheme: light` y el papel claro se
  mantienen aunque el sistema esté en oscuro.
- **Sin JavaScript hay contenido.** `index.html` incluye un `<noscript>` con la
  descripción y un enlace directo a WhatsApp.
- **`prefers-reduced-motion`** desactiva cinta, parallax, brillos y reveal.
- **Accesibilidad**: skip link a `#contenido`, foco visible, menú móvil con
  Escape y cierre al cruzar a escritorio, contraste verificado.
- **Imágenes** con `width`/`height` reales para evitar CLS; la del hero se
  precarga con `fetchpriority="high"`.

## Despliegue

Es un sitio estático: `npm run build` y publica `dist/`.
Sirve `index.html` en la raíz y respeta los archivos `sitemap.xml`,
`robots.txt` y `llms.txt` generados en el build. Recuerda definir
`VITE_SITE_URL` en el entorno de despliegue antes de construir.
