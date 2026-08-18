"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { WfNumber } from "./wf-badge"
import { ConfirmModal, RejectModal, HistoryDetailModal, Toast } from "./wf-modals"
import {
  quoteLineItems,
  quoteTotal,
  quoteHistory,
  formatKRW,
  type QuoteStatus,
  type Role,
  type QuoteHistoryItem,
} from "@/lib/blocks/dealflow/mock-data"
import { COMPANY_MENU, CUSTOMER_MENU } from "@/lib/menu-labels"

const STATUS_LABEL: Record<QuoteStatus, string> = {
  pending: "승인 대기",
  approved: "승인완료",
  rejected: "거절",
}

const QUOTE_CUSTOMER_MENU = CUSTOMER_MENU
const ADMIN_MENU = COMPANY_MENU

function StatusBadge({ status }: { status: QuoteStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        status === "pending" && "border-neutral-400 bg-neutral-100 text-neutral-700",
        status === "approved" && "border-neutral-800 bg-neutral-800 text-white",
        status === "rejected" && "border-neutral-500 bg-neutral-300 text-neutral-800",
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}

export function QuoteApprovalScreen({
  variant,
  role,
}: {
  variant: "desktop" | "mobile"
  role: Role
}) {
  const isMobile = variant === "mobile"
  const isAdmin = role === "admin"

  // 고객은 견적서/수정이력 탭, 관리자는 수정이력 탭만
  const [tab, setTab] = useState<"quote" | "history">(isAdmin ? "history" : "quote")
  const [status, setStatus] = useState<QuoteStatus>("pending")
  const [showConfirm, setShowConfirm] = useState(false)
  const [showReject, setShowReject] = useState(false)
  const [reason, setReason] = useState("")
  const [detail, setDetail] = useState<QuoteHistoryItem | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [footer, setFooter] = useState("최근 동기화: 방금 전 · 정상")

  // 역할이 바뀌면 관리자는 항상 수정이력 탭
  const effectiveTab = isAdmin ? "history" : tab

  function fireToast(msg: string, footerMsg?: string) {
    setToast(msg)
    if (footerMsg) setFooter(footerMsg)
    setTimeout(() => setToast(null), 2600)
  }

  function handleApprove() {
    setShowConfirm(false)
    setStatus("approved")
    fireToast("SCR-CONT-001 계약서 자동 생성이 트리거되었습니다.", "상태: 승인완료 · 계약서 생성 트리거됨")
  }

  function handleReject() {
    setShowReject(false)
    setStatus("rejected")
    setReason("")
    fireToast("거절 처리되었습니다. 업체측에 알림이 전송되었습니다.", "상태: 거절 · 업체 알림 전송됨")
  }

  const menu = isAdmin ? ADMIN_MENU : QUOTE_CUSTOMER_MENU
  const isClosed = status !== "pending"

  return (
    <div className="relative flex h-full flex-col bg-neutral-50 font-sans text-neutral-800">
      {/* ===== 헤더 ===== */}
      <header className="flex items-center justify-between border-b-2 border-neutral-700 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded border border-neutral-500 bg-neutral-200 text-[10px] text-neutral-600">
            LOGO
          </div>
          {!isMobile && <span className="text-sm font-bold tracking-tight">인테리어 견적 시스템</span>}
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded border px-2 py-0.5 text-[11px]",
              isAdmin ? "border-neutral-700 bg-neutral-700 text-white" : "border-neutral-400 bg-neutral-100 text-neutral-700",
            )}
          >
            {isAdmin ? "업체 관리자" : "고객"}
          </span>
          <button className="rounded border border-neutral-400 bg-white px-2 py-0.5 text-[11px] text-neutral-700 hover:bg-neutral-100">
            로그아웃
          </button>
        </div>
      </header>

      {/* ===== 본문 (사이드바 + 바디) ===== */}
      <div className={cn("flex min-h-0 flex-1", isMobile && "flex-col")}>
        {/* 사이드바 */}
        <nav
          className={cn(
            "shrink-0 border-neutral-400 bg-white",
            isMobile
              ? "flex gap-1 overflow-x-auto border-b px-2 py-2"
              : "w-44 border-r px-2 py-3",
          )}
          aria-label="역할별 메뉴"
        >
          {!isMobile && (
            <p className="mb-2 px-2 text-[10px] uppercase tracking-wider text-neutral-400">
              {isAdmin ? "관리자 메뉴" : "고객 메뉴"}
            </p>
          )}
          <ul className={cn(isMobile ? "flex gap-1" : "flex flex-col gap-1")}>
            {menu.map((m, i) => (
              <li key={m}>
                <button
                  className={cn(
                    "whitespace-nowrap rounded px-3 py-1.5 text-left text-xs",
                    i === (isAdmin ? 3 : 1)
                      ? "bg-neutral-800 text-white"
                      : "text-neutral-600 hover:bg-neutral-100",
                  )}
                >
                  {m}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* 바디 */}
        <main className="min-w-0 flex-1 overflow-auto p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="text-base font-bold">견적 확인 / 승인</h1>
              <p className="text-xs text-neutral-500">견적번호 EST-20260814-012 · 우리집 인테리어</p>
            </div>
            <StatusBadge status={status} />
          </div>

          {/* 탭 */}
          <div className="mb-4 flex gap-1 border-b border-neutral-300">
            {!isAdmin && (
              <button
                onClick={() => setTab("quote")}
                className={cn(
                  "-mb-px border-b-2 px-3 py-2 text-xs",
                  effectiveTab === "quote"
                    ? "border-neutral-800 font-bold text-neutral-900"
                    : "border-transparent text-neutral-500 hover:text-neutral-700",
                )}
              >
                견적서
              </button>
            )}
            <WfNumber n={5}>
              <button
                onClick={() => setTab("history")}
                className={cn(
                  "-mb-px border-b-2 px-3 py-2 text-xs",
                  effectiveTab === "history"
                    ? "border-neutral-800 font-bold text-neutral-900"
                    : "border-transparent text-neutral-500 hover:text-neutral-700",
                )}
              >
                수정이력
              </button>
            </WfNumber>
          </div>

          {/* 탭 콘텐츠 */}
          {effectiveTab === "quote" ? (
            <div className="space-y-4">
              {/* ① 견적서 요약 카드 */}
              <WfNumber n={1}>
                <section className="rounded-md border border-neutral-400 bg-white">
                  <div className="border-b border-dashed border-neutral-300 px-4 py-2">
                    <h2 className="text-sm font-bold">견적서 요약 (읽기 전용)</h2>
                  </div>
                  <div className="overflow-x-auto px-4 py-3">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="border-b border-neutral-400 text-neutral-600">
                          <th className="py-1.5 pr-2 font-medium">항목</th>
                          {!isMobile && <th className="py-1.5 pr-2 font-medium">사양</th>}
                          <th className="py-1.5 pr-2 font-medium">수량</th>
                          <th className="py-1.5 pr-2 font-medium">단가</th>
                          <th className="py-1.5 text-right font-medium">금액</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quoteLineItems.map((li) => (
                          <tr key={li.id} className="border-b border-dashed border-neutral-300">
                            <td className="py-1.5 pr-2">{li.name}</td>
                            {!isMobile && <td className="py-1.5 pr-2 text-neutral-500">{li.spec}</td>}
                            <td className="py-1.5 pr-2">{li.qty}</td>
                            <td className="py-1.5 pr-2">{formatKRW(li.unitPrice)}</td>
                            <td className="py-1.5 text-right">{formatKRW(li.qty * li.unitPrice)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="font-bold text-neutral-900">
                          <td className="py-2" colSpan={isMobile ? 2 : 4}>
                            합계 (VAT 별도)
                          </td>
                          <td className="py-2 text-right text-sm">{formatKRW(quoteTotal)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </section>
              </WfNumber>

              {/* 액션 영역 */}
              {isClosed ? (
                <div className="rounded-md border border-dashed border-neutral-400 bg-neutral-100 px-4 py-4 text-center text-xs text-neutral-600">
                  이미 처리된 견적입니다. 상태:&nbsp;
                  <StatusBadge status={status} />
                </div>
              ) : (
                <div className={cn("flex gap-3", isMobile && "flex-col")}>
                  {/* ② 승인 */}
                  <WfNumber n={2} className={cn(isMobile && "w-full")}>
                    <button
                      onClick={() => setShowConfirm(true)}
                      className="w-full rounded border border-neutral-800 bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-900"
                    >
                      승인
                    </button>
                  </WfNumber>
                  {/* ③ 거절 */}
                  <WfNumber n={3} className={cn(isMobile && "w-full")}>
                    <button
                      onClick={() => setShowReject(true)}
                      className="w-full rounded border border-neutral-500 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                    >
                      거절
                    </button>
                  </WfNumber>
                </div>
              )}
            </div>
          ) : (
            /* ⑤ 수정이력 목록 */
            <section className="space-y-2">
              {isAdmin && (
                <p className="rounded border border-dashed border-neutral-400 bg-neutral-100 px-3 py-2 text-xs text-neutral-600">
                  업체 관리자 · 읽기 전용 모드 — 승인/거절 기능이 비활성화되어 있습니다.
                </p>
              )}
              <ul className="divide-y divide-neutral-200 rounded-md border border-neutral-400 bg-white">
                {quoteHistory
                  .slice()
                  .reverse()
                  .map((h) => (
                    <li key={h.version}>
                      <button
                        onClick={() => setDetail(h)}
                        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left hover:bg-neutral-100"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="rounded border border-neutral-400 bg-neutral-100 px-1.5 py-0.5 text-[10px] font-bold">
                              {h.version}
                            </span>
                            <span className="truncate text-xs text-neutral-800">{h.summary}</span>
                          </div>
                          <p className="mt-0.5 text-[11px] text-neutral-500">
                            {h.updatedAt} · {h.updatedBy}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs text-neutral-500">{formatKRW(h.total)} ›</span>
                      </button>
                    </li>
                  ))}
              </ul>
            </section>
          )}
        </main>
      </div>

      {/* ===== 푸터 (상태 메시지 영역) ===== */}
      <footer className="flex items-center justify-between border-t-2 border-neutral-700 bg-white px-4 py-2 text-[11px] text-neutral-500">
        <span>{footer}</span>
        {!isMobile && <span>© 2026 인테리어 견적 시스템 · 와이어프레임</span>}
      </footer>

      {/* ===== 모달/토스트 ===== */}
      {showConfirm && <ConfirmModal onCancel={() => setShowConfirm(false)} onConfirm={handleApprove} />}
      {showReject && (
        <RejectModal
          reason={reason}
          onChange={setReason}
          onCancel={() => {
            setShowReject(false)
            setReason("")
          }}
          onConfirm={handleReject}
        />
      )}
      {detail && <HistoryDetailModal item={detail} onClose={() => setDetail(null)} />}
      {toast && <Toast message={toast} />}
    </div>
  )
}
