"use client"

import { useState } from "react"
import {
  INITIAL_MILESTONES,
  todayDate,
  won,
  type Milestone,
} from "@/lib/blocks/ops/payment-mock"
import { Num } from "./num"

type Device = "desktop" | "mobile"

type Toast = {
  id: number
  kind: "error" | "info"
  message: string
}

let toastSeq = 0
let milestoneSeq = 0

export function PaymentApp({ device }: { device: Device }) {
  const isMobile = device === "mobile"

  const [milestones, setMilestones] = useState<Milestone[]>(INITIAL_MILESTONES)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [status, setStatus] = useState("대기 중 — 결제 단계를 관리하세요.")

  // ② add modal
  const [addOpen, setAddOpen] = useState(false)
  // ⑤ confirm modal — holds the id of the milestone being confirmed
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const pushToast = (kind: Toast["kind"], message: string) => {
    const id = ++toastSeq
    setToasts((t) => [...t, { id, kind, message }])
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, 3600)
  }

  const addMilestone = (m: {
    name: string
    amount: number
    dueDate: string
  }) => {
    const item: Milestone = {
      id: `new-${++milestoneSeq}`,
      name: m.name,
      amount: m.amount,
      dueDate: m.dueDate,
      status: "pending",
      confirmedDate: "",
      memo: "",
    }
    setMilestones((prev) => [...prev, item])
    setAddOpen(false)
    setStatus(`결제 단계 추가됨 — ${m.name} (${won(m.amount)})`)
    pushToast("info", `"${m.name}" 결제 단계가 추가되었습니다.`)
  }

  const confirmDeposit = (id: string, confirmedDate: string, memo: string) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: "done", confirmedDate, memo }
          : m,
      ),
    )
    const target = milestones.find((m) => m.id === id)
    setConfirmId(null)
    setStatus(
      `입금 확인 완료 — ${target?.name ?? ""} · 상태 대기 → 완료`,
    )
    pushToast("info", "고객에게 결제 완료 알림이 발송됩니다.")
  }

  const roleLabel = "업체 관리자"
  const menuItems = [
    "대시보드",
    "프로젝트 관리",
    "결제 마일스톤",
    "견적/계약",
    "정산",
    "고객 관리",
  ]
  const activeMenu = "결제 마일스톤"

  const confirmTarget = milestones.find((m) => m.id === confirmId) ?? null

  const totalAmount = milestones.reduce((s, m) => s + m.amount, 0)
  const doneAmount = milestones
    .filter((m) => m.status === "done")
    .reduce((s, m) => s + m.amount, 0)

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
              ? "border-b border-foreground bg-muted/40 p-3"
              : "w-56 shrink-0 border-r border-foreground bg-muted/40 p-3"
          }
        >
          <div className="mb-2 text-[11px] uppercase tracking-wide text-muted-foreground">
            {roleLabel} 메뉴
          </div>
          <div className="relative">
            <Num n={7} />
            <nav
              className={
                isMobile ? "flex flex-wrap gap-2" : "flex flex-col gap-1"
              }
            >
              {menuItems.map((m) => (
                <button
                  key={m}
                  className={[
                    "border px-3 py-2 text-left text-xs",
                    m === activeMenu
                      ? "border-foreground bg-foreground text-background"
                      : "border-foreground/40 hover:bg-muted",
                  ].join(" ")}
                >
                  {m}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* ===== BODY ===== */}
        <main className="min-w-0 flex-1 p-4">
          <div className="mb-4 flex items-start justify-between gap-2">
            <div>
              <h1 className="text-base font-bold">결제 마일스톤 관리</h1>
              <p className="text-xs text-muted-foreground">
                업체 관리자 · 계약금/중도금/잔금 단계 및 입금 확인
              </p>
            </div>
            <span className="border border-dashed border-foreground/40 px-2 py-1 text-[10px] text-muted-foreground">
              {device === "desktop" ? "Desktop 1920px" : "Mobile 360px"}
            </span>
          </div>

          {/* summary + ① add button */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border border-foreground/40 bg-muted/30 p-3">
            <div className="flex flex-wrap gap-4 text-xs">
              <span>
                총 결제액{" "}
                <strong className="text-sm">{won(totalAmount)}</strong>
              </span>
              <span className="text-muted-foreground">
                입금 완료{" "}
                <strong className="text-foreground">{won(doneAmount)}</strong> /
                미수금{" "}
                <strong className="text-foreground">
                  {won(totalAmount - doneAmount)}
                </strong>
              </span>
            </div>
            <div className="relative">
              <Num n={1} />
              <button
                onClick={() => setAddOpen(true)}
                className="border border-foreground bg-foreground px-4 py-2 text-xs font-bold text-background hover:opacity-90"
              >
                + 결제 단계 추가
              </button>
            </div>
          </div>

          {/* ③ table */}
          <div className="relative">
            <Num n={3} />
            <MilestoneTable
              isMobile={isMobile}
              milestones={milestones}
              onConfirm={(id) => setConfirmId(id)}
            />
          </div>

          <p className="mt-3 border-l-2 border-foreground/40 pl-2 text-[11px] text-muted-foreground">
            ※ PG 자동연동 전까지 <strong>수동 확인</strong> 원칙 — 완료 처리된
            단계는 되돌릴 수 없습니다.
          </p>
        </main>
      </div>

      {/* ===== FOOTER (status area) ===== */}
      <footer className="flex items-center gap-2 border-t border-foreground bg-secondary px-4 py-2">
        <span className="border border-foreground px-2 py-0.5 text-[10px] font-bold">
          STATUS
        </span>
        <span
          className="text-xs text-muted-foreground"
          role="status"
          aria-live="polite"
        >
          {status}
        </span>
      </footer>

      {/* ===== TOASTS ===== */}
      <div className="pointer-events-none absolute right-3 top-14 z-30 flex w-72 flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={[
              "relative border bg-background px-3 py-2 text-xs shadow-sm",
              t.kind === "error" ? "border-foreground" : "border-foreground/50",
            ].join(" ")}
          >
            <Num n={8} />
            <span className="font-bold">
              {t.kind === "error" ? "⚠ 오류" : "✓ 알림"}
            </span>
            <p className="mt-0.5 text-muted-foreground">{t.message}</p>
          </div>
        ))}
      </div>

      {/* ===== ② ADD MODAL ===== */}
      {addOpen && (
        <AddModal
          onClose={() => setAddOpen(false)}
          onSubmit={addMilestone}
          onError={(msg) => pushToast("error", msg)}
        />
      )}

      {/* ===== ⑤ CONFIRM MODAL ===== */}
      {confirmTarget && (
        <ConfirmModal
          milestone={confirmTarget}
          onClose={() => setConfirmId(null)}
          onSubmit={(date, memo) =>
            confirmDeposit(confirmTarget.id, date, memo)
          }
        />
      )}
    </div>
  )
}

/* -------------------- ③ TABLE -------------------- */
function StatusBadge({ status }: { status: Milestone["status"] }) {
  const done = status === "done"
  return (
    <span
      className={[
        "inline-flex items-center gap-1 border px-2 py-0.5 text-[10px] font-bold",
        done
          ? "border-foreground bg-foreground text-background"
          : "border-foreground/60 bg-background text-foreground",
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          done ? "bg-background" : "bg-foreground",
        ].join(" ")}
        aria-hidden="true"
      />
      {done ? "완료" : "대기"}
    </span>
  )
}

function MilestoneTable({
  isMobile,
  milestones,
  onConfirm,
}: {
  isMobile: boolean
  milestones: Milestone[]
  onConfirm: (id: string) => void
}) {
  // Mobile: stacked cards. Desktop: real table.
  if (isMobile) {
    return (
      <div className="flex flex-col gap-2">
        {milestones.map((m) => (
          <div
            key={m.id}
            className="border border-foreground/40 bg-background p-3 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">{m.name}</span>
              <StatusBadge status={m.status} />
            </div>
            <dl className="mt-2 flex flex-col gap-1 text-muted-foreground">
              <div className="flex justify-between">
                <dt>금액</dt>
                <dd className="font-medium text-foreground">{won(m.amount)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>입금기한</dt>
                <dd>{m.dueDate || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt>입금확인일</dt>
                <dd>{m.confirmedDate || "—"}</dd>
              </div>
            </dl>
            {m.status === "pending" && (
              <div className="relative mt-2 inline-block">
                <Num n={4} />
                <button
                  onClick={() => onConfirm(m.id)}
                  className="border border-foreground px-3 py-1 text-xs font-bold hover:bg-muted"
                >
                  입금 확인
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-hidden border border-foreground/40">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="border-b border-foreground bg-muted/50 text-left">
            <th className="px-3 py-2 font-bold">단계명</th>
            <th className="px-3 py-2 text-right font-bold">금액</th>
            <th className="px-3 py-2 font-bold">입금기한</th>
            <th className="px-3 py-2 font-bold">상태</th>
            <th className="px-3 py-2 font-bold">입금확인일</th>
            <th className="px-3 py-2 font-bold">관리</th>
          </tr>
        </thead>
        <tbody>
          {milestones.map((m) => (
            <tr
              key={m.id}
              className="border-b border-foreground/20 last:border-b-0"
            >
              <td className="px-3 py-2 font-medium">{m.name}</td>
              <td className="px-3 py-2 text-right tabular-nums">
                {won(m.amount)}
              </td>
              <td className="px-3 py-2 text-muted-foreground">
                {m.dueDate || "—"}
              </td>
              <td className="px-3 py-2">
                <StatusBadge status={m.status} />
              </td>
              <td className="px-3 py-2 text-muted-foreground">
                {m.confirmedDate || "—"}
              </td>
              <td className="px-3 py-2">
                {m.status === "pending" ? (
                  <div className="relative inline-block">
                    <Num n={4} />
                    <button
                      onClick={() => onConfirm(m.id)}
                      className="border border-foreground px-3 py-1 text-[11px] font-bold hover:bg-muted"
                    >
                      입금 확인
                    </button>
                  </div>
                ) : (
                  <span className="text-[11px] text-muted-foreground">
                    확인 완료
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* -------------------- MODAL SHELL -------------------- */
function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div className="absolute inset-0 z-40 flex items-start justify-center overflow-auto bg-foreground/30 p-4">
      <div className="relative mt-8 w-full max-w-md border border-foreground bg-background shadow-lg">
        <div className="flex items-center justify-between border-b border-foreground bg-secondary px-4 py-2">
          <h2 className="text-sm font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center border border-foreground text-sm hover:bg-muted"
            aria-label="닫기"
          >
            ×
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}

function FieldLabel({
  text,
  required,
}: {
  text: string
  required?: boolean
}) {
  return (
    <div className="mb-1 flex items-center gap-1 text-xs font-medium">
      <span>{text}</span>
      {required && <span className="text-foreground">*</span>}
    </div>
  )
}

/* -------------------- ② ADD MODAL -------------------- */
function AddModal({
  onClose,
  onSubmit,
  onError,
}: {
  onClose: () => void
  onSubmit: (m: { name: string; amount: number; dueDate: string }) => void
  onError: (msg: string) => void
}) {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [errors, setErrors] = useState<{ name?: string; amount?: string }>({})

  const submit = () => {
    const next: { name?: string; amount?: string } = {}
    if (!name.trim()) next.name = "결제단계명을 입력해주세요."
    const amt = Number(amount)
    if (!amount.trim() || Number.isNaN(amt)) {
      next.amount = "금액을 입력해주세요."
    } else if (amt <= 0) {
      next.amount = "금액은 0보다 큰 값이어야 합니다."
    }
    setErrors(next)
    if (Object.keys(next).length > 0) {
      onError(next.amount ?? next.name ?? "입력값을 확인해주세요.")
      return
    }
    onSubmit({ name: name.trim(), amount: amt, dueDate })
  }

  return (
    <ModalShell title="결제 단계 추가" onClose={onClose}>
      <div className="flex flex-col gap-4">
        {/* name */}
        <div>
          <FieldLabel text="결제단계명 (예: 계약금/중도금/잔금)" required />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="결제단계명"
            className={[
              "w-full border bg-background px-3 py-2 text-sm",
              errors.name ? "border-foreground ring-2 ring-foreground" : "border-foreground/60",
            ].join(" ")}
          />
          {errors.name && (
            <p className="mt-1 text-xs font-bold">⚠ {errors.name}</p>
          )}
        </div>

        {/* amount */}
        <div>
          <FieldLabel text="금액 (원)" required />
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="numeric"
            placeholder="예: 5000000"
            className={[
              "w-full border bg-background px-3 py-2 text-sm tabular-nums",
              errors.amount ? "border-foreground ring-2 ring-foreground" : "border-foreground/60",
            ].join(" ")}
          />
          {errors.amount && (
            <p className="mt-1 text-xs font-bold">⚠ {errors.amount}</p>
          )}
        </div>

        {/* due date */}
        <div>
          <FieldLabel text="입금기한 (선택)" />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border border-foreground/60 bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="border border-foreground/60 px-4 py-2 text-xs hover:bg-muted"
          >
            취소
          </button>
          <button
            onClick={submit}
            className="border border-foreground bg-foreground px-5 py-2 text-xs font-bold text-background hover:opacity-90"
          >
            등록
          </button>
        </div>
      </div>
    </ModalShell>
  )
}

/* -------------------- ⑤ CONFIRM MODAL -------------------- */
function ConfirmModal({
  milestone,
  onClose,
  onSubmit,
}: {
  milestone: Milestone
  onClose: () => void
  onSubmit: (date: string, memo: string) => void
}) {
  const [date, setDate] = useState(todayDate())
  const [memo, setMemo] = useState("")

  return (
    <ModalShell title="입금 확인" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="border border-foreground/40 bg-muted/30 p-3 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">결제 단계</span>
            <span className="font-bold">{milestone.name}</span>
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-muted-foreground">금액</span>
            <span className="font-medium">{won(milestone.amount)}</span>
          </div>
        </div>

        <div>
          <FieldLabel text="입금확인일" required />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-foreground/60 bg-background px-3 py-2 text-sm"
          />
        </div>

        <div>
          <FieldLabel text="메모 (선택)" />
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows={3}
            placeholder="입금 확인 관련 메모"
            className="w-full resize-none border border-foreground/60 bg-background px-3 py-2 text-sm"
          />
        </div>

        <p className="border-l-2 border-foreground/40 pl-2 text-[11px] text-muted-foreground">
          확인 시 상태가 <strong>대기 → 완료</strong>로 전환되며, 고객에게 결제
          완료 알림이 발송됩니다. (되돌리기 불가)
        </p>

        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={onClose}
            className="border border-foreground/60 px-4 py-2 text-xs hover:bg-muted"
          >
            취소
          </button>
          <button
            onClick={() => onSubmit(date, memo)}
            className="border border-foreground bg-foreground px-5 py-2 text-xs font-bold text-background hover:opacity-90"
          >
            확인
          </button>
        </div>
      </div>
    </ModalShell>
  )
}
