/**
 * Adaptado de react-bits — GlareHover
 * https://reactbits.dev  ·  © David Haz  ·  MIT + Commons Clause
 * Ver LICENSE-react-bits.md. Destello plateado al pasar el cursor.
 */
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export function GlareHover({ children, className = "" }: Props) {
  return (
    <div className={`glare ${className}`}>
      {children}
      <span className="glare__beam" aria-hidden="true" />
    </div>
  );
}
