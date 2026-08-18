"use client"

import { NumBadge } from "./num-badge"
import { PROJECTS, STAGES, stageLabel, type Project, type StageKey } from "@/lib/blocks/platform/mock-data"

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-foreground/70" style={{ width: `${value}%` }} />
      </div>
      <span className="text-[11px] tabular-nums text-muted-foreground">{value}%</span>
    </div>
  )
}

export function ProjectTable({
  filter,
  onSelectStage,
  onClearFilter,
  onRowClick,
  variant,
}: {
  filter: StageKey | null
  onSelectStage: (key: StageKey) => void
  onClearFilter: () => void
  onRowClick: (p: Project) => void
  variant: "desktop" | "mobile"
}) {
  const rows = filter ? PROJECTS.filter((p) => p.stage === filter) : PROJECTS

  return (
    <section className="rounded-md border border-dashed border-foreground/40 bg-card">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-foreground/30 p-4">
        <h2 className="text-sm font-semibold text-foreground">진행중 프로젝트</h2>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <NumBadge n={14} />
            <input
              type="text"
              placeholder="프로젝트 검색"
              className="h-8 w-40 rounded border border-foreground/40 bg-background px-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>
          <div className="relative">
            <NumBadge n={12} />
            <select
              value={filter ?? ""}
              onChange={(e) => {
                const v = e.target.value
                if (!v) onClearFilter()
                else onSelectStage(v as StageKey)
              }}
              className="h-8 rounded border border-foreground/40 bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              aria-label="공정단계 필터"
            >
              <option value="">전체 공정단계</option>
              {STAGES.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {filter && (
        <div className="flex items-center gap-2 border-b border-dashed border-foreground/20 px-4 py-2 text-xs">
          <span className="text-muted-foreground">필터:</span>
          <span className="rounded-full border border-foreground/40 px-2 py-0.5 text-foreground">
            {stageLabel(filter)}
          </span>
          <button
            type="button"
            onClick={onClearFilter}
            className="ml-1 text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            초기화
          </button>
        </div>
      )}

      {variant === "desktop" ? (
        <table className="w-full text-left text-xs">
          <thead className="text-muted-foreground">
            <tr className="border-b border-dashed border-foreground/20">
              <th className="p-3 font-medium">
                <span className="relative inline-flex">
                  <NumBadge n={15} />
                  <input type="checkbox" aria-label="전체 선택" className="ml-2 accent-foreground" />
                </span>
              </th>
              <th className="p-3 font-medium">프로젝트명</th>
              <th className="p-3 font-medium">고객명</th>
              <th className="p-3 font-medium">현재 공정단계</th>
              <th className="p-3 font-medium">진행률</th>
              <th className="p-3 font-medium">최근 업데이트</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p, i) => (
              <tr
                key={p.id}
                onClick={() => onRowClick(p)}
                className="relative cursor-pointer border-b border-dashed border-foreground/10 last:border-0 hover:bg-muted"
              >
                <td className="p-3">
                  {i === 0 && <NumBadge n={16} />}
                  <input
                    type="checkbox"
                    aria-label={`${p.name} 선택`}
                    className="ml-2 accent-foreground"
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                <td className="p-3 font-medium text-foreground">{p.name}</td>
                <td className="p-3 text-muted-foreground">{p.customer}</td>
                <td className="p-3 text-foreground">{stageLabel(p.stage)}</td>
                <td className="p-3">
                  <ProgressBar value={p.progress} />
                </td>
                <td className="p-3 tabular-nums text-muted-foreground">{p.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <ul className="divide-y divide-dashed divide-foreground/10">
          {rows.map((p, i) => (
            <li key={p.id} className="relative">
              {i === 0 && <NumBadge n={16} />}
              <button
                type="button"
                onClick={() => onRowClick(p)}
                className="flex w-full flex-col gap-2 p-4 text-left hover:bg-muted"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{p.name}</span>
                  <span className="text-[11px] text-muted-foreground">{p.updatedAt}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{p.customer}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-foreground">{stageLabel(p.stage)}</span>
                </div>
                <ProgressBar value={p.progress} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <footer className="relative flex items-center justify-center gap-1 p-3">
        <NumBadge n={17} />
        {["‹", "1", "2", "3", "›"].map((t, i) => (
          <button
            key={i}
            type="button"
            className={`h-7 min-w-7 rounded border border-foreground/30 px-2 text-xs text-foreground hover:bg-muted ${
              t === "1" ? "bg-muted" : "bg-background"
            }`}
          >
            {t}
          </button>
        ))}
      </footer>
    </section>
  )
}
