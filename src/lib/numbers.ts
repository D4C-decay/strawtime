const WORDS = [
  "cero",
  "uno",
  "dos",
  "tres",
  "cuatro",
  "cinco",
  "seis",
  "siete",
  "ocho",
  "nueve",
  "diez",
];

/**
 * Número en palabras para titulares ("Seis postres").
 * A partir de once devuelve la cifra, que también se lee bien.
 */
export function countWord(n: number): string {
  const word = WORDS[n];
  if (!word) return String(n);
  return word.charAt(0).toUpperCase() + word.slice(1);
}
