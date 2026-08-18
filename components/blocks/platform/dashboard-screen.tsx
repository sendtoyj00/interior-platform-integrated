"use client"

import { useState } from "react"
import { NumBadge } from "./num-badge"
import { SummaryCards } from "./summary-cards"
import { StageChart } from "./stage-chart"
import { ProjectTable } from "./project-table"
import { EmptyState } from "./empty-state"
import { NavModal, Toast } from "./overlays"
import { NAV, stageLabel, type Project, type StageKey } from "@/lib/blocks/platform/mock-data"

export function DashboardScreen({
  variant,
  isEmpty,
  onNavigateToProcess,
  onNavigateToInquiries,
}: {
  variant: "desktop" | "mobile"
  isEmpty: boolean
  /** 프로젝트 리스트 행 클릭 → 공정관리(SCR-PROC-001) 이동 시 실제 라우팅 연결용 */
  onNavigateToProcess?: (project: Project) => void
  /** 빈 상태의 "문의 확인하러 가기" → 문의처리(SCR-INQ-002) 이동 시 실제 라우팅 연결용 */
  onNavigateToInquiries?: () => void
}) {
  const isMobile = variant === "mobile"
  const [filter, setFilter] = useState<StageKey | null>(null)
  const [activeNav, setActiveNav] = useState("dashboard")
  const [modalProject, setModalProject] = useState<Project | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [navOpen, setNavOpen] = useState(false)

  function fireToast(msg: string) {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2500)
  }

  function confirmNav() {
    if (modalProject) {
      if (onNavigateToProcess) {
        fireToast(`SCR-PROC-001 이동 (${modalProject.id})`)
        const target = modalProject
        setModalProject(null)
        window.setTimeout(() => onNavigateToProcess(target), 500)
        return
      }
      fireToast(`SCR-PROC-001 이동 (${modalProject.id})`)
      setModalProject(null)
    }
  }

  const sidebar = (
    <nav className="flex flex-col gap-1" aria-label="역할별 메뉴">
      <p className="px-2 pb-1 text-[10px] uppercase tracking-wide text-muted-foreground">업체 관리자</p>
      {NAV.map((item, i) => (
        <div key={item.key} className="relative">
          <NumBadge n={2 + i} />
          <button
            type="button"
            onClick={() => {
              setActiveNav(item.key)
              setNavOpen(false)
            }}
            className={`w-full rounded px-3 py-2 text-left text-xs transition-colors hover:bg-muted ${
              activeNav === item.key ? "bg-muted font-semibold text-foreground" : "text-muted-foreground"
            }`}
          >
            {item.label}
          </button>
        </div>
      ))}
    </nav>
  )

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background text-foreground">
      {/* 헤더 */}
      <header className="flex items-center justify-between gap-2 border-b border-foreground/60 px-4 py-3">
        <div className="flex items-center gap-2">
          {isMobile && (
            <div className="relative">
              <NumBadge n={1} />
              <button
                type="button"
                aria-label="메뉴 열기"
                onClick={() => setNavOpen((v) => !v)}
                className="flex h-8 w-8 items-center justify-center rounded border border-foreground/40 text-foreground hover:bg-muted"
              >
                ≡
              </button>
            </div>
          )}
          <div className="flex h-7 items-center rounded border border-foreground px-2 text-xs font-bold">
            인테리어 플랫폼
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-full border border-foreground/40 px-2 py-0.5 text-[11px] text-muted-foreground sm:inline">
            역할: 업체 관리자
          </span>
          <div className="relative">
            <NumBadge n={isMobile ? 8 : 1} />
            <button
              type="button"
              className="rounded border border-foreground/40 bg-background px-3 py-1 text-xs text-foreground hover:bg-muted"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* 본문: 사이드바 + 바디 */}
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && (
          <aside className="w-52 shrink-0 border-r border-foreground/40 bg-sidebar p-3">{sidebar}</aside>
        )}

        {isMobile && navOpen && (
          <div className="absolute inset-0 z-20 flex">
            <aside className="w-56 border-r border-foreground bg-sidebar p-3">{sidebar}</aside>
            <button
              type="button"
              aria-label="메뉴 닫기"
              className="flex-1 bg-foreground/20"
              onClick={() => setNavOpen(false)}
            />
          </div>
        )}

        <main className="flex-1 space-y-5 overflow-y-auto p-4">
          <div>
            <h1 className="text-base font-semibold text-foreground">대시보드</h1>
            <p className="text-xs text-muted-foreground">공정 현황 요약 · SCR-DASH-001</p>
          </div>

          {isEmpty ? (
            <EmptyState
              onGoInquiries={() => {
                if (onNavigateToInquiries) {
                  fireToast("SCR-INQ-002 문의 처리 관리로 이동합니다")
                  window.setTimeout(() => onNavigateToInquiries(), 500)
                } else {
                  fireToast("문의 관리로 이동 (목업)")
                }
              }}
            />
          ) : (
            <>
              <SummaryCards columns={isMobile ? 1 : 4} />
              <div className={isMobile ? "space-y-5" : "grid grid-cols-[minmax(0,340px)_1fr] gap-5 items-start"}>
                <StageChart
                  active={filter}
                  onSelect={(key) => setFilter((cur) => (cur === key ? null : key))}
                />
                {!isMobile && (
                  <ProjectTable
                    variant="desktop"
                    filter={filter}
                    onSelectStage={(key) => setFilter(key)}
                    onClearFilter={() => setFilter(null)}
                    onRowClick={(p) => setModalProject(p)}
                  />
                )}
              </div>
              {isMobile && (
                <ProjectTable
                  variant="mobile"
                  filter={filter}
                  onSelectStage={(key) => setFilter(key)}
                  onClearFilter={() => setFilter(null)}
                  onRowClick={(p) => setModalProject(p)}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* 푸터: 상태 메시지 영역 */}
      <footer className="flex items-center justify-between border-t border-foreground/60 px-4 py-2 text-[11px] text-muted-foreground">
        <span>
          {filter ? `필터 적용됨 · ${stageLabel(filter)}` : "상태: 정상 · 실시간 목업 데이터"}
        </span>
        <span className="tabular-nums">최종 동기화 2026-08-18 14:20</span>
      </footer>

      {modalProject && (
        <NavModal
          project={modalProject}
          onConfirm={confirmNav}
          onCancel={() => setModalProject(null)}
        />
      )}
      {toast && <Toast message={toast} />}
    </div>
  )
}
