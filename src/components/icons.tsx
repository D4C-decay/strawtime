type IconProps = { className?: string };

export function StrawberryIcon({ className = "" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.15"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 21c-4.15 0-7.4-2.98-7.4-7.05 0-2.62 1.56-5.14 3.95-6.36h6.9c2.39 1.22 3.95 3.74 3.95 6.36C19.4 18.02 16.15 21 12 21Z" />
      <path d="M8.55 7.59c1.05-1.36 2.18-2.04 3.45-2.04s2.4.68 3.45 2.04" />
      <path d="M12 5.55V3.4" />
      <path d="M9.6 4.5 8.35 3.05M14.4 4.5l1.25-1.45" />
      <g strokeWidth="2.1">
        <path d="M9.9 11.4h.01M12 13.8h.01M14.1 11.4h.01M10.9 16.2h.01M13.1 16.2h.01" />
      </g>
    </svg>
  );
}

export function WhatsAppIcon({ className = "" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.42 1.27 4.86L2 22l5.32-1.32a9.9 9.9 0 0 0 4.72 1.2h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Zm0 18.17h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.77.79-3.03-.2-.31a8.17 8.17 0 0 1-1.25-4.36c0-4.52 3.68-8.2 8.21-8.2a8.2 8.2 0 0 1 8.2 8.21c0 4.52-3.68 8.2-8.15 8.2Zm4.5-6.14c-.25-.12-1.46-.72-1.68-.8-.23-.09-.39-.13-.55.12-.17.25-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.13-1.04-.39-1.99-1.23-.73-.65-1.23-1.46-1.37-1.71-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.13-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.31-.22.25-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.52.1.46-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

export function InstagramIcon({ className = "" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.6" />
      <circle cx="12" cy="12" r="3.9" />
      <path d="M17.1 6.9h.01" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowIcon({ className = "" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 12h15M13.5 6.5 19 12l-5.5 5.5" />
    </svg>
  );
}

/** Filete ornamental con rombo central. */
export function Flourish({ className = "" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 180 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2 8h58" />
      <path d="M120 8h58" />
      <path d="M64 8c6 0 9-4.5 15-4.5S88 8 90 8s5-4.5 11-4.5S110 8 116 8" />
      <path d="m90 3.6 3.4 4.4L90 12.4 86.6 8 90 3.6Z" />
    </svg>
  );
}
