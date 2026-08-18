"use client"

import { NumBadge } from "./num-badge"
import { SUMMARY } from "@/lib/blocks/platform/mock-data"

type Item = { n: number; label: string; value: string; sub: string }

const items: Item[] = [
  { n: 8, label: "진행중 프로젝트", value: `${SUMMARY.ongoing}건`, sub: "전체 활성 현장" },
  { n: 9, label: "신규 문의", value: `${SUMMARY.inquiries}건`, sub: "최근 7일" },
  { n: 10, label: "승인 대기 견적", value: `${SUMMARY.pendingQuotes}건`, sub: "확인 필요" },
  { n: 11, label: "이번 달 결제 완료", value: `${(SUMMARY.paidThisMonth / 10000).toLocaleString()}만원`, sub: "2026.08" },
]

export function SummaryCards({ columns }: { columns: number }) {
  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {items.map((it) => (
        <button
          key={it.n}
          type="button"
          className="relative flex flex-col gap-2 rounded-md border border-dashed border-foreground/40 bg-card p-4 text-left transition-colors hover:bg-muted"
        >
          <NumBadge n={it.n} />
          <span className="text-xs text-muted-foreground">{it.label}</span>
          <span className="text-2xl font-semibold tabular-nums text-foreground">{it.value}</span>
          <span className="text-[11px] text-muted-foreground">{it.sub}</span>
        </button>
      ))}
    </div>
  )
}
