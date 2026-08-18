// 상호작용 요소 좌상단 번호 표기용 배지
export function NumBadge({ n }: { n: number }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -left-2 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-foreground bg-background text-[10px] font-semibold leading-none text-foreground"
    >
      {n}
    </span>
  )
}
