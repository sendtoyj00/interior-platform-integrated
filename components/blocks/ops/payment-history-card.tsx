"use client"

import { useMemo, useState } from "react"
import { Num } from "@/components/blocks/ops/num"
import { won, type Milestone } from "@/lib/blocks/ops/payment-mock"

const statusLabel: Record<Milestone["status"], string> = {
  pending: "대기",
  done: "완료",
}

/**
 * 결제 이력 조회 (읽기 전용) — 고객 마이페이지 / 업체 대시보드 양쪽에
 * 동일하게 임베드 가능한 카드형 컴포넌트.
 * 순수 프레젠테이션: 데이터(milestones)만 주입받아 표시한다.
 */
export function PaymentHistoryCard({
  milestones,
  compact = false,
}: {
  milestones: Milestone[]
  compact?: boolean
}) {
  const [selected, setSelected] = useState<Milestone | null>(null)

  const summary = useMemo(() => {
    const total = milestones.reduce((s, m) => s + m.amount, 0)
    const paid = milestones
      .filter((m) => m.status === "done")
      .reduce((s, m) => s + m.amount, 0)
    const remaining = total - paid
    const percent = total === 0 ? 0 : Math.round((paid / total) * 100)
    return { total, paid, remaining, percent }
  }, [milestones])

  // 빈 상태 (Empty State)
  if (milestones.length === 0) {
    return (
      <div className="border border-foreground bg-background">
        <CardHeader />
        <div className="flex flex-col items-center justify-center gap-2 border-t border-dashed border-foreground/50 px-4 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center border border-foreground/40 text-lg text-muted-foreground">
            ₩
          </div>
          <p className="text-sm font-medium">등록된 결제 정보가 없습니다</p>
          <p className="text-xs text-muted-foreground">
            업체에서 결제 단계를 등록하면 이곳에 표시됩니다.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-foreground bg-background">
      <CardHeader />

      {/* ② 상단 요약 바 */}
      <div className="relative border-t border-foreground p-4">
        <Num n={2} />
        <div className="grid grid-cols-3 gap-2 text-center">
          <SummaryCell label="총 계약금액" value={won(summary.total)} />
          <SummaryCell label="완료 결제" value={won(summary.paid)} />
          <SummaryCell label="잔여 결제" value={won(summary.remaining)} />
        </div>

        {/* 진행률 프로그레스바 */}
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>결제 진행률</span>
            <span className="font-bold text-foreground">{summary.percent}%</span>
          </div>
          <div
            className="h-3 w-full border border-foreground bg-background"
            role="progressbar"
            aria-valuenow={summary.percent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-foreground transition-all"
              style={{ width: `${summary.percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ① 결제 단계별 타임라인 카드 */}
      <div className="relative border-t border-foreground p-4">
        <Num n={1} />
        <p className="mb-3 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          결제 타임라인
        </p>
        <ol className="flex flex-col">
          {milestones.map((m, i) => {
            const done = m.status === "done"
            return (
              <li key={m.id} className="flex gap-3">
                {/* timeline rail */}
                <div className="flex flex-col items-center">
                  <span
                    className={[
                      "mt-1 flex h-4 w-4 shrink-0 items-center justify-center border border-foreground text-[9px]",
                      done ? "bg-foreground text-background" : "bg-background",
                    ].join(" ")}
                    aria-hidden
                  >
                    {done ? "✓" : ""}
                  </span>
                  {i < milestones.length - 1 && (
                    <span className="my-1 w-px flex-1 bg-foreground/40" aria-hidden />
                  )}
                </div>

                {/* clickable card ③ */}
                <button
                  type="button"
                  onClick={() => setSelected(m)}
                  className="relative mb-3 flex-1 border border-foreground bg-background p-3 text-left hover:bg-muted"
                >
                  {i === 0 && <Num n={3} />}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{m.name}</p>
                      <p className="mt-0.5 text-sm">{won(m.amount)}</p>
                    </div>
                    <StatusBadge status={m.status} />
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-dashed border-foreground/40 pt-2 text-[11px] text-muted-foreground">
                    <span>완료일: {done ? m.confirmedDate : "—"}</span>
                    <span className="underline">상세 보기</span>
                  </div>
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      {/* ③ 상세 팝업 */}
      {selected && (
        <DetailPopup milestone={selected} onClose={() => setSelected(null)} compact={compact} />
      )}
    </div>
  )
}

function CardHeader() {
  return (
    <div className="flex items-center justify-between border-b border-foreground/30 bg-muted/60 px-4 py-2">
      <p className="text-xs font-bold">결제 이력 조회</p>
      <span className="border border-foreground/50 px-1.5 py-0.5 text-[10px] text-muted-foreground">
        읽기 전용
      </span>
    </div>
  )
}

function SummaryCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-foreground/40 p-2">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-xs font-bold tabular-nums">{value}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: Milestone["status"] }) {
  const done = status === "done"
  return (
    <span
      className={[
        "shrink-0 border px-2 py-0.5 text-[10px] font-bold",
        done
          ? "border-foreground bg-foreground text-background"
          : "border-foreground bg-background text-foreground",
      ].join(" ")}
    >
      {statusLabel[status]}
    </span>
  )
}

function DetailPopup({
  milestone,
  onClose,
  compact,
}: {
  milestone: Milestone
  onClose: () => void
  compact: boolean
}) {
  const done = milestone.status === "done"
  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center bg-foreground/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="결제 단계 상세"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm border border-foreground bg-background"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-foreground px-4 py-2">
          <p className="text-xs font-bold">결제 단계 상세</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="border border-foreground px-2 text-xs hover:bg-muted"
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col gap-3 p-4 text-sm">
          <DetailRow label="단계명" value={milestone.name} />
          <DetailRow label="금액" value={won(milestone.amount)} />
          <DetailRow label="상태" value={statusLabel[milestone.status]} />
          <DetailRow label="입금기한" value={milestone.dueDate || "—"} />
          <DetailRow label="입금확인일" value={done ? milestone.confirmedDate : "미확인"} />
          <div>
            <p className="text-[11px] text-muted-foreground">메모</p>
            <p className="mt-1 min-h-9 border border-foreground/40 p-2 text-xs">
              {milestone.memo || (done ? "메모 없음" : "입금 확인 전입니다.")}
            </p>
          </div>
          {compact && (
            <p className="text-[10px] text-muted-foreground">
              * 임베드 컨텍스트에 따라 표시 정보는 동일합니다.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-dashed border-foreground/30 pb-1">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="text-xs font-medium tabular-nums">{value}</span>
    </div>
  )
}
