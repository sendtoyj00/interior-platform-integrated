"use client"

import { useState } from "react"
import {
  INITIAL_LOGS,
  EVENT_LABEL,
  maskPhone,
  formatSentAt,
  type NotifLog,
  type NotifEventType,
  type NotifStatus,
} from "@/lib/blocks/ops/notification-mock"
import { Num } from "./num"
import { COMPANY_MENU, MENU_LABEL } from "@/lib/menu-labels"

type Device = "desktop" | "mobile"
type EventFilter = "all" | NotifEventType
type StatusFilter = "all" | NotifStatus

type Toast = { id: number; message: string }
let toastSeq = 0

export function NotificationApp({
  device,
  emptyState = false,
}: {
  device: Device
  emptyState?: boolean
}) {
  const isMobile = device === "mobile"

  const [logs, setLogs] = useState<NotifLog[]>(
    emptyState ? [] : INITIAL_LOGS,
  )
  const [eventFilter, setEventFilter] = useState<EventFilter>("all")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [resendId, setResendId] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [status, setStatus] = useState(
    emptyState
      ? "발송 이력 없음 — 이벤트 발생 시 자동 기록됩니다."
      : "조회 완료 — 발송 이력 모니터링 중.",
  )

  const pushToast = (message: string) => {
    const id = ++toastSeq
    setToasts((t) => [...t, { id, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600)
  }

  const filtered = logs.filter((l) => {
    if (eventFilter !== "all" && l.eventType !== eventFilter) return false
    if (statusFilter !== "all" && l.status !== statusFilter) return false
    return true
  })

  const resend = (id: string) => {
    setLogs((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status: "success",
              sentAt: new Date().toISOString(),
              failReason: undefined,
            }
          : l,
      ),
    )
    const target = logs.find((l) => l.id === id)
    setResendId(null)
    setStatus(`재발송 완료 — ${target ? maskPhone(target.phone) : ""} · 상태 실패 → 성공`)
    pushToast("재발송 처리되었습니다. 발송 결과는 목록에 반영됩니다.")
  }

  const selected = logs.find((l) => l.id === selectedId) ?? null
  const resendTarget = logs.find((l) => l.id === resendId) ?? null

  const roleLabel = "업체 관리자"
  const menuItems = COMPANY_MENU
  const activeMenu = MENU_LABEL.notification

  const successCount = logs.filter((l) => l.status === "success").length
  const failCount = logs.filter((l) => l.status === "fail").length

  return (
    <div className="relative flex flex-col border border-foreground bg-background text-foreground">
      {/* ===== HEADER ===== */}
      <header className="flex items-center justify-between gap-4 border-b border-foreground bg-secondary px-4 py-3">
        <div className="flex h-8 items-center justify-center border border-foreground px-3 text-sm font-bold tracking-tight">
          [ LOGO ] 인테리어 플랫폼
        </div>
        <div className="flex items-center gap-3">
          <span className="border border-dashed border-foreground/50 px-2 py-1 text-xs">
            역할: <strong>{roleLabel}</strong>
          </span>
          <div className="relative">
            <Num n={6} />
            <button className="border border-foreground px-3 py-1 text-xs hover:bg-muted">
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className={isMobile ? "flex flex-col" : "flex"}>
        {/* ===== SIDEBAR ===== */}
        <aside
          className={
            isMobile
              ? "border-b border-foreground bg-muted/40 p-2"
              : "w-52 shrink-0 border-r border-foreground bg-muted/40 p-3"
          }
        >
          <div className="relative">
            <Num n={7} />
            <p className="mb-2 px-1 text-[11px] font-bold text-muted-foreground">
              업체 관리자 · 플랫폼 메뉴
            </p>
          </div>
          <nav
            className={
              isMobile
                ? "flex flex-wrap gap-1"
                : "flex flex-col gap-1"
            }
          >
            {menuItems.map((m) => (
              <span
                key={m}
                aria-current={m === activeMenu ? "page" : undefined}
                className={[
                  "border px-2 py-1 text-xs",
                  m === activeMenu
                    ? "border-foreground bg-foreground text-background"
                    : "border-transparent text-foreground hover:bg-muted",
                ].join(" ")}
              >
                {m}
              </span>
            ))}
          </nav>
        </aside>

        {/* ===== BODY ===== */}
        <main className="flex-1 p-4">
          <div className="mb-3">
            <h2 className="text-base font-bold">알림관리 · 발송 이력 조회</h2>
            <p className="text-xs text-muted-foreground">
              실제 발송은 이벤트 기반 자동 트리거 · 본 화면은 조회/모니터링 전용
            </p>
          </div>

          {/* filters */}
          <div
            className={
              isMobile
                ? "mb-4 flex flex-col gap-3"
                : "mb-4 flex flex-wrap items-end gap-4"
            }
          >
            {/* ① event type dropdown */}
            <div className="relative">
              <Num n={1} />
              <label className="mb-1 block text-[11px] font-bold text-muted-foreground">
                이벤트 유형
              </label>
              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value as EventFilter)}
                className="border border-foreground bg-background px-2 py-1.5 text-xs"
              >
                <option value="all">전체</option>
                <option value="quote">견적발송</option>
                <option value="contract">계약승인요청</option>
                <option value="progress">공정업데이트</option>
                <option value="payment">결제상태변경</option>
              </select>
            </div>

            {/* ② status filter tabs */}
            <div className="relative">
              <Num n={2} />
              <span className="mb-1 block text-[11px] font-bold text-muted-foreground">
                발송 상태
              </span>
              <div role="tablist" aria-label="발송 상태 필터" className="flex border border-foreground">
                <StatTab active={statusFilter === "all"} onClick={() => setStatusFilter("all")}>
                  전체 ({logs.length})
                </StatTab>
                <StatTab active={statusFilter === "success"} onClick={() => setStatusFilter("success")} border>
                  성공 ({successCount})
                </StatTab>
                <StatTab active={statusFilter === "fail"} onClick={() => setStatusFilter("fail")} border>
                  실패 ({failCount})
                </StatTab>
              </div>
            </div>
          </div>

          {/* empty state */}
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 border border-dashed border-foreground/50 py-16 text-center">
              <div className="flex h-10 w-10 items-center justify-center border border-foreground text-lg">
                ∅
              </div>
              <p className="text-sm font-bold">발송 이력이 없습니다</p>
              <p className="text-xs text-muted-foreground">
                이벤트 발생 시 알림이 자동 발송되며 이곳에 기록됩니다.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="border border-dashed border-foreground/50 py-12 text-center text-xs text-muted-foreground">
              선택한 필터 조건에 해당하는 발송 이력이 없습니다.
            </div>
          ) : isMobile ? (
            /* ===== ③ MOBILE: card list ===== */
            <ul className="flex flex-col gap-2">
              {filtered.map((l) => (
                <li key={l.id} className="relative border border-foreground">
                  <button
                    onClick={() => setSelectedId(l.id)}
                    className="flex w-full flex-col gap-1.5 p-3 text-left hover:bg-muted/50"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs">{maskPhone(l.phone)}</span>
                      <StatusBadge status={l.status} />
                    </div>
                    <div className="text-xs font-bold">{l.template}</div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <EventBadge type={l.eventType} />
                      <span className="text-[11px] text-muted-foreground">
                        {formatSentAt(l.sentAt)}
                      </span>
                    </div>
                  </button>
                  {l.status === "fail" && (
                    <div className="relative border-t border-foreground p-2">
                      <Num n={4} />
                      <button
                        onClick={() => setResendId(l.id)}
                        className="w-full border border-foreground px-2 py-1 text-xs font-bold hover:bg-foreground hover:text-background"
                      >
                        재발송
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            /* ===== ③ DESKTOP: table ===== */
            <div className="relative overflow-x-auto border border-foreground">
              <Num n={3} />
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-foreground bg-muted/60">
                    <Th>수신자 연락처</Th>
                    <Th>알림 템플릿명</Th>
                    <Th>이벤트 유형</Th>
                    <Th>발송 시각</Th>
                    <Th>상태</Th>
                    <Th>작업</Th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((l) => (
                    <tr
                      key={l.id}
                      onClick={() => setSelectedId(l.id)}
                      className={[
                        "cursor-pointer border-b border-foreground/20 hover:bg-muted/40",
                        selectedId === l.id ? "bg-muted/60" : "",
                      ].join(" ")}
                    >
                      <Td>
                        <span className="font-mono">{maskPhone(l.phone)}</span>
                      </Td>
                      <Td>{l.template}</Td>
                      <Td>
                        <EventBadge type={l.eventType} />
                      </Td>
                      <Td>{formatSentAt(l.sentAt)}</Td>
                      <Td>
                        <StatusBadge status={l.status} />
                      </Td>
                      <Td>
                        {l.status === "fail" ? (
                          <div className="relative inline-block">
                            <Num n={4} />
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setResendId(l.id)
                              }}
                              className="border border-foreground px-2 py-1 text-[11px] font-bold hover:bg-foreground hover:text-background"
                            >
                              재발송
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-muted-foreground">—</span>
                        )}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="mt-3 text-[11px] text-muted-foreground">
            개인정보 보호(REQ-NFR-007) — 수신자 연락처는 가운데 자리 마스킹 처리되어 표시됩니다.
          </p>
        </main>
      </div>

      {/* ===== FOOTER (status message) ===== */}
      <footer className="relative border-t border-foreground bg-secondary px-4 py-2">
        <Num n={8} />
        <p className="text-xs text-muted-foreground">
          <span className="font-bold text-foreground">STATUS:</span> {status}
        </p>
      </footer>

      {/* ===== ⑤ DETAIL PANEL (row click) ===== */}
      {selected && (
        <DetailPanel log={selected} onClose={() => setSelectedId(null)} />
      )}

      {/* ===== RESEND CONFIRM MODAL ===== */}
      {resendTarget && (
        <div
          className="absolute inset-0 z-40 flex items-center justify-center bg-foreground/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="재발송 확인"
        >
          <div className="relative w-full max-w-sm border border-foreground bg-background p-4">
            <Num n={4} />
            <h3 className="mb-1 text-sm font-bold">재발송 확인</h3>
            <p className="mb-4 text-xs text-muted-foreground">
              아래 실패 건을 다시 발송하시겠습니까?
            </p>
            <dl className="mb-4 flex flex-col gap-1.5 border border-dashed border-foreground/50 p-3 text-xs">
              <Row label="수신자">{maskPhone(resendTarget.phone)}</Row>
              <Row label="템플릿">{resendTarget.template}</Row>
              <Row label="실패 사유">
                <span className="text-foreground">{resendTarget.failReason}</span>
              </Row>
            </dl>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setResendId(null)}
                className="border border-foreground px-3 py-1.5 text-xs hover:bg-muted"
              >
                취소
              </button>
              <button
                onClick={() => resend(resendTarget.id)}
                className="border border-foreground bg-foreground px-3 py-1.5 text-xs font-bold text-background hover:opacity-90"
              >
                재발송 실행
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== TOASTS ===== */}
      <div className="pointer-events-none absolute bottom-14 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="border border-foreground bg-background px-3 py-2 text-xs shadow-sm"
            role="status"
          >
            {t.message}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ===== ⑤ Detail panel ===== */
function DetailPanel({ log, onClose }: { log: NotifLog; onClose: () => void }) {
  return (
    <div
      className="absolute inset-0 z-40 flex items-end justify-center bg-foreground/40 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="발송 상세"
    >
      <div className="relative w-full max-w-md border border-foreground bg-background">
        <Num n={5} />
        <div className="flex items-center justify-between border-b border-foreground bg-secondary px-4 py-2.5">
          <h3 className="text-sm font-bold">발송 상세</h3>
          <button
            onClick={onClose}
            className="border border-foreground px-2 py-0.5 text-xs hover:bg-muted"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col gap-3 p-4">
          <dl className="flex flex-col gap-1.5 text-xs">
            <Row label="수신자">
              <span className="font-mono">{maskPhone(log.phone)}</span>
            </Row>
            <Row label="템플릿명">{log.template}</Row>
            <Row label="이벤트 유형">
              <EventBadge type={log.eventType} />
            </Row>
            <Row label="발송 시각">{formatSentAt(log.sentAt)}</Row>
            <Row label="상태">
              <StatusBadge status={log.status} />
            </Row>
          </dl>

          <div>
            <p className="mb-1 text-[11px] font-bold text-muted-foreground">
              발송 요청 본문 미리보기
            </p>
            <div className="whitespace-pre-wrap border border-dashed border-foreground/50 bg-muted/40 p-3 text-xs leading-relaxed">
              {log.body}
            </div>
          </div>

          {log.status === "fail" && (
            <div>
              <p className="mb-1 text-[11px] font-bold text-muted-foreground">
                실패 사유
              </p>
              <div className="border border-foreground bg-background p-3 text-xs">
                {log.failReason}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ===== small pieces ===== */
function StatTab({
  active,
  border,
  onClick,
  children,
}: {
  active: boolean
  border?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={[
        "px-2.5 py-1.5 text-xs",
        border ? "border-l border-foreground" : "",
        active ? "bg-foreground text-background" : "bg-background hover:bg-muted",
      ].join(" ")}
    >
      {children}
    </button>
  )
}

function EventBadge({ type }: { type: NotifEventType }) {
  return (
    <span className="inline-block border border-foreground px-1.5 py-0.5 text-[10px] font-bold">
      {EVENT_LABEL[type]}
    </span>
  )
}

function StatusBadge({ status }: { status: NotifStatus }) {
  const isSuccess = status === "success"
  return (
    <span
      className={[
        "inline-block border px-1.5 py-0.5 text-[10px] font-bold",
        isSuccess
          ? "border-foreground bg-background text-foreground"
          : "border-foreground bg-foreground text-background",
      ].join(" ")}
    >
      {isSuccess ? "성공" : "실패"}
    </span>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-3 py-2 font-bold">{children}</th>
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-2 align-middle">{children}</td>
}
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <dt className="w-20 shrink-0 text-muted-foreground">{label}</dt>
      <dd className="flex-1 font-medium">{children}</dd>
    </div>
  )
}
