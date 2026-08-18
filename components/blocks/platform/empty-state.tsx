"use client"

import { NumBadge } from "./num-badge"

export function EmptyState({ onGoInquiries }: { onGoInquiries: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-dashed border-foreground/40 bg-card px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-dashed border-foreground/40 text-foreground/40">
        <span className="text-2xl leading-none">—</span>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">아직 진행중인 프로젝트가 없습니다</p>
        <p className="text-xs text-muted-foreground text-pretty">
          신규 문의를 확인하고 첫 프로젝트를 시작해 보세요.
        </p>
      </div>
      <div className="relative">
        <NumBadge n={20} />
        <button
          type="button"
          onClick={onGoInquiries}
          className="rounded border border-foreground bg-foreground px-4 py-2 text-xs font-medium text-background hover:bg-foreground/85"
        >
          문의 확인하러 가기
        </button>
      </div>
    </div>
  )
}
