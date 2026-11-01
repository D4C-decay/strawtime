# DESIGN.md — StrawTime

Contrato visual de la marca. Fuente de verdad para cualquier cambio de UI.

## Identidad

- **Marca:** StrawTime — postres artesanales de fresa.
- **Concepto:** carta de repostería antigua. Papel marrón claro, rosa pastel y filetes plateados.
- **Sensación:** cálida, artesanal, de casa. Nada de neón, glassmorphism ni estética tech.
- **Modo oscuro:** **no existe**. `color-scheme: light` fijado en `:root` y `<meta name="color-scheme" content="light">`. No añadir reglas `prefers-color-scheme: dark`.

## Paleta y proporción

La carta se lee sobre papel: el rosa y el plateado son acentos, no superficies.
En la home medida, la superficie sin fotos es ~98 % papel, ~1 % rosa y plata
solo en filetes de 1 px. El **60 / 30 / 10** del brief original queda como
referencia de intención, no como cuota de área: forzar un 30 % de rosa
convertiría la carta en un bloque de color y rompería la lectura.

| Rol | Tokens |
|---|---|
| Papel / marrón claro | `--paper #EFE3D2`, `--paper-soft #F7EEDF`, `--paper-deep #E2D1B8`, `--ink #3E2A1E`, `--ink-soft #6B5344`, `--ink-faint #654D3E` |
| Rosa pastel (acento) | `--rose #F3C9D1`, `--rose-deep #E3A6B4`, `--rose-ink #7E3D4A` |
| Plateado (filete) | `--silver #C7CBD1`, `--silver-lo #9AA0A8`, `--silver-line rgba(154,160,168,.55)` |

Reglas:

- El rosa **nunca** lleva texto fino encima: solo fondos, sellos y acentos.
- El plateado es **filete**, no relleno: bordes, hairlines, destellos, insignias.
- Texto siempre `--ink` sobre papel o rosa claro. Contraste mínimo AA.
- Prohibido el negro puro y el blanco puro.

## Tipografía

- **Display:** Playfair Display (400 / 400 italic / 600 / 600 italic), self-hosted vía `@fontsource`.
- **Texto:** Lora (400 / 400 italic / 600), self-hosted.
- Sin Google Fonts externas. Sin fuentes de sistema como principal.
- Etiquetas: mayúsculas, `letter-spacing: .14em–.3em`, tamaño `.56–.72rem`.

## Espaciado y forma

- Escala 4pt: 4, 8, 12, 16, 24, 32, 48, 64.
- Radios discretos: `--radius 3px`, `--radius-lg 6px`. Nada de píldoras gigantes salvo tags y sellos.
- Contenedor: `--maxw 1180px`, gutter `clamp(1.15rem, 4vw, 2.5rem)`.

## Textura y ornamento

- Grano SVG (`feTurbulence`) fijo al 5 % sobre todo el sitio.
- Viñeta radial suave y halo rosa detrás de la foto del hero.
- Filetes dobles plateados, marcos de foto con passe-partout crema, sellos circulares y cintas de temporada.
- **No** usar sombras duras ni degradados multicolor.

## Componentes

- `btn--rose` (CTA principal, WhatsApp), `btn--ghost` (secundario).
- Tarjeta de producto: papel degradado, doble filete, número de carta, etiqueta de temporada.
- `photo-frame` + `polaroid`: marcos de fotografía.
- Acordeón FAQ con `<details>` nativo.
- Barra fija de WhatsApp en móvil; botón flotante con efecto imán en escritorio.

## Movimiento

- Duraciones 280–850 ms, easing `cubic-bezier(.22,.61,.36,1)`.
- Reveal al entrar en viewport, marquesina lenta de la cinta, destello plateado en fotos.
- **Siempre** respetar `prefers-reduced-motion: reduce`: sin marquesina, sin imán, sin destello, reveal estático.
- Efectos con puntero desactivados en `hover: none`.

### Interacción (adaptaciones de react-bits)

| Gesto | Dónde | Límite |
|---|---|---|
| `TiltedCard` | marco del Hero | ±4,5° y escala 1,012; solo puntero fino, plano en táctil |
| `SplitFlapText` | “Seis” del titular de la carta | una sola pasada al entrar; el texto accesible va aparte |
| `CircularSeal` | pie de página | giro de 48 s, decorativo, se detiene con movimiento reducido |

Reglas: un solo efecto de puntero por superficie (la tarjeta de producto ya
tiene spotlight + glare) y ningún bucle infinito salvo el sello. Toda animación
debe dejar el contenido legible y en su sitio si se apaga.

## Accesibilidad

- Un solo `h1`; jerarquía de encabezados sin saltos.
- `focus-visible` con anillo `--rose-ink`.
- Skip link a la carta.
- Targets táctiles ≥ 44 px.
- `alt` descriptivo en fotos de producto; iconos decorativos con `aria-hidden`.
- Enlaces de WhatsApp con `aria-label` y `rel="noopener noreferrer"`.

## Reglas de contenido

- Sin precios en la carta: siempre “Consultar” + WhatsApp.
- Nada de testimonios inventados.
- Alérgenos visibles en cada tarjeta.
- Horario y zona de entrega viven en `src/data/site.ts` (pendientes de confirmar).
