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
  "⑪",
  "⑫",
  "⑬",
  "⑭",
  "⑮",
]

export function circled(n: number) {
  return CIRCLED[n] ?? `(${n})`
}

/**
 * Small numbered badge shown at the top-left of every interactive element,
 * per the wireframe annotation requirement.
 */
export function Num({ n }: { n: number }) {
  return (
    <span
      className="pointer-events-none absolute -left-2 -top-2 z-20 flex h-4 w-4 select-none items-center justify-center rounded-full border border-foreground bg-background text-[10px] font-bold leading-none text-foreground"
      aria-hidden="true"
    >
      {circled(n)}
    </span>
  )
}
