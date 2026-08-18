"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, LogOut, ChevronDown } from "lucide-react"
import { ROLE_LABEL, ROLE_ORDER, ROLE_HOME_SLUG, type RoleKey } from "@/lib/roles"
import { useRole } from "./role-context"
import { useRouter } from "next/navigation"

export function AppHeader({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { session, viewRole, setViewRole, logout } = useRole()
  const [roleMenuOpen, setRoleMenuOpen] = useState(false)
  const [logoutConfirm, setLogoutConfirm] = useState(false)
  const router = useRouter()

  function handleRoleSelect(role: RoleKey) {
    setViewRole(role)
    setRoleMenuOpen(false)
    if (role !== "guest") {
      router.push(`/screens/${ROLE_HOME_SLUG[role]}`)
    } else {
      router.push("/screens/scr-auth-003")
    }
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-foreground/15 bg-background px-4">
      <button
        type="button"
        onClick={onToggleSidebar}
        className="flex h-8 w-8 items-center justify-center rounded border border-foreground/30 text-foreground lg:hidden"
        aria-label="메뉴 열기/닫기"
      >
        <Menu className="h-4 w-4" />
      </button>

      <Link href="/" className="flex items-center gap-2">
        <span className="flex h-7 items-center rounded border border-foreground bg-foreground px-2 text-[11px] font-bold text-background">
          IMS
        </span>
        <span className="hidden text-sm font-bold text-foreground sm:inline">
          인테리어 견적·시공관리 플랫폼
        </span>
      </Link>

      <span className="hidden rounded border border-dashed border-foreground/30 px-2 py-0.5 text-[10px] text-muted-foreground md:inline">
        GRAYSCALE WIREFRAME · 통합 프리뷰
      </span>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setRoleMenuOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded border border-foreground/30 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            {session ? `${session.name} · ${ROLE_LABEL[session.role]}` : `보기 역할: ${ROLE_LABEL[viewRole]}`}
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          {roleMenuOpen && (
            <div className="absolute right-0 top-[calc(100%+4px)] z-50 w-56 rounded border border-foreground/20 bg-background p-1 shadow-lg">
              <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                역할 전환 (데모용)
              </p>
              {ROLE_ORDER.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleSelect(r)}
                  className={`block w-full rounded px-2 py-1.5 text-left text-xs hover:bg-muted ${
                    viewRole === r ? "bg-muted font-semibold text-foreground" : "text-foreground/80"
                  }`}
                >
                  {ROLE_LABEL[r]}
                </button>
              ))}
            </div>
          )}
        </div>

        {session && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setLogoutConfirm(true)}
              className="flex h-8 w-8 items-center justify-center rounded border border-foreground/30 text-foreground hover:bg-muted"
              aria-label="로그아웃"
              title="로그아웃"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
            {logoutConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4">
                <div className="w-full max-w-[300px] rounded border-2 border-foreground bg-background p-4 shadow-lg">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-foreground">로그아웃 하시겠습니까?</h3>
                    <button onClick={() => setLogoutConfirm(false)} aria-label="닫기" className="text-muted-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mb-4 text-[11px] text-muted-foreground">토큰이 폐기되고 로그인 화면으로 이동합니다.</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLogoutConfirm(false)}
                      className="flex-1 rounded border border-foreground/30 px-3 py-2 text-xs font-medium text-foreground"
                    >
                      취소
                    </button>
                    <button
                      onClick={() => {
                        logout()
                        setLogoutConfirm(false)
                        router.push("/screens/scr-auth-003")
                      }}
                      className="flex-1 rounded border border-foreground bg-foreground px-3 py-2 text-xs font-semibold text-background"
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
