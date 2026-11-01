import type { CSSProperties, ReactNode, Ref } from "react";
import { useReveal } from "../lib/useReveal";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "article";
};

/** Aparición suave al entrar en viewport (el CSS decide si se mueve o no). */
export function Reveal({ children, className = "", delay = 0, as = "div" }: Props) {
  const { ref, visible } = useReveal<HTMLElement>();
  const Tag = as;

  return (
    <Tag
      ref={ref as Ref<never>}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
