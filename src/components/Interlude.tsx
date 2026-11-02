import { ScrollExpand } from "./reactbits/ScrollExpand";

export function Interlude() {
  return (
    <ScrollExpand
      src="/img/temporada.webp"
      alt="Postre de temporada StrawTime coronado con fresas frescas"
      eyebrow="El ritmo de la casa"
      kicker="Fresas del día, al momento"
      hint="Desliza para abrir"
      labelId="interludio-titulo"
    >
      <div className="se__content">
        <p className="eyebrow eyebrow--center">El ritmo de la casa</p>
        <h2 className="se__title" id="interludio-titulo">
          Solo cuando la fresa <em>pide salir</em>
        </h2>
        <p className="se__lead">
          Sin existencias acumuladas. Si hoy no hay, cerramos la vitrina. Así se
          conserva el brillo que tiene que tener un postre de fresa.
        </p>
      </div>
    </ScrollExpand>
  );
}
