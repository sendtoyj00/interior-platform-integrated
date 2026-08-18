"use client"

import { NumBadge } from "./num-badge"
import { STAGES, type StageKey } from "@/lib/blocks/platform/mock-data"

const total = STAGES.reduce((sum, s) => sum + s.count, 0)
const RADIUS = 60
const CIRC = 2 * Math.PI * RADIUS

export function StageChart({
  active,
  onSelect,
}: {
  active: StageKey | null
  onSelect: (key: StageKey) => void
}) {
  let offset = 0

  return (
    <section className="relative rounded-md border border-dashed border-foreground/40 bg-card p-4">
      <NumBadge n={13} />
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">공정단계별 프로젝트 분포</h2>
        <span className="text-[11px] text-muted-foreground">구간 클릭 시 리스트 필터</span>
      </header>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
        <svg viewBox="0 0 160 160" className="h-40 w-40 -rotate-90" role="img" aria-label="공정단계별 분포 도넛 차트">
          {STAGES.map((s) => {
            const frac = s.count / total
            const dash = frac * CIRC
            const isActive = active === s.key
            const el = (
              <circle
                key={s.key}
                cx="80"
                cy="80"
                r={RADIUS}
                fill="none"
                stroke={s.tone}
                strokeWidth={isActive ? 28 : 20}
                strokeDasharray={`${dash} ${CIRC - dash}`}
                strokeDashoffset={-offset}
                className="cursor-pointer transition-[stroke-width]"
                onClick={() => onSelect(s.key)}
              />
            )
            offset += dash
            return el
          })}
          <circle cx="80" cy="80" r={RADIUS - 22} fill="var(--background)" />
        </svg>

        <ul className="grid w-full gap-1.5">
          {STAGES.map((s) => (
            <li key={s.key}>
              <button
                type="button"
                onClick={() => onSelect(s.key)}
                className={`flex w-full items-center justify-between gap-2 rounded px-2 py-1 text-left text-xs transition-colors hover:bg-muted ${
                  active === s.key ? "bg-muted ring-1 ring-foreground/50" : ""
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-sm border border-foreground/30"
                    style={{ background: s.tone }}
                  />
                  <span className="text-foreground">{s.label}</span>
                </span>
                <span className="tabular-nums text-muted-foreground">{s.count}건</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
