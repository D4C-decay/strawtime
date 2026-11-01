/**
 * Adaptado de react-bits — CircularText
 * https://reactbits.dev  ·  © David Haz  ·  MIT + Commons Clause
 * Ver LICENSE-react-bits.md. Sin dependencias: SVG textPath + CSS.
 *
 * Tampón de tinta: el texto gira alrededor del sello muy despacio. Es
 * decorativo (aria-hidden) y se detiene con movimiento reducido.
 */
import { useId } from "react";
import { StrawberryIcon } from "../icons";

type Props = {
  text?: string;
  className?: string;
};

export function CircularSeal({
  text = "HECHO EN CASA · STRAWTIME ·",
  className = "",
}: Props) {
  const rawId = useId();
  const pathId = `seal-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <div className={`stamp ${className}`} aria-hidden="true">
      <svg className="stamp__svg" viewBox="0 0 120 120" focusable="false">
        <defs>
          <path
            id={pathId}
            d="M60 60m-43 0a43 43 0 1 1 86 0a43 43 0 1 1-86 0"
          />
        </defs>
        <circle className="stamp__ring" cx="60" cy="60" r="57" />
        <circle className="stamp__ring stamp__ring--dashed" cx="60" cy="60" r="31" />
        <g className="stamp__ring-text">
          <text className="stamp__text">
            <textPath href={`#${pathId}`} startOffset="0">
              {text}
            </textPath>
          </text>
        </g>
      </svg>
      <StrawberryIcon className="stamp__berry" />
    </div>
  );
}
