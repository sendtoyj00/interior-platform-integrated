"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import type { RoleKey } from "@/lib/roles"

interface Session {
  name: string
  role: RoleKey
}

interface RoleContextValue {
  session: Session | null
  /** 사이드바 필터링에 사용하는 "보기 기준" 역할. 로그인하지 않아도 자유롭게 전환 가능(데모 목적) */
  viewRole: RoleKey
  setViewRole: (role: RoleKey) => void
  login: (session: Session) => void
  logout: () => void
}

const RoleContext = createContext<RoleContextValue | null>(null)

export function RoleProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [viewRole, setViewRole] = useState<RoleKey>("guest")

  const value = useMemo<RoleContextValue>(
    () => ({
      session,
      viewRole,
      setViewRole,
      login: (s) => {
        setSession(s)
        setViewRole(s.role)
      },
      logout: () => {
        setSession(null)
        setViewRole("guest")
      },
    }),
    [session, viewRole],
  )

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
}

export function useRole() {
  const ctx = useContext(RoleContext)
  if (!ctx) throw new Error("useRole must be used within RoleProvider")
  return ctx
}
