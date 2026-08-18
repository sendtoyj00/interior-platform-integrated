"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { WfNumber } from "./wf-badge"
import { Toast } from "./wf-modals"
import {
  initialProcessSteps,
  processTemplate,
  projectStartDate,
  progressToStatus,
  PROCESS_STATUS_LABEL,
  type ProcessStep,
  type ProcessStatus,
} from "@/lib/blocks/dealflow/mock-data"
import { MENU_LABEL } from "@/lib/menu-labels"

const FIELD_MENU = [MENU_LABEL.dashboard, MENU_LABEL.process, MENU_LABEL.photo, MENU_LABEL.settings]

function ProcessStatusBadge({ status }: { status: ProcessStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
        status === "todo" && "border-neutral-400 bg-neutral-100 text-neutral-600",
        status === "doing" && "border-neutral-600 bg-neutral-500 text-white",
        status === "done" && "border-neutral-800 bg-neutral-800 text-white",
      )}
    >
      {PROCESS_STATUS_LABEL[status]}
    </span>
  )
}

/* 프로그레스바 */
function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full border border-neutral-300 bg-neutral-100">
      <div className="h-full bg-neutral-800 transition-all" style={{ width: `${value}%` }} />
    </div>
  )
}

/* ① 공정 템플릿 적용 모달 */
function TemplateModal({
  onCancel,
  onApply,
}: {
  onCancel: () => void
  onApply: (ids: string[]) => void
}) {
  const [selected, setSelected] = useState<string[]>(processTemplate.map((t) => t.id))

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-neutral-900/40 p-4">
      <WfNumber n={1} className="w-full max-w-md">
        <div className="w-full rounded-md border-2 border-neutral-700 bg-white shadow-lg">
          <div className="border-b border-dashed border-neutral-400 px-4 py-3">
            <h3 className="text-sm font-bold text-neutral-800">공정 템플릿 적용</h3>
            <p className="mt-0.5 text-[11px] text-neutral-500">표준 공정을 선택하여 프로젝트에 일괄 등록합니다.</p>
          </div>
          <div className="max-h-64 overflow-auto px-4 py-3">
            <ul className="space-y-1.5">
              {processTemplate.map((t) => (
                <li key={t.id}>
                  <label className="flex cursor-pointer items-center gap-2 rounded border border-neutral-300 bg-neutral-50 px-3 py-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(t.id)}
                      onChange={() => toggle(t.id)}
                      className="h-4 w-4 accent-neutral-800"
                    />
                    <span className="flex-1 text-sm text-neutral-800">{t.name}</span>
                    <span className="text-[11px] text-neutral-400">완료예정 {t.defaultDue}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-end gap-2 border-t border-dashed border-neutral-400 px-4 py-3">
            <button
              onClick={onCancel}
              className="rounded border border-neutral-400 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100"
            >
              취소
            </button>
            <button
              onClick={() => onApply(selected)}
              disabled={selected.length === 0}
              className="rounded border border-neutral-800 bg-neutral-800 px-3 py-1.5 text-sm text-white enabled:hover:bg-neutral-900 disabled:cursor-not-allowed disabled:border-neutral-300 disabled:bg-neutral-200 disabled:text-neutral-400"
            >
              {selected.length}개 등록
            </button>
          </div>
        </div>
      </WfNumber>
    </div>
  )
}

/* ⑥ 지연/이슈 등록 모달 */
function IssueModal({
  stepName,
  onCancel,
  onSubmit,
}: {
  stepName: string
  onCancel: () => void
  onSubmit: (reason: string, duration: string) => void
}) {
  const [reason, setReason] = useState("")
  const [duration, setDuration] = useState("")
  const disabled = reason.trim().length === 0

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-neutral-900/40 p-4">
      <WfNumber n={6} className="w-full max-w-md">
        <div className="w-full rounded-md border-2 border-neutral-700 bg-white shadow-lg">
          <div className="border-b border-dashed border-neutral-400 px-4 py-3">
            <h3 className="text-sm font-bold text-neutral-800">지연 / 이슈 등록</h3>
            <p className="mt-0.5 text-[11px] text-neutral-500">{stepName}</p>
          </div>
          <div className="space-y-3 px-4 py-3">
            <div>
              <label className="mb-1 block text-[11px] text-neutral-500">
                지연 사유 <span className="text-neutral-800">(필수)</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="예) 자재 입고 지연으로 설비 착수 불가"
                className="w-full resize-none rounded border border-neutral-400 bg-neutral-50 px-2 py-1.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-neutral-500">예상 지연기간 (선택)</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="예) 3일"
                className="w-full rounded border border-neutral-400 bg-neutral-50 px-2 py-1.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-700 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-dashed border-neutral-400 px-4 py-3">
            <button
              onClick={onCancel}
              className="rounded border border-neutral-400 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100"
            >
              취소
            </button>
            <button
              onClick={() => onSubmit(reason, duration)}
              disabled={disabled}
              className="rounded border border-neutral-800 bg-neutral-800 px-3 py-1.5 text-sm text-white enabled:hover:bg-neutral-900 disabled:cursor-not-allowed disabled:border-neutral-300 disabled:bg-neutral-200 disabled:text-neutral-400"
            >
              등록
            </button>
          </div>
        </div>
      </WfNumber>
    </div>
  )
}

/* 공정 단계 카드 (세로 타임라인 노드) */
function ProcessCard({
  step,
  index,
  total,
  onProgress,
  onDate,
  onIssue,
}: {
  step: ProcessStep
  index: number
  total: number
  onProgress: (id: string, v: number) => void
  onDate: (id: string, v: string) => void
  onIssue: (id: string) => void
}) {
  const dateError = step.dueDate < projectStartDate

  return (
    <div className="relative flex gap-3">
      {/* 타임라인 레일 */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-bold",
            step.status === "done"
              ? "border-neutral-800 bg-neutral-800 text-white"
              : step.status === "doing"
                ? "border-neutral-700 bg-white text-neutral-800"
                : "border-neutral-400 bg-white text-neutral-400",
          )}
        >
          {step.status === "done" ? "✓" : index + 1}
        </div>
        {index < total - 1 && <div className="w-0.5 flex-1 bg-neutral-300" />}
      </div>

      {/* 카드 본문 (②) */}
      <div className="mb-4 flex-1">
        <WfNumber n={2}>
          <div className="rounded-md border border-neutral-400 bg-white">
            {/* 헤더: 단계명 + 상태 + 지연배지 */}
            <div className="flex items-center justify-between gap-2 border-b border-dashed border-neutral-300 px-4 py-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-neutral-900">{step.name}</h3>
                {step.delayed && (
                  <span
                    title={step.delayReason}
                    className="inline-flex items-center gap-1 rounded-full border border-neutral-700 bg-neutral-200 px-2 py-0.5 text-[10px] font-bold text-neutral-800"
                  >
                    ⚠ 지연
                  </span>
                )}
              </div>
              <ProcessStatusBadge status={step.status} />
            </div>

            <div className="space-y-3 px-4 py-3">
              {/* 진행률 프로그레스바 (실시간) */}
              <div>
                <div className="mb-1 flex items-center justify-between text-[11px] text-neutral-500">
                  <span>진행률</span>
                  <span className="font-mono text-neutral-800">{step.progress}%</span>
                </div>
                <ProgressBar value={step.progress} />
              </div>

              {/* ③ 진행률 슬라이더 */}
              <WfNumber n={3}>
                <div className="rounded border border-neutral-300 bg-neutral-50 px-3 py-2">
                  <label className="mb-1 block text-[11px] text-neutral-500">진행률 입력 (0~100%)</label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={step.progress}
                    onChange={(e) => onProgress(step.id, Number(e.target.value))}
                    className="w-full accent-neutral-800"
                  />
                </div>
              </WfNumber>

              {/* ④ 완료일 날짜 선택 */}
              <WfNumber n={4}>
                <div className="rounded border border-neutral-300 bg-neutral-50 px-3 py-2">
                  <label className="mb-1 block text-[11px] text-neutral-500">완료예정일</label>
                  <input
                    type="date"
                    value={step.dueDate}
                    onChange={(e) => onDate(step.id, e.target.value)}
                    className={cn(
                      "w-full rounded border bg-white px-2 py-1 text-sm text-neutral-800 focus:outline-none",
                      dateError ? "border-neutral-800" : "border-neutral-400 focus:border-neutral-700",
                    )}
                  />
                  {dateError && (
                    <p className="mt-1 text-[11px] font-medium text-neutral-800">
                      ⚠ 완료일이 프로젝트 시작일({projectStartDate})보다 이전입니다.
                    </p>
                  )}
                </div>
              </WfNumber>

              {/* 액션 버튼들 */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {/* ⑤ 지연/이슈 등록 */}
                <WfNumber n={5}>
                  <button
                    onClick={() => onIssue(step.id)}
                    className="rounded border border-neutral-700 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 hover:bg-neutral-100"
                  >
                    지연/이슈 등록
                  </button>
                </WfNumber>
                {/* 사진 업로드 보조 버튼 → SCR-PROC-002 */}
                <button className="rounded border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-100">
                  사진 업로드 → SCR-PROC-002
                </button>
              </div>
            </div>
          </div>
        </WfNumber>
      </div>
    </div>
  )
}

export function ProcessScreen({ variant }: { variant: "desktop" | "mobile" }) {
  const isMobile = variant === "mobile"

  const [steps, setSteps] = useState<ProcessStep[]>(initialProcessSteps)
  const [showTemplate, setShowTemplate] = useState(false)
  const [issueFor, setIssueFor] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [footer, setFooter] = useState("현장 공정: 진행중 1 · 완료 1 · 예정 1")

  function fireToast(msg: string, footerMsg?: string) {
    setToast(msg)
    if (footerMsg) setFooter(footerMsg)
    setTimeout(() => setToast(null), 2800)
  }

  /* ③ 슬라이더 → 프로그레스바 실시간 갱신 + 100% 자동 완료 */
  function handleProgress(id: string, value: number) {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, progress: value, status: progressToStatus(value) } : s)),
    )
    if (value >= 100) {
      const step = steps.find((s) => s.id === id)
      fireToast(`"${step?.name}" 공정이 완료 처리되었습니다.`)
    }
  }

  /* ④ 완료일 변경 */
  function handleDate(id: string, value: string) {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, dueDate: value } : s)))
  }

  /* ① 템플릿 적용 → 일괄 등록 */
  function handleApplyTemplate(ids: string[]) {
    const picked = processTemplate.filter((t) => ids.includes(t.id))
    setSteps(
      picked.map((t, i) => ({
        id: `P${i + 1}`,
        name: t.name,
        progress: 0,
        dueDate: t.defaultDue,
        status: "todo" as ProcessStatus,
        delayed: false,
      })),
    )
    setShowTemplate(false)
    fireToast(`${picked.length}개 표준 공정이 등록되었습니다.`, `현장 공정: ${picked.length}개 공정 등록됨`)
  }

  /* ⑥ 지연/이슈 등록 → 지연 배지 */
  function handleIssueSubmit(reason: string, duration: string) {
    const id = issueFor
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, delayed: true, delayReason: reason, delayDuration: duration } : s)),
    )
    setIssueFor(null)
    const step = steps.find((s) => s.id === id)
    fireToast(`"${step?.name}" 공정에 지연/이슈가 등록되었습니다.`)
  }

  const issueStep = steps.find((s) => s.id === issueFor)

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
            현장 담당자
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
          {!isMobile && <p className="mb-2 px-2 text-[10px] uppercase tracking-wider text-neutral-400">현장 메뉴</p>}
          <ul className={cn(isMobile ? "flex gap-1" : "flex flex-col gap-1")}>
            {FIELD_MENU.map((m, i) => (
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
              <h1 className="text-base font-bold">시공관리 · 공정 관리</h1>
              <p className="text-xs text-neutral-500">우리집 인테리어 · 착공일 {projectStartDate}</p>
            </div>
            {/* ① 공정 템플릿 적용 버튼 */}
            <WfNumber n={1}>
              <button
                onClick={() => setShowTemplate(true)}
                className="rounded border border-neutral-800 bg-neutral-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-900"
              >
                + 공정 템플릿 적용
              </button>
            </WfNumber>
          </div>

          {/* 세로 타임라인 / 체크리스트 */}
          {steps.length === 0 ? (
            <div className="rounded-md border border-dashed border-neutral-400 bg-white px-4 py-10 text-center text-xs text-neutral-500">
              등록된 공정이 없습니다. 상단 &quot;공정 템플릿 적용&quot;으로 시작하세요.
            </div>
          ) : (
            <div className="pt-1">
              {steps.map((step, i) => (
                <ProcessCard
                  key={step.id}
                  step={step}
                  index={i}
                  total={steps.length}
                  onProgress={handleProgress}
                  onDate={handleDate}
                  onIssue={(id) => setIssueFor(id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ===== 푸터 ===== */}
      <footer className="flex items-center justify-between border-t-2 border-neutral-700 bg-white px-4 py-2 text-[11px] text-neutral-500">
        <span>{footer}</span>
        {!isMobile && <span>© 2026 인테리어 견적 시스템 · 와이어프레임</span>}
      </footer>

      {/* ===== 모달 / 토스트 ===== */}
      {showTemplate && <TemplateModal onCancel={() => setShowTemplate(false)} onApply={handleApplyTemplate} />}
      {issueFor && issueStep && (
        <IssueModal
          stepName={issueStep.name}
          onCancel={() => setIssueFor(null)}
          onSubmit={handleIssueSubmit}
        />
      )}
      {toast && <Toast message={toast} />}
    </div>
  )
}
