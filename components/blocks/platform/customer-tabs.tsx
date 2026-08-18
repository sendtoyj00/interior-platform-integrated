"use client"

import { NumBadge } from "./num-badge"
import {
  QUOTE_SUMMARY,
  CONTRACT_SUMMARY,
  PROCESS_TIMELINE,
  PAYMENT_HISTORY,
  PHOTO_GALLERY,
  krw,
} from "@/lib/blocks/platform/mock-data"

// 임베드 화면 표시용 헤더 (SCR-XXX 라벨 + 읽기전용 표시)
function EmbedHead({ scr, readonly }: { scr: string; readonly?: boolean }) {
  return (
    <div className="mb-3 flex items-center justify-between border-b border-dashed border-foreground/30 pb-2">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">임베드 · {scr}</span>
      {readonly && (
        <span className="rounded-full border border-foreground/40 px-2 py-0.5 text-[10px] text-muted-foreground">
          읽기전용
        </span>
      )}
    </div>
  )
}

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="rounded-md border border-foreground/40 bg-background p-4">{children}</div>
}

/* ③ 견적 탭 */
export function QuoteTab({ startNum }: { startNum: number }) {
  return (
    <Panel>
      <EmbedHead scr="SCR-QUOTE-002" />
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-foreground">견적서 {QUOTE_SUMMARY.quoteNo}</p>
          <p className="text-xs text-muted-foreground">
            발행 {QUOTE_SUMMARY.issuedAt} · 유효기한 {QUOTE_SUMMARY.validUntil}
          </p>
        </div>
        <div className="relative">
          <NumBadge n={startNum} />
          <button
            type="button"
            className="whitespace-nowrap rounded border border-foreground/50 px-3 py-1 text-xs text-foreground hover:bg-muted"
          >
            상세보기 →
          </button>
        </div>
      </div>

      <dl className="mt-4 divide-y divide-foreground/15 border-y border-foreground/15">
        {QUOTE_SUMMARY.items.map((it) => (
          <div key={it.name} className="flex items-center justify-between py-2 text-xs">
            <dt className="text-muted-foreground">{it.name}</dt>
            <dd className="tabular-nums text-foreground">{krw(it.amount)}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs font-medium text-foreground">견적 합계</span>
        <span className="text-base font-bold tabular-nums text-foreground">{krw(QUOTE_SUMMARY.total)}</span>
      </div>
    </Panel>
  )
}

/* ④ 계약 탭 */
export function ContractTab() {
  const s = CONTRACT_SUMMARY
  return (
    <Panel>
      <EmbedHead scr="SCR-CONT-001" readonly />
      <div className="flex items-center gap-2">
        <span className="rounded-full border border-foreground bg-foreground px-2.5 py-0.5 text-[11px] font-semibold text-background">
          {s.status}
        </span>
        <span className="text-sm font-semibold text-foreground">계약서 {s.contractNo}</span>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
        <div>
          <dt className="text-muted-foreground">계약 금액</dt>
          <dd className="mt-0.5 font-semibold tabular-nums text-foreground">{krw(s.amount)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">체결일</dt>
          <dd className="mt-0.5 text-foreground">{s.signedAt}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">공사 기간</dt>
          <dd className="mt-0.5 text-foreground">{s.period}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">입금 상태</dt>
          <dd className="mt-0.5 text-foreground">{s.downPayment}</dd>
        </div>
      </dl>
    </Panel>
  )
}

/* ⑤ 공정 탭 — 읽기전용 타임라인 */
export function ProcessTab() {
  return (
    <Panel>
      <EmbedHead scr="SCR-PROC-001" readonly />
      <ol className="relative ml-2 border-l border-foreground/30">
        {PROCESS_TIMELINE.map((step) => (
          <li key={step.key} className="relative mb-5 pl-5 last:mb-0">
            <span
              aria-hidden="true"
              className={`absolute -left-[6px] top-0.5 h-3 w-3 rounded-full border ${
                step.state === "done"
                  ? "border-foreground bg-foreground"
                  : step.state === "active"
                    ? "border-foreground bg-background ring-2 ring-foreground/40"
                    : "border-foreground/40 bg-background"
              }`}
            />
            <div className="flex items-center justify-between gap-2">
              <span
                className={`text-xs ${step.state === "todo" ? "text-muted-foreground" : "font-medium text-foreground"}`}
              >
                {step.label}
                {step.state === "active" && (
                  <span className="ml-2 rounded border border-foreground/50 px-1.5 py-0.5 text-[10px]">진행중</span>
                )}
              </span>
              <span className="tabular-nums text-[11px] text-muted-foreground">{step.date}</span>
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  )
}

/* ⑥ 결제 탭 */
export function PaymentTab() {
  return (
    <Panel>
      <EmbedHead scr="SCR-PAY-002" />
      <ul className="divide-y divide-foreground/15">
        {PAYMENT_HISTORY.map((p) => (
          <li key={p.label} className="flex items-center justify-between gap-2 py-3">
            <div>
              <p className="text-xs font-medium text-foreground">{p.label}</p>
              <p className="text-[11px] text-muted-foreground">{p.date}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs tabular-nums text-foreground">{krw(p.amount)}</span>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] ${
                  p.state === "완료"
                    ? "border-foreground bg-foreground text-background"
                    : "border-foreground/40 text-muted-foreground"
                }`}
              >
                {p.state}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

/* ⑦ 사진 탭 — 고객 모드 갤러리 */
export function PhotoTab() {
  return (
    <Panel>
      <EmbedHead scr="SCR-PROC-002" />
      <p className="mb-3 text-[11px] text-muted-foreground">고객 모드 · 공유된 현장 사진만 표시</p>
      <div className="grid grid-cols-3 gap-2">
        {PHOTO_GALLERY.map((ph) => (
          <figure key={ph.id} className="overflow-hidden rounded border border-foreground/30">
            <div
              className="flex aspect-square items-center justify-center text-[10px] text-background"
              style={{ backgroundColor: `hsl(0 0% ${Math.round((1 - ph.tone) * 60 + 20)}%)` }}
            >
              사진
            </div>
            <figcaption className="flex items-center justify-between px-1.5 py-1 text-[10px] text-muted-foreground">
              <span className="truncate">{ph.stage}</span>
              <span className="tabular-nums">{ph.date}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Panel>
  )
}
