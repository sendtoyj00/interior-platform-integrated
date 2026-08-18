"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { WfNumber } from "./wf-badge"
import { Toast } from "./wf-modals"
import {
  quoteLineItems,
  quoteTotal,
  formatKRW,
  contractMeta,
  initialContractHistory,
  CONTRACT_STATUS_LABEL,
  type ContractStatus,
  type ContractHistoryItem,
} from "@/lib/blocks/dealflow/mock-data"
import { COMPANY_MENU } from "@/lib/menu-labels"

const ADMIN_MENU = COMPANY_MENU

const STATUS_ORDER: ContractStatus[] = ["waiting", "signed", "completed"]

function ContractStatusBadge({ status }: { status: ContractStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        status === "waiting" && "border-neutral-400 bg-neutral-100 text-neutral-700",
        status === "signed" && "border-neutral-800 bg-neutral-800 text-white",
        status === "completed" && "border-neutral-600 bg-neutral-500 text-white",
      )}
    >
      {CONTRACT_STATUS_LABEL[status]}
    </span>
  )
}

/* ④ 전자서명 목업 모달 */
function SignModal({
  checked,
  onToggle,
  onCancel,
  onConfirm,
}: {
  checked: boolean
  onToggle: (v: boolean) => void
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-neutral-900/40 p-4">
      <WfNumber n={4} className="w-full max-w-md">
        <div className="w-full rounded-md border-2 border-neutral-700 bg-white shadow-lg">
          <div className="border-b border-dashed border-neutral-400 px-4 py-3">
            <h3 className="text-sm font-bold text-neutral-800">전자서명 (목업)</h3>
          </div>
          <div className="px-4 py-4">
            <p className="mb-3 text-xs leading-relaxed text-neutral-500">
              외부 전자서명 서비스 연동은 학습 범위 밖입니다. 아래 체크박스로 서명 완료를 대체합니다.
            </p>
            <label className="flex cursor-pointer items-start gap-2 rounded border border-neutral-400 bg-neutral-50 px-3 py-3">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onToggle(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-neutral-800"
              />
              <span className="text-sm text-neutral-800">서명을 완료했습니다.</span>
            </label>
          </div>
          <div className="flex justify-end gap-2 border-t border-dashed border-neutral-400 px-4 py-3">
            <button
              onClick={onCancel}
              className="rounded border border-neutral-400 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100"
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              disabled={!checked}
              className="rounded border border-neutral-800 bg-neutral-800 px-3 py-1.5 text-sm text-white enabled:hover:bg-neutral-900 disabled:cursor-not-allowed disabled:border-neutral-300 disabled:bg-neutral-200 disabled:text-neutral-400"
            >
              확인
            </button>
          </div>
        </div>
      </WfNumber>
    </div>
  )
}

export function ContractScreen({ variant }: { variant: "desktop" | "mobile" }) {
  const isMobile = variant === "mobile"

  const [status, setStatus] = useState<ContractStatus>("waiting")
  const [history, setHistory] = useState<ContractHistoryItem[]>(initialContractHistory)
  const [signed, setSigned] = useState(false)
  const [showSign, setShowSign] = useState(false)
  const [signChecked, setSignChecked] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [warn, setWarn] = useState<string | null>(null)
  const [footer, setFooter] = useState("계약 상태: 계약대기 · 전자서명 대기 중")

  function fireToast(msg: string, footerMsg?: string) {
    setToast(msg)
    if (footerMsg) setFooter(footerMsg)
    setTimeout(() => setToast(null), 2800)
  }

  function addHistory(from: ContractStatus, to: ContractStatus) {
    setHistory((prev) => [
      ...prev,
      {
        id: `CH${prev.length + 1}`,
        changedBy: "김실장 (업체)",
        changedAt: "2026-08-14 17:0" + prev.length,
        from,
        to,
      },
    ])
  }

  /* ② 상태 변경 드롭다운 */
  function handleStatusChange(next: ContractStatus) {
    setWarn(null)
    if (next === status) return

    // 예외: 완료로 전환하려면 체결을 먼저 거쳐야 함
    if (next === "completed" && status === "waiting") {
      setWarn("체결 상태를 먼저 진행해주세요.")
      return
    }

    const prev = status
    setStatus(next)
    addHistory(prev, next)

    if (next === "signed") {
      fireToast("계약이 체결되었습니다. 이력에 기록되었습니다.", "계약 상태: 체결 · 결제 마일스톤 등록 가능")
    } else if (next === "completed") {
      fireToast("계약이 완료 처리되었습니다.", "계약 상태: 완료")
    } else {
      fireToast("계약 상태가 변경되었습니다.", `계약 상태: ${CONTRACT_STATUS_LABEL[next]}`)
    }
  }

  /* ④ 전자서명 확인 */
  function handleSignConfirm() {
    setSigned(true)
    setShowSign(false)
    setSignChecked(false)
    fireToast("전자서명이 완료 처리되었습니다.", "전자서명: 완료")
  }

  const showPayBanner = status === "signed" || status === "completed"

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
          <span className="rounded border border-neutral-700 bg-neutral-700 px-2 py-0.5 text-[11px] text-white">
            업체 관리자
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
            isMobile ? "flex gap-1 overflow-x-auto border-b px-2 py-2" : "w-44 border-r px-2 py-3",
          )}
          aria-label="역할별 메뉴"
        >
          {!isMobile && (
            <p className="mb-2 px-2 text-[10px] uppercase tracking-wider text-neutral-400">관리자 메뉴</p>
          )}
          <ul className={cn(isMobile ? "flex gap-1" : "flex flex-col gap-1")}>
            {ADMIN_MENU.map((m, i) => (
              <li key={m}>
                <button
                  className={cn(
                    "whitespace-nowrap rounded px-3 py-1.5 text-left text-xs",
                    i === 2 ? "bg-neutral-800 text-white" : "text-neutral-600 hover:bg-neutral-100",
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
              <h1 className="text-base font-bold">계약서 생성 / 관리</h1>
              <p className="text-xs text-neutral-500">
                {contractMeta.contractNo} · {contractMeta.projectName}
              </p>
            </div>
            <ContractStatusBadge status={status} />
          </div>

          {/* 결제 마일스톤 이동 배너 */}
          {showPayBanner && (
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-md border-2 border-neutral-700 bg-neutral-100 px-4 py-3">
              <p className="text-xs text-neutral-700">
                <span className="font-bold text-neutral-900">체결 완료</span> — 결제 마일스톤을 등록할 수 있습니다.
              </p>
              <button className="rounded border border-neutral-800 bg-neutral-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-900">
                SCR-PAY-001 결제 마일스톤 등록 →
              </button>
            </div>
          )}

          <div className={cn("grid gap-4", !isMobile && "grid-cols-3")}>
            {/* ① 계약서 초안 미리보기 */}
            <div className={cn(!isMobile && "col-span-2")}>
              <WfNumber n={1}>
                <section className="rounded-md border border-neutral-400 bg-white">
                  <div className="flex items-center justify-between border-b border-dashed border-neutral-300 px-4 py-2">
                    <h2 className="text-sm font-bold">계약서 초안 미리보기 (읽기 전용)</h2>
                    <span className="text-[10px] text-neutral-400">승인 견적 자동 인용</span>
                  </div>
                  <div className="space-y-3 px-4 py-3 text-xs leading-relaxed text-neutral-700">
                    <p className="font-bold text-neutral-900">인테리어 공사 계약서</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-neutral-600">
                      <span>계약번호: {contractMeta.contractNo}</span>
                      <span>견적번호: {contractMeta.quoteNo}</span>
                      <span>발주자(고객): {contractMeta.customerName}</span>
                      <span>수급자(업체): {contractMeta.vendorName}</span>
                    </div>
                    <hr className="border-dashed border-neutral-300" />
                    <p className="text-neutral-600">
                      제1조(공사내용) 아래 승인된 견적 항목에 따라 공사를 시행한다.
                    </p>
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="border-b border-neutral-400 text-neutral-600">
                          <th className="py-1 pr-2 font-medium">항목</th>
                          <th className="py-1 pr-2 font-medium">수량</th>
                          <th className="py-1 text-right font-medium">금액</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quoteLineItems.map((li) => (
                          <tr key={li.id} className="border-b border-dashed border-neutral-300">
                            <td className="py-1 pr-2">{li.name}</td>
                            <td className="py-1 pr-2">{li.qty}</td>
                            <td className="py-1 text-right">{formatKRW(li.qty * li.unitPrice)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="font-bold text-neutral-900">
                          <td className="py-1.5" colSpan={2}>
                            계약금액 (VAT 별도)
                          </td>
                          <td className="py-1.5 text-right">{formatKRW(quoteTotal)}</td>
                        </tr>
                      </tfoot>
                    </table>
                    <p className="text-neutral-600">
                      제2조(대금지급) 결제 마일스톤은 별도 등록된 일정에 따른다.
                    </p>
                    <p className="text-[11px] text-neutral-400">※ 본 문서는 초안이며 전자서명 후 효력이 발생합니다.</p>
                  </div>
                </section>
              </WfNumber>
            </div>

            {/* 우측 컨트롤 열 */}
            <div className="space-y-4">
              {/* ② 상태 변경 드롭다운 */}
              <WfNumber n={2}>
                <section className="rounded-md border border-neutral-400 bg-white px-4 py-3">
                  <h2 className="mb-2 text-sm font-bold">계약 상태</h2>
                  <label className="mb-1 block text-[11px] text-neutral-500">상태 변경</label>
                  <select
                    value={status}
                    onChange={(e) => handleStatusChange(e.target.value as ContractStatus)}
                    className="w-full rounded border border-neutral-400 bg-neutral-50 px-2 py-1.5 text-sm text-neutral-800 focus:border-neutral-700 focus:outline-none"
                  >
                    {STATUS_ORDER.map((s) => (
                      <option key={s} value={s}>
                        {CONTRACT_STATUS_LABEL[s]}
                      </option>
                    ))}
                  </select>
                  {warn && (
                    <p className="mt-2 rounded border border-neutral-500 bg-neutral-100 px-2 py-1.5 text-[11px] text-neutral-700">
                      ⚠ {warn}
                    </p>
                  )}
                </section>
              </WfNumber>

              {/* ③ 전자서명 요청 / 서명완료 뱃지 */}
              <WfNumber n={3}>
                <section className="rounded-md border border-neutral-400 bg-white px-4 py-3">
                  <h2 className="mb-2 text-sm font-bold">전자서명</h2>
                  {signed ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-neutral-800 bg-neutral-800 px-3 py-1 text-xs font-medium text-white">
                      ✓ 서명완료
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setSignChecked(false)
                        setShowSign(true)
                      }}
                      className="w-full rounded border border-neutral-800 bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-900"
                    >
                      전자서명 요청
                    </button>
                  )}
                </section>
              </WfNumber>
            </div>
          </div>

          {/* ⑤ 상태 변경 이력 */}
          <div className="mt-4">
            <WfNumber n={5}>
              <section className="rounded-md border border-neutral-400 bg-white">
                <div className="border-b border-dashed border-neutral-300 px-4 py-2">
                  <h2 className="text-sm font-bold">계약 상태 변경 이력</h2>
                </div>
                <ul className="divide-y divide-neutral-200">
                  {history
                    .slice()
                    .reverse()
                    .map((h) => (
                      <li key={h.id} className="flex items-center justify-between gap-2 px-4 py-2.5 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="rounded border border-neutral-300 bg-neutral-100 px-1.5 py-0.5 text-[10px] text-neutral-600">
                            {h.from ? CONTRACT_STATUS_LABEL[h.from] : "―"}
                          </span>
                          <span className="text-neutral-400">→</span>
                          <span className="rounded border border-neutral-700 bg-neutral-700 px-1.5 py-0.5 text-[10px] text-white">
                            {CONTRACT_STATUS_LABEL[h.to]}
                          </span>
                        </div>
                        <div className="text-right text-[11px] text-neutral-500">
                          <div>{h.changedBy}</div>
                          <div>{h.changedAt}</div>
                        </div>
                      </li>
                    ))}
                </ul>
              </section>
            </WfNumber>
          </div>
        </main>
      </div>

      {/* ===== 푸터 ===== */}
      <footer className="flex items-center justify-between border-t-2 border-neutral-700 bg-white px-4 py-2 text-[11px] text-neutral-500">
        <span>{footer}</span>
        {!isMobile && <span>© 2026 인테리어 견적 시스템 · 와이어프레임</span>}
      </footer>

      {/* ===== 모달/토스트 ===== */}
      {showSign && (
        <SignModal
          checked={signChecked}
          onToggle={setSignChecked}
          onCancel={() => setShowSign(false)}
          onConfirm={handleSignConfirm}
        />
      )}
      {toast && <Toast message={toast} />}
    </div>
  )
}
