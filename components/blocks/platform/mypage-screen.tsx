"use client"

import { useState } from "react"
import { NumBadge } from "./num-badge"
import { QuoteTab, ContractTab, ProcessTab, PaymentTab, PhotoTab } from "./customer-tabs"
import { CUSTOMER_TABS, CUSTOMER_PROJECT, type TabKey } from "@/lib/blocks/platform/mock-data"

export function MyPageScreen({
  variant,
  isEmpty,
}: {
  variant: "desktop" | "mobile"
  isEmpty: boolean
}) {
  const isMobile = variant === "mobile"
  const [tab, setTab] = useState<TabKey>("quote")

  // ② 탭 전환 시 상태값(가상 URL 해시)로 현재 탭 유지 표현
  const hash = `#tab=${tab}`

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background text-foreground">
      {/* 가상 브라우저 URL 바 — 새로고침해도 탭 유지되는 것처럼 표현 */}
      <div className="flex items-center gap-2 border-b border-foreground/20 bg-muted px-3 py-1.5">
        <span className="flex gap-1" aria-hidden="true">
          <span className="h-2 w-2 rounded-full border border-foreground/40" />
          <span className="h-2 w-2 rounded-full border border-foreground/40" />
        </span>
        <code className="truncate text-[10px] text-muted-foreground">/mypage/PRJ-2041{hash}</code>
      </div>

      {/* 헤더: 로고 / 역할 표시 / 로그아웃 */}
      <header className="flex items-center justify-between gap-2 border-b border-foreground/60 px-4 py-3">
        <div className="flex h-7 items-center rounded border border-foreground px-2 text-xs font-bold">
          인테리어 플랫폼
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-full border border-foreground/40 px-2 py-0.5 text-[11px] text-muted-foreground sm:inline">
            역할: 고객
          </span>
          <div className="relative">
            <NumBadge n={99} />
            <button
              type="button"
              className="rounded border border-foreground/40 bg-background px-3 py-1 text-xs text-foreground hover:bg-muted"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="mb-4">
          <h1 className="text-base font-semibold text-foreground">마이페이지 · 프로젝트 통합 조회</h1>
          <p className="text-xs text-muted-foreground">SCR-MYPG-001</p>
        </div>

        {/* ① 프로젝트 요약 헤더 */}
        <section className="relative mb-4 rounded-md border border-foreground/50 bg-background p-4">
          <NumBadge n={1} />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[11px] text-muted-foreground">{CUSTOMER_PROJECT.vendor}</p>
              <p className="text-sm font-semibold text-foreground">{CUSTOMER_PROJECT.projectName}</p>
            </div>
            <span className="rounded-full border border-foreground bg-foreground px-2.5 py-0.5 text-[11px] font-semibold text-background">
              현재 단계 · {CUSTOMER_PROJECT.currentStage}
            </span>
          </div>
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>전체 진행률</span>
              <span className="tabular-nums text-foreground">{CUSTOMER_PROJECT.progress}%</span>
            </div>
            <div
              className="h-2.5 w-full overflow-hidden rounded-full border border-foreground/40 bg-muted"
              role="progressbar"
              aria-valuenow={CUSTOMER_PROJECT.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="h-full bg-foreground" style={{ width: `${CUSTOMER_PROJECT.progress}%` }} />
            </div>
          </div>
        </section>

        {/* ② 탭 메뉴 */}
        <div className="relative mb-4">
          <NumBadge n={2} />
          <div
            role="tablist"
            aria-label="프로젝트 조회 탭"
            className="flex overflow-x-auto rounded-md border border-foreground/40"
          >
            {CUSTOMER_TABS.map((t, i) => {
              const active = tab === t.key
              return (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={active}
                  disabled={isEmpty}
                  onClick={() => setTab(t.key)}
                  className={`flex-1 whitespace-nowrap border-r border-foreground/20 px-3 py-2 text-xs last:border-r-0 ${
                    isEmpty
                      ? "cursor-not-allowed text-muted-foreground/50"
                      : active
                        ? "bg-foreground font-semibold text-background"
                        : "bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  {t.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* 탭 콘텐츠 / 예외 처리 */}
        {isEmpty ? (
          <div className="rounded-md border border-dashed border-foreground/40 bg-muted/40 p-8 text-center">
            <div
              aria-hidden="true"
              className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-foreground/40 text-foreground"
            >
              !
            </div>
            <p className="text-sm font-medium text-foreground">아직 진행 중인 단계가 아닙니다</p>
            <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground text-pretty">
              문의만 등록된 상태입니다. 업체가 견적을 발행하면 견적·계약·공정·결제·사진 정보를 확인할 수 있습니다.
            </p>
            <div className="relative mt-4 inline-block">
              <NumBadge n={3} />
              <button
                type="button"
                className="rounded border border-foreground px-4 py-2 text-xs font-medium text-foreground hover:bg-muted"
              >
                내 문의 상태 확인
              </button>
            </div>
          </div>
        ) : (
          <div role="tabpanel">
            {tab === "quote" && <QuoteTab startNum={3} />}
            {tab === "contract" && <ContractTab />}
            {tab === "process" && <ProcessTab />}
            {tab === "payment" && <PaymentTab />}
            {tab === "photo" && <PhotoTab />}
          </div>
        )}
      </main>

      {/* 푸터: 상태 메시지 영역 */}
      <footer className="flex items-center justify-between border-t border-foreground/60 px-4 py-2 text-[11px] text-muted-foreground">
        <span>{isEmpty ? "상태: 견적 대기 중" : `상태: 조회 중 · 현재 탭 유지됨 (${hash})`}</span>
        <span className="tabular-nums">최종 동기화 2026-08-18 14:20</span>
      </footer>
    </div>
  )
}
