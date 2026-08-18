"use client"

import { useState, type ReactNode } from "react"
import { X } from "lucide-react"
import { AppHeader } from "./app-header"
import { AppSidebar } from "./app-sidebar"
import { AppFooter } from "./app-footer"
import { RoleProvider } from "./role-context"

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <RoleProvider>
      <div className="flex min-h-screen flex-col bg-muted/30">
        <AppHeader onToggleSidebar={() => setMobileNavOpen((v) => !v)} />

        <div className="mx-auto flex w-full max-w-[1600px] flex-1">
          {/* 데스크톱: 고정 사이드바 */}
          <aside className="hidden w-72 shrink-0 border-r border-foreground/15 bg-background lg:block">
            <div className="sticky top-14 h-[calc(100vh-3.5rem)]">
              <AppSidebar />
            </div>
          </aside>

          {/* 모바일: 드로어 사이드바 */}
          {mobileNavOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-foreground/30" onClick={() => setMobileNavOpen(false)} />
              <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-background shadow-xl">
                <div className="flex items-center justify-end p-2">
                  <button
                    onClick={() => setMobileNavOpen(false)}
                    aria-label="메뉴 닫기"
                    className="flex h-8 w-8 items-center justify-center rounded border border-foreground/30"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <AppSidebar onNavigate={() => setMobileNavOpen(false)} />
              </div>
            </div>
          )}

          <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>

        <AppFooter />
      </div>
    </RoleProvider>
  )
}
