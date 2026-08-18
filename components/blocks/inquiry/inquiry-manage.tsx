"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Marker } from "./marker"

type Status = "신규" | "상담중" | "견적발송" | "종료"

const STATUS_FLOW: Status[] = ["신규", "상담중", "견적발송", "종료"]

const STAFF = ["김도현", "박서연", "이준호", "최민지"]

type Inquiry = {
  id: string
  customer: string
  space: string
  area: string
  budget: string
  schedule: string
  createdAt: string
  status: Status
  assignee: string | null
  detail: string
  attachments: string[]
}

const INITIAL: Inquiry[] = [
  {
    id: "INQ-2401",
    customer: "정하늘",
    space: "아파트",
    area: "32평",
    budget: "3,000~4,000만원",
    schedule: "2026-03-02 ~ 2026-03-20",
    createdAt: "2026-02-18",
    status: "신규",
    assignee: null,
    detail: "거실 확장과 주방 전체 리모델링을 희망합니다. 화이트톤 선호.",
    attachments: ["평면도.pdf", "참고사진_거실.jpg"],
  },
  {
    id: "INQ-2402",
    customer: "김우진",
    space: "오피스텔",
    area: "18평",
    budget: "1,500~2,000만원",
    schedule: "2026-03-10 ~ 2026-03-25",
    createdAt: "2026-02-17",
    status: "상담중",
    assignee: "박서연",
    detail: "원룸 오피스텔 도배/바닥 교체 및 붙박이장 설치 문의.",
    attachments: ["현관사진.jpg"],
  },
  {
    id: "INQ-2403",
    customer: "이서준",
    space: "단독주택",
    area: "45평",
    budget: "6,000~8,000만원",
    schedule: "2026-04-01 ~ 2026-05-15",
    createdAt: "2026-02-15",
    status: "견적발송",
    assignee: "김도현",
    detail: "2층 단독주택 전체 리모델링. 외벽 포함 견적 요청.",
    attachments: ["도면_1층.pdf", "도면_2층.pdf", "참고_외벽.png"],
  },
  {
    id: "INQ-2404",
    customer: "박지민",
    space: "상가/사무실",
    area: "24평",
    budget: "2,500~3,000만원",
    schedule: "2026-02-25 ~ 2026-03-08",
    createdAt: "2026-02-12",
    status: "종료",
    assignee: "이준호",
    detail: "카페 인테리어 시공 완료. 잔금 처리 후 종료 처리됨.",
    attachments: ["매장도면.pdf"],
  },
  {
    id: "INQ-2405",
    customer: "한예슬",
    space: "빌라/연립",
    area: "27평",
    budget: "2,000~2,800만원",
    schedule: "2026-03-15 ~ 2026-04-02",
    createdAt: "2026-02-19",
    status: "신규",
    assignee: null,
    detail: "빌라 화장실 2개 및 베란다 확장 시공 문의.",
    attachments: ["참고사진_화장실.jpg", "베란다.png"],
  },
]

const TABS: Array<Status | "전체"> = ["전체", "신규", "상담중", "견적발송", "종료"]

function StatusBadge({ status }: { status: Status }) {
  const cls =
    status === "종료"
      ? "border-foreground/30 text-muted-foreground"
      : status === "견적발송"
        ? "border-foreground bg-foreground text-background"
        : status === "상담중"
          ? "border-foreground text-foreground"
          : "border-dashed border-foreground/60 text-foreground"
  return (
    <span className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-semibold ${cls}`}>
      {status}
    </span>
  )
}

type Toast = { id: number; message: string; kind: "info" | "warn" }

export function InquiryManage({ mode }: { mode: "desktop" | "mobile" }) {
  const isMobile = mode === "mobile"
  const [rows, setRows] = useState<Inquiry[]>(INITIAL)
  const [tab, setTab] = useState<(typeof TABS)[number]>("전체")
  const [selectedId, setSelectedId] = useState<string | null>(isMobile ? null : "INQ-2401")
  const [toasts, setToasts] = useState<Toast[]>([])
  const [quoteModal, setQuoteModal] = useState<{ open: boolean; targetId: string | null }>({
    open: false,
    targetId: null,
  })
  const router = useRouter()

  const filtered = useMemo(
    () => (tab === "전체" ? rows : rows.filter((r) => r.status === tab)),
    [rows, tab],
  )

  const selected = rows.find((r) => r.id === selectedId) ?? null

  function pushToast(message: string, kind: Toast["kind"] = "info") {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message, kind }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000)
  }

  function changeStatus(row: Inquiry, next: Status) {
    // 예외: 담당자 미배정 상태에서 상담중으로 변경 시도
    if (next === "상담중" && !row.assignee) {
      pushToast("담당자를 먼저 배정해주세요", "warn")
      return
    }
    // 견적발송 선택 시 확인 모달
    if (next === "견적발송") {
      setQuoteModal({ open: true, targetId: row.id })
      return
    }
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status: next } : r)))
    pushToast(`${row.customer}님 문의 상태가 '${next}'(으)로 변경되었습니다`)
  }

  function assign(row: Inquiry, staff: string) {
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, assignee: staff } : r)))
    pushToast(`담당자가 '${staff}'(으)로 배정되었습니다`)
  }

  function confirmQuote(write: boolean) {
    const id = quoteModal.targetId
    if (id) {
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: "견적발송" } : r)))
      if (write) {
        // 이동(제안): SCR-QUOTE-001 견적서 작성
        pushToast("SCR-QUOTE-001 견적서 작성 화면으로 이동합니다")
        setTimeout(() => router.push("/screens/scr-quote-001"), 500)
      } else {
        pushToast("상태가 '견적발송'으로 변경되었습니다")
      }
    }
    setQuoteModal({ open: false, targetId: null })
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden border border-foreground/60 bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-foreground/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-sm border border-foreground text-[10px] font-bold">
            LOGO
          </div>
          {!isMobile && <span className="text-sm font-bold">인테리어 플랫폼</span>}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full border border-foreground/50 px-2 py-1 text-muted-foreground">
            역할: 업체 관리자
          </span>
          <button className="rounded-sm border border-foreground/50 px-2 py-1 text-foreground">
            로그아웃
          </button>
        </div>
      </header>

      {/* Sidebar + Body */}
      <div className={`flex min-h-0 flex-1 ${isMobile ? "flex-col" : "flex-row"}`}>
        {isMobile ? (
          <nav className="flex gap-1 overflow-x-auto border-b border-foreground/40 px-3 py-2">
            {MENU.map((m) => (
              <button
                key={m.code}
                className={`shrink-0 rounded-sm border px-2 py-1 text-[11px] ${
                  m.active
                    ? "border-foreground bg-foreground text-background"
                    : "border-foreground/30 text-muted-foreground"
                }`}
              >
                {m.label}
              </button>
            ))}
          </nav>
        ) : (
          <aside className="w-52 shrink-0 border-r border-foreground/40 p-3">
            <p className="mb-2 px-1 text-[10px] uppercase tracking-wide text-muted-foreground">
              업체 관리자 메뉴
            </p>
            <ul className="flex flex-col gap-1">
              {MENU.map((m) => (
                <li key={m.code}>
                  <button
                    className={`flex w-full flex-col items-start rounded-sm border px-3 py-2 text-left ${
                      m.active
                        ? "border-foreground bg-foreground text-background"
                        : "border-transparent text-foreground hover:border-foreground/30"
                    }`}
                  >
                    <span className="text-sm">{m.label}</span>
                    <span
                      className={`text-[10px] ${m.active ? "text-background/70" : "text-muted-foreground"}`}
                    >
                      {m.code}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {/* Body */}
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="border-b border-foreground/30 px-4 pb-3 pt-4">
            <p className="text-[11px] text-muted-foreground">SCR-INQ-002</p>
            <h1 className="text-lg font-bold text-foreground">문의 처리 관리</h1>
          </div>

          {/* ① 상태 필터 탭 */}
          <div className="relative border-b border-foreground/30 px-4 py-3">
            <Marker n={1} />
            <div className="flex flex-wrap gap-1">
              {TABS.map((t) => {
                const count = t === "전체" ? rows.length : rows.filter((r) => r.status === t).length
                return (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`rounded-sm border px-3 py-1.5 text-xs ${
                      tab === t
                        ? "border-foreground bg-foreground text-background"
                        : "border-foreground/30 text-foreground hover:border-foreground/60"
                    }`}
                  >
                    {t} ({count})
                  </button>
                )
              })}
            </div>
          </div>

          {/* 테이블 + 상세 패널 */}
          <div className={`flex min-h-0 flex-1 ${isMobile ? "flex-col" : "flex-row"}`}>
            {/* ② 문의 목록 테이블 */}
            <div
              className={`relative min-h-0 overflow-auto ${
                isMobile ? "" : selected ? "w-[58%] border-r border-foreground/30" : "flex-1"
              } ${isMobile && selected ? "hidden" : ""}`}
            >
              <div className="relative p-4">
                <Marker n={2} />
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-foreground/40 text-muted-foreground">
                      <th className="whitespace-nowrap px-2 py-2 font-semibold">고객명</th>
                      {!isMobile && <th className="px-2 py-2 font-semibold">공간정보</th>}
                      {!isMobile && <th className="px-2 py-2 font-semibold">희망예산</th>}
                      {!isMobile && <th className="px-2 py-2 font-semibold">희망일정</th>}
                      <th className="whitespace-nowrap px-2 py-2 font-semibold">접수일</th>
                      <th className="px-2 py-2 font-semibold">상태</th>
                      <th className="px-2 py-2 font-semibold">담당자</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr
                        key={r.id}
                        onClick={() => setSelectedId(r.id)}
                        className={`cursor-pointer border-b border-foreground/15 hover:bg-muted ${
                          selectedId === r.id ? "bg-muted" : ""
                        }`}
                      >
                        <td className="whitespace-nowrap px-2 py-2.5 font-medium text-foreground">
                          {r.customer}
                        </td>
                        {!isMobile && (
                          <td className="px-2 py-2.5 text-foreground">
                            {r.space} · {r.area}
                          </td>
                        )}
                        {!isMobile && <td className="whitespace-nowrap px-2 py-2.5">{r.budget}</td>}
                        {!isMobile && <td className="whitespace-nowrap px-2 py-2.5">{r.schedule}</td>}
                        <td className="whitespace-nowrap px-2 py-2.5">{r.createdAt}</td>
                        <td className="px-2 py-2.5">
                          <StatusBadge status={r.status} />
                        </td>
                        <td className="whitespace-nowrap px-2 py-2.5">
                          {r.assignee ?? <span className="text-muted-foreground">미배정</span>}
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-2 py-10 text-center text-muted-foreground">
                          해당 상태의 문의가 없습니다
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ③ 상세 패널 */}
            {selected && (
              <div
                className={`relative min-h-0 overflow-auto ${isMobile ? "flex-1" : "w-[42%]"} bg-muted/30`}
              >
                <div className="relative p-4">
                  <Marker n={3} />
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[11px] text-muted-foreground">{selected.id}</p>
                      <h2 className="text-base font-bold text-foreground">{selected.customer} 고객</h2>
                    </div>
                    <button
                      onClick={() => setSelectedId(null)}
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-foreground/40 text-sm text-foreground"
                      aria-label="상세 패널 닫기"
                    >
                      ×
                    </button>
                  </div>

                  {/* 고객 입력 정보 전체 */}
                  <dl className="mb-4 grid grid-cols-1 gap-2 rounded-sm border border-dashed border-foreground/40 bg-background p-3 text-xs">
                    <Row label="공간정보" value={`${selected.space} · ${selected.area}`} />
                    <Row label="희망예산" value={selected.budget} />
                    <Row label="희망일정" value={selected.schedule} />
                    <Row label="접수일" value={selected.createdAt} />
                    <div>
                      <dt className="mb-1 text-muted-foreground">상세 요청사항</dt>
                      <dd className="text-foreground text-pretty">{selected.detail}</dd>
                    </div>
                  </dl>

                  {/* 첨부파일 미리보기 */}
                  <div className="mb-4">
                    <p className="mb-1 text-xs font-semibold text-foreground">첨부파일</p>
                    <div className="flex flex-wrap gap-2">
                      {selected.attachments.map((a) => (
                        <div
                          key={a}
                          className="flex w-20 flex-col items-center gap-1 rounded-sm border border-foreground/30 bg-background p-2"
                        >
                          <div className="flex h-14 w-full items-center justify-center rounded-sm border border-foreground/20 text-[10px] text-muted-foreground">
                            {a.endsWith(".pdf") ? "PDF" : "IMG"}
                          </div>
                          <span className="w-full truncate text-center text-[10px] text-foreground">
                            {a}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ④ 상태 변경 드롭다운 */}
                  <div className="relative mb-4 rounded-sm border border-dashed border-foreground/40 bg-background p-3">
                    <Marker n={4} />
                    <label className="mb-1 block text-xs font-semibold text-foreground">
                      상태 변경
                    </label>
                    <select
                      value={selected.status}
                      onChange={(e) => changeStatus(selected, e.target.value as Status)}
                      className="w-full rounded-sm border border-foreground/40 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
                    >
                      {STATUS_FLOW.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      신규 → 상담중 → 견적발송 → 종료
                    </p>
                  </div>

                  {/* ⑤ 담당자 배정 드롭다운 */}
                  <div className="relative rounded-sm border border-dashed border-foreground/40 bg-background p-3">
                    <Marker n={5} />
                    <label className="mb-1 block text-xs font-semibold text-foreground">
                      담당자 배정
                    </label>
                    <select
                      value={selected.assignee ?? ""}
                      onChange={(e) => assign(selected, e.target.value)}
                      className="w-full rounded-sm border border-foreground/40 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
                    >
                      <option value="" disabled>
                        직원 선택
                      </option>
                      {STAFF.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between border-t border-foreground/60 px-4 py-2 text-[11px] text-muted-foreground">
        <span>총 {rows.length}건 · 필터: {tab}</span>
        <span>ⓘ 행을 클릭하면 우측에서 상세 정보를 확인할 수 있습니다</span>
      </footer>

      {/* 토스트 영역 */}
      <div className="pointer-events-none absolute bottom-12 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`relative rounded-sm border px-4 py-2 text-xs shadow-md ${
              t.kind === "warn"
                ? "border-destructive bg-background text-destructive"
                : "border-foreground bg-foreground text-background"
            }`}
          >
            <span className="pointer-events-none absolute -left-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full border border-foreground bg-background text-[9px] font-bold text-foreground">
              T
            </span>
            {t.kind === "warn" ? "⚠ " : ""}
            {t.message}
          </div>
        ))}
      </div>

      {/* 견적서 작성 확인 모달 */}
      {quoteModal.open && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4">
          <div className="relative w-full max-w-sm rounded-md border border-foreground bg-background p-5 shadow-lg">
            <span className="pointer-events-none absolute -left-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-foreground bg-background text-[10px] font-bold text-foreground">
              M
            </span>
            <h3 className="text-base font-bold text-foreground">견적서를 작성하시겠습니까?</h3>
            <p className="mt-2 text-sm text-muted-foreground text-pretty">
              상태를 '견적발송'으로 변경합니다. 지금 견적서를 작성하시면 SCR-QUOTE-001 화면으로
              이동합니다.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => confirmQuote(false)}
                className="rounded-sm border border-foreground/40 px-3 py-2 text-sm text-foreground"
              >
                나중에
              </button>
              <button
                onClick={() => confirmQuote(true)}
                className="rounded-sm border border-foreground bg-foreground px-3 py-2 text-sm font-semibold text-background"
              >
                견적서 작성하기 →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-16 shrink-0 text-muted-foreground">{label}</dt>
      <dd className="flex-1 text-foreground">{value}</dd>
    </div>
  )
}

const MENU = [
  { label: "대시보드", code: "SCR-DASH-001" },
  { label: "문의 처리 관리", code: "SCR-INQ-002", active: true },
  { label: "견적 관리", code: "SCR-QUOTE-001" },
  { label: "시공 일정", code: "SCR-SCHED" },
  { label: "직원 관리", code: "SCR-STAFF" },
  { label: "리뷰 관리", code: "SCR-REV" },
]
