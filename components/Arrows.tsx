/** Bold stroke arrows, sized to the surrounding text via 1em. */

function ArrowSvg({ d, className }: { d: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block align-[-0.12em] ${className ?? ""}`}
      aria-hidden="true"
    >
      <path
        d={d}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowLeft({ className }: { className?: string }) {
  return <ArrowSvg d="M11 5l-7 7 7 7M4 12h16" className={className} />;
}

export function ArrowRight({ className }: { className?: string }) {
  return <ArrowSvg d="M13 5l7 7-7 7M20 12H4" className={className} />;
}
