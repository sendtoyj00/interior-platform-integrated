"use client"

import { useMemo, useState } from "react"
import { Marker } from "@/components/blocks/inquiry/marker"

type Category = "자재비" | "인건비" | "부대비용"

type QuoteRow = {
  id: number
  name: string
  category: Category
  unitPrice: string
  quantity: string
}

const CATEGORIES: Category[] = ["자재비", "인건비", "부대비용"]

let rowSeq = 100

function makeRow(partial?: Partial<QuoteRow>): QuoteRow {
  rowSeq += 1
  return {
    id: rowSeq,
    name: "",
    category: "자재비",
    unitPrice: "",
    quantity: "",
    ...partial,
  }
}

const INITIAL_ROWS: QuoteRow[] = [
  makeRow({ name: "강마루 시공 (32평)", category: "자재비", unitPrice: "3200000", quantity: "1" }),
  makeRow({ name: "도배 (실크벽지)", category: "자재비", unitPrice: "1800000", quantity: "1" }),
  makeRow({ name: "목공 인건비", category: "인건비", unitPrice: "350000", quantity: "6" }),
]

function isNumeric(value: string) {
  if (value.trim() === "") return true // 빈 값은 에러로 취급하지 않음(합계 0 처리)
  return /^\d+(\.\d+)?$/.test(value.trim())
}

function toNumber(value: string) {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

function formatKRW(value: number) {
  return value.toLocaleString("ko-KR") + "원"
}

type Toast = { id: number; message: string }

export function QuoteEditor() {
  const [rows, setRows] = useState<QuoteRow[]>(INITIAL_ROWS)
  const [discount, setDiscount] = useState("5")
  const [previewOpen, setPreviewOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])

  function pushToast(message: string) {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }

  function updateRow(id: number, patch: Partial<QuoteRow>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  function addRow() {
    setRows((prev) => [...prev, makeRow()])
  }

  function removeRow(id: number) {
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  const subtotalOf = (r: QuoteRow) => toNumber(r.unitPrice) * toNumber(r.quantity)

  const sumSubtotal = useMemo(() => rows.reduce((acc, r) => acc + subtotalOf(r), 0), [rows])

  const discountValid = isNumeric(discount)
  const discountRate = discountValid ? Math.min(toNumber(discount), 100) : 0
  const discountAmount = Math.round((sumSubtotal * discountRate) / 100)
  const total = sumSubtotal - discountAmount

  const hasInvalidCell = rows.some((r) => !isNumeric(r.unitPrice) || !isNumeric(r.quantity))
  const canSend = rows.length > 0 && !hasInvalidCell && discountValid

  function handleSendConfirmed() {
    setConfirmOpen(false)
    setSent(true)
    pushToast("견적서가 고객에게 발송되었습니다 · 문의 상태 '견적발송'으로 갱신")
  }

  return (
    <div className="flex min-h-full flex-col bg-background text-foreground">
      {/* 헤더 */}
      <header className="flex items-center justify-between border-b border-foreground/20 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-16 items-center justify-center border border-foreground/40 text-[11px] font-semibold">
            LOGO
          </div>
          <span className="text-[11px] text-muted-foreground">인테리어 플랫폼</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="border border-foreground/30 px-2 py-1">역할: 업체 관리자</span>
          <span className="hidden text-muted-foreground sm:inline">김견적 님</span>
          <button className="border border-foreground/40 px-2 py-1 hover:bg-foreground hover:text-background">
            로그아웃
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* 사이드바 */}
        <aside className="hidden w-44 shrink-0 border-r border-foreground/20 p-3 md:block">
          <p className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">업체 메뉴</p>
          <nav className="flex flex-col gap-1 text-[12px]">
            {[
              ["대시보드", "SCR-DASH-003"],
              ["문의 처리 관리", "SCR-INQ-002"],
              ["견적서 작성", "SCR-QUOTE-001", true],
              ["시공 관리", "SCR-PROJ-001"],
              ["직원 관리", "SCR-STAFF-001"],
            ].map(([label, code, active]) => (
              <div
                key={label as string}
                className={`flex flex-col border px-2 py-1.5 ${
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-transparent hover:border-foreground/30"
                }`}
              >
                <span>{label}</span>
                <span className={`text-[9px] ${active ? "text-background/70" : "text-muted-foreground"}`}>
                  {code}
                </span>
              </div>
            ))}
          </nav>
        </aside>

        {/* 바디 */}
        <main className="flex-1 overflow-x-auto p-4">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">SCR-QUOTE-001</p>
              <h1 className="text-lg font-semibold">견적서 작성</h1>
              <p className="text-[11px] text-muted-foreground">
                문의 #INQ-1043 · 고객: 이하늘 · 32평 · 아파트 전체
              </p>
            </div>
          </div>

          {/* ① 견적 항목 테이블 */}
          <section className="relative mb-4 border border-foreground/30">
            <Marker n={1} />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-[12px]">
                <thead>
                  <tr className="border-b border-foreground/30 bg-muted/50 text-left">
                    <th className="px-3 py-2 font-semibold">항목명</th>
                    <th className="px-3 py-2 font-semibold">구분</th>
                    <th className="px-3 py-2 text-right font-semibold">단가</th>
                    <th className="px-3 py-2 text-right font-semibold">수량</th>
                    <th className="px-3 py-2 text-right font-semibold">소계</th>
                    <th className="w-10 px-3 py-2 text-center font-semibold">③</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">
                        항목이 없습니다. 아래 &quot;항목 추가&quot; 버튼으로 행을 추가하세요.
                      </td>
                    </tr>
                  )}
                  {rows.map((r) => {
                    const priceInvalid = !isNumeric(r.unitPrice)
                    const qtyInvalid = !isNumeric(r.quantity)
                    return (
                      <tr key={r.id} className="border-b border-foreground/15">
                        <td className="px-3 py-2">
                          <input
                            value={r.name}
                            onChange={(e) => updateRow(r.id, { name: e.target.value })}
                            placeholder="예: 강마루 시공"
                            className="w-full border border-foreground/30 bg-background px-2 py-1 outline-none focus:border-foreground"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <select
                            value={r.category}
                            onChange={(e) => updateRow(r.id, { category: e.target.value as Category })}
                            className="w-full border border-foreground/30 bg-background px-2 py-1 outline-none focus:border-foreground"
                          >
                            {CATEGORIES.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <input
                            value={r.unitPrice}
                            onChange={(e) => updateRow(r.id, { unitPrice: e.target.value })}
                            inputMode="numeric"
                            placeholder="0"
                            className={`w-full border bg-background px-2 py-1 text-right outline-none focus:border-foreground ${
                              priceInvalid ? "border-2 border-destructive" : "border-foreground/30"
                            }`}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            value={r.quantity}
                            onChange={(e) => updateRow(r.id, { quantity: e.target.value })}
                            inputMode="numeric"
                            placeholder="0"
                            className={`w-20 border bg-background px-2 py-1 text-right outline-none focus:border-foreground ${
                              qtyInvalid ? "border-2 border-destructive" : "border-foreground/30"
                            }`}
                          />
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {priceInvalid || qtyInvalid ? (
                            <span className="text-destructive">숫자 확인</span>
                          ) : (
                            formatKRW(subtotalOf(r))
                          )}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => removeRow(r.id)}
                            aria-label="행 삭제"
                            className="h-6 w-6 border border-foreground/40 text-[11px] hover:bg-destructive hover:text-background"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* ② 항목 추가 */}
            <div className="relative border-t border-foreground/30 p-3">
              <Marker n={2} />
              <button
                onClick={addRow}
                className="w-full border border-dashed border-foreground/50 py-2 text-[12px] hover:border-foreground hover:bg-muted/50"
              >
                + 항목 추가
              </button>
            </div>
          </section>

          {/* ④ 할인율 + ⑤ 합계 */}
          <section className="mb-4 flex flex-col gap-4 md:flex-row md:justify-end">
            <div className="relative w-full border border-foreground/30 p-3 md:w-64">
              <Marker n={4} />
              <label className="mb-1 block text-[11px] text-muted-foreground">할인율 (선택, %)</label>
              <input
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                inputMode="numeric"
                placeholder="0"
                className={`w-full border bg-background px-2 py-1 text-right outline-none focus:border-foreground ${
                  !discountValid ? "border-2 border-destructive" : "border-foreground/30"
                }`}
              />
              {!discountValid && <p className="mt-1 text-[10px] text-destructive">숫자만 입력하세요</p>}
            </div>

            <div className="relative w-full border border-foreground/30 p-3 md:w-72">
              <Marker n={5} />
              <p className="mb-2 text-[11px] uppercase tracking-widest text-muted-foreground">합계 금액</p>
              <dl className="space-y-1 text-[12px]">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">소계 합산</dt>
                  <dd className="tabular-nums">{formatKRW(sumSubtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">할인 ({discountRate}%)</dt>
                  <dd className="tabular-nums">- {formatKRW(discountAmount)}</dd>
                </div>
                <div className="mt-2 flex justify-between border-t border-foreground/30 pt-2 text-sm font-semibold">
                  <dt>최종 합계</dt>
                  <dd className="tabular-nums">{formatKRW(total)}</dd>
                </div>
              </dl>
            </div>
          </section>

          {/* 액션 버튼 */}
          <section className="flex flex-wrap items-center justify-end gap-2 border-t border-foreground/20 pt-4">
            <div className="relative">
              <Marker n={6} />
              <button
                onClick={() => setPreviewOpen(true)}
                className="border border-foreground px-4 py-2 text-[12px] hover:bg-muted"
              >
                미리보기(PDF)
              </button>
            </div>
            <div className="relative">
              <Marker n={7} />
              <button
                onClick={() => setConfirmOpen(true)}
                disabled={!canSend}
                className="border border-foreground bg-foreground px-4 py-2 text-[12px] text-background disabled:cursor-not-allowed disabled:border-foreground/30 disabled:bg-muted disabled:text-muted-foreground"
              >
                견적서 발송
              </button>
            </div>
          </section>
          {rows.length === 0 && (
            <p className="mt-2 text-right text-[10px] text-muted-foreground">
              * 항목이 1개 이상 있어야 발송할 수 있습니다.
            </p>
          )}
          {hasInvalidCell && rows.length > 0 && (
            <p className="mt-2 text-right text-[10px] text-destructive">
              * 단가/수량에 잘못된 값이 있어 발송할 수 없습니다.
            </p>
          )}
        </main>
      </div>

      {/* 푸터 */}
      <footer className="border-t border-foreground/20 px-4 py-2 text-[11px] text-muted-foreground">
        {sent
          ? "상태: 견적서 발송 완료 → SCR-INQ-002 목록 복귀 · 고객 SCR-QUOTE-002 알림(SCR-NOTI-001) 트리거"
          : `상태: 작성 중 · 항목 ${rows.length}건 · 최종 합계 ${formatKRW(total)}`}
      </footer>

      {/* ⑥ PDF 미리보기 모달 */}
      {previewOpen && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-foreground/40 p-4">
          <div className="relative flex max-h-full w-full max-w-md flex-col border border-foreground bg-background">
            <div className="flex items-center justify-between border-b border-foreground/30 px-4 py-2">
              <span className="text-[12px] font-semibold">견적서 미리보기 (PDF)</span>
              <button
                onClick={() => setPreviewOpen(false)}
                aria-label="닫기"
                className="h-6 w-6 border border-foreground/40 text-[11px] hover:bg-muted"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto p-4">
              <div className="mx-auto w-full border border-dashed border-foreground/40 p-4 text-[11px]">
                <p className="mb-2 text-center text-sm font-semibold">견 적 서</p>
                <p className="mb-3 text-center text-muted-foreground">인테리어 플랫폼 · 문의 #INQ-1043</p>
                <table className="mb-3 w-full border-collapse">
                  <thead>
                    <tr className="border-b border-foreground/30 text-left">
                      <th className="py-1">항목</th>
                      <th className="py-1 text-right">소계</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.id} className="border-b border-foreground/15">
                        <td className="py-1">{r.name || "(무제)"}</td>
                        <td className="py-1 text-right tabular-nums">{formatKRW(subtotalOf(r))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-between border-t border-foreground/30 pt-2 font-semibold">
                  <span>최종 합계 (할인 {discountRate}%)</span>
                  <span className="tabular-nums">{formatKRW(total)}</span>
                </div>
              </div>
              <p className="mt-2 text-center text-[10px] text-muted-foreground">
                * 실제 PDF 렌더링 영역 (와이어프레임 목업)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ⑦ 발송 확인 모달 */}
      {confirmOpen && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-foreground/40 p-4">
          <div className="relative w-full max-w-xs border border-foreground bg-background p-4">
            <p className="mb-1 text-[13px] font-semibold">견적서 발송</p>
            <p className="mb-4 text-[12px] text-muted-foreground">고객에게 견적서를 발송하시겠습니까?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmOpen(false)}
                className="border border-foreground/40 px-3 py-1.5 text-[12px] hover:bg-muted"
              >
                취소
              </button>
              <button
                onClick={handleSendConfirmed}
                className="border border-foreground bg-foreground px-3 py-1.5 text-[12px] text-background hover:opacity-80"
              >
                발송하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 토스트 */}
      <div className="pointer-events-none absolute bottom-3 left-1/2 z-30 flex w-[92%] max-w-sm -translate-x-1/2 flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="border border-foreground bg-background px-3 py-2 text-[11px] shadow-[3px_3px_0_0_var(--color-foreground)]"
          >
            {t.message}
          </div>
        ))}
      </div>
    </div>
  )
}
