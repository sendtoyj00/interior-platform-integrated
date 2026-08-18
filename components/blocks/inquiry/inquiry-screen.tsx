"use client"

import { InquiryForm } from "./inquiry-form"
import { CUSTOMER_MENU, MENU_LABEL } from "@/lib/menu-labels"

const MENU = CUSTOMER_MENU.map((label) => ({
  label,
  code: label === MENU_LABEL.inquiry ? "SCR-INQ-001" : `MENU-${label}`,
  active: label === MENU_LABEL.inquiry,
}))

export function InquiryScreen({ mode }: { mode: "desktop" | "mobile" }) {
  const isMobile = mode === "mobile"

  return (
    <div className="flex h-full flex-col border border-foreground/60 bg-background">
      {/* Header: 로고 / 역할 표시 / 로그아웃 */}
      <header className="flex items-center justify-between border-b border-foreground/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-sm border border-foreground text-[10px] font-bold">
            LOGO
          </div>
          {!isMobile && <span className="text-sm font-bold">인테리어 플랫폼</span>}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full border border-foreground/50 px-2 py-1 text-muted-foreground">
            역할: 고객
          </span>
          <button className="rounded-sm border border-foreground/50 px-2 py-1 text-foreground">
            로그아웃
          </button>
        </div>
      </header>

      {/* Sidebar + Body */}
      <div className={`flex min-h-0 flex-1 ${isMobile ? "flex-col" : "flex-row"}`}>
        {/* Sidebar: 역할별 메뉴 */}
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
              고객 · 플랫폼 메뉴
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

        {/* Body: 콘텐츠 영역 */}
        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mb-5 border-b border-foreground/30 pb-3">
            <p className="text-[11px] text-muted-foreground">SCR-INQ-001</p>
            <h1 className="text-lg font-bold text-foreground">시공 문의 등록</h1>
            <p className="mt-1 text-xs text-muted-foreground text-pretty">
              업체를 선택하고 공간정보·예산·일정을 입력하여 시공 문의를 등록하세요.
            </p>
          </div>
          <InquiryForm idPrefix={mode} />
        </main>
      </div>

      {/* Footer: 상태 메시지 영역 */}
      <footer className="flex items-center justify-between border-t border-foreground/60 px-4 py-2 text-[11px] text-muted-foreground">
        <span>상태: 입력 대기 중</span>
        <span>ⓘ 필수 항목(*)을 모두 입력해야 등록됩니다</span>
      </footer>
    </div>
  )
}
