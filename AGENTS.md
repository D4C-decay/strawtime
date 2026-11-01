# AGENTS.md

> Generado por **opencode-web-kit**. Detalle completo en `docs/` del kit. No borres las secciones: `kit-lint` y el flujo de agentes dependen de ellas.

## Convenciones
- ESM, imports relativos con `.js` si aplica.
- Editar archivos acotados (máx. 2–4). Si hay ambigüedad → parar y preguntar.
- `build` + `lint`/`typecheck` **verdes** antes de commit.
- No commitear secretos (`.env`, claves, `generated/`, `dist/`, `node_modules/`).

## Flujo de trabajo (obrero + supervisor + testers)
- El supervisor dirige y verifica; el builder (`web-builder`) escribe. **Mutex por archivo**: testers y revisores son solo lectura.
- Ciclo: acotar → construir → verificar → (UI) revisar con capturas → cerrar.
- Testing activo: `test-coordinator` despacha 5 testers en paralelo contra `$SITE_URL`; el diagnóstico pasa a `plan-coordinator` (triangula + `abogado-del-diablo`) → builder → `build-verifier` + re-test.

## Oleadas de constructores (A/B/C) — convención por defecto
Trabajo por **oleadas**; nunca se lanzan todos los escritores a la vez.
1. **Oleada 0 — Freeze (1 escritor: el supervisor):** rutas, `layout`, tokens, diccionarios, `package.json`, **deps instaladas** y **stubs** de componentes con firmas. Se commitea **antes** de ramificar.
2. **Oleada 1 — Constructores A, B, C en paralelo**, con **territorios de archivos disjuntos** (un archivo, un dueño). A/B/C **no** tocan los compartidos congelados ni `git`.
3. **Oleada 2 — Verificación:** un solo `build` (`build-verifier`, recurso único); después `ui-reviewer` ‖ `code-reviewer` ‖ `perf-auditor` en paralelo.
4. **Oleada 3 — Testing:** `test-coordinator` → 5 testers en paralelo.
5. **Oleada 4 — Cierre:** `memory-keeper` → `git-committer` (con permiso).

Notas operativas (obligatorias):
- **Trabajan todos sobre el mismo working tree**: la única barrera es la disciplina de territorios. El "mutex" es por archivo, no por máquina.
- Durante la Oleada 1: builders verifican **solo** con `npx tsc --noEmit` (no `build`, no `dev`); `build`/server son singletons. Ajusta `KIT_AUTO_VERIFY=0` para no disparar builds concurrentes.
- **Briefs autocontenidos** por builder (no comparten contexto): objetivo, lista de archivos permitidos, lista de "no tocar", ruta de `DESIGN.md`, skills a cargar y criterio de "terminado".
- **Contratos entre builders** se fijan en el Freeze (stubs exportados): nadie cambia firmas a media oleada.
- Si un builder se atasca, el supervisor **asume su territorio**.
- Cambios pesados/arriesgados (p. ej. 3D) → **sub-oleada propia** al final.

## Hoja de ruta de 16 pasos (orden de fases del proyecto web)
`1.diseño del sistema · 2.arquitectura · 3.front end · 4.apis y backend · 5.base de datos (supabase/postgresql) · 6.auth y permisos · 7.hosting y nube · 8.CI/CD y git · 9.seguridad · 10.rate limit · 11.caché y CDN · 12.errores y logs · 13.monitoreo · 14.testing · 15.escalabilidad · 16.otros`
Cada paso se aborda como una fase con su propio ciclo acotar→construir→verificar→cerrar; no se avanza al siguiente sin el gate en verde.

### Diferido por defecto
Salvo indicación expresa, el trabajo se limita al **front end** (pasos 1–3, con `DESIGN.md` como contrato). Backend, BD, auth, hosting, CI/CD, seguridad, rate limit, caché/CDN, logs, monitoreo, escalabilidad y Codex/MCP quedan **diferidos**.

## Verificación
- Usa los scripts que **existan** en el `package.json` del proyecto y de sus subpaquetes: `typecheck`|`lint` → `build` (con `npm run <script>` en el directorio correspondiente). Si un script no existe, dilo; no inventes comandos ni rutas.
- Si el proyecto sirve un build SSR/standalone, **tras `build` reinicia el server** (si no, sirve HTML sin CSS). El plugin `web-restart-guard` avisa.
- Kit/agentes/plugins: `npm run lint` (kit-lint) + `npx tsc --noEmit`.
- `auto-verify` corre al final del turno (condicional, solo con cambios de código) y escribe `.opencode/last-verify.md`; **los builders lo leen antes de dar por bueno su cambio**. Desactivable: `KIT_AUTO_VERIFY=0`.

## Consejo de planeación
- Objetivo de envergadura → `plan-coordinator` despacha a los expertos, refuta con `abogado-del-diablo` y entrega el plan. No se improvisa.

## Privacidad de modelos
- PII/secretos **solo** a modelos zero-retention (`glm-5.3-flash-free`, `deepseek-v4.1-flash-free`, `space-bunny-free`, `longcat-2.5-preview-free`).
- Nunca a `nemotron-*` (trial NVIDIA), `big-pickle` ni `mimo` (entrenan durante el periodo free). `small_model` usa `nemotron-3.5-lightning-free`.

## Git
- `git commit`/`git push` **siempre preguntan**. `git add` solo de los archivos implicados. Nunca `--force`/`--no-verify`.

## knowledge graph (graphify)
- Grafo en `graphify-out/` (commiteado). Si existe `graphify-out/graph.json`, antes de un grep/búsqueda de código correr `graphify query "<pregunta>"`; `graphify path` para relaciones, `graphify explain` para conceptos. Subagentes que exploren código: meter esta regla en su prompt.
- Tras modificar código: `graphify update .` (incremental, sin coste de API).
- `graphify-out/GRAPH_REPORT.md` solo para revisión amplia de arquitectura.
- Si el CLI `graphify` no está en PATH: `uv tool install graphifyy` (uv se instala con el script oficial de astral.sh).

## Continuidad
- Fuente de verdad: **`MEMORY.md`** (se carga al inicio de cada sesión vía `AGENTS.md`).
- **Al inicio — solo el primer turno, UNA vez por sesión:** dar continuidad al "Próximo paso" **una sola vez**; **no releer `MEMORY.md` ni repetir el mensaje tras cada respuesta**. Hasta el próximo arranque de sesión no se vuelve a tocar.
- **Al cierre — solo cierre explícito del usuario (nunca tras cada respuesta/turno):** `memory-keeper` actualiza `MEMORY.md` (verificar el diff antes de commitear).
- Comando `/estado` resume memoria + git + servicios + grafo.
