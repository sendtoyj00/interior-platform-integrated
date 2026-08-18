const CIRCLED = [
  "",
  "①",
  "②",
  "③",
  "④",
  "⑤",
  "⑥",
  "⑦",
  "⑧",
  "⑨",
  "⑩",
] as const

export function Marker({ n }: { n: number }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -left-2 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-foreground bg-background text-[11px] font-bold leading-none text-foreground"
      title={`UI 요소 ${n}`}
    >
      {CIRCLED[n] ?? n}
    </span>
  )
}
