"use client"

import { NumBadge } from "./num-badge"
import type { Project } from "@/lib/blocks/platform/mock-data"

export function NavModal({
  project,
  onConfirm,
  onCancel,
}: {
  project: Project
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-foreground/30 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="공정관리 이동 확인"
        className="relative w-full max-w-sm rounded-md border border-foreground bg-card p-5 shadow-lg"
      >
        <h3 className="text-sm font-semibold text-foreground">공정관리 화면으로 이동</h3>
        <p className="mt-2 text-xs text-muted-foreground text-pretty">
          {`"${project.name}" 프로젝트의 공정관리 화면(SCR-PROC-001)으로 이동합니다.`}
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <div className="relative">
            <NumBadge n={18} />
            <button
              type="button"
              onClick={onCancel}
              className="rounded border border-foreground/40 bg-background px-3 py-1.5 text-xs text-foreground hover:bg-muted"
            >
              취소
            </button>
          </div>
          <div className="relative">
            <NumBadge n={19} />
            <button
              type="button"
              onClick={onConfirm}
              className="rounded border border-foreground bg-foreground px-3 py-1.5 text-xs text-background hover:bg-foreground/85"
            >
              이동
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Toast({ message }: { message: string }) {
  return (
    <div className="pointer-events-none absolute bottom-4 left-1/2 z-40 -translate-x-1/2">
      <div className="relative rounded border border-foreground bg-foreground px-4 py-2 text-xs text-background shadow-md">
        <NumBadge n={21} />
        {message}
      </div>
    </div>
  )
}
