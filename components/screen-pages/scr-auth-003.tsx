"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ScreenPageChrome } from "@/components/frame/screen-page-chrome"
import { DualDevicePreview } from "@/components/frame/device-preview"
import { LoginFlow, type Session } from "@/components/blocks/auth/login-flow"
import { getScreenBySlug } from "@/lib/screen-registry"
import { useRole } from "@/components/shell/role-context"
import { ROLE_HOME_SLUG, type RoleKey } from "@/lib/roles"

const meta = getScreenBySlug("scr-auth-003")!

// 목업 계정의 role 문자열 → 전역 RoleKey 매핑
const ROLE_MAP: Record<string, RoleKey> = {
  company: "company_admin",
  field: "field_staff",
  customer: "customer",
  platform: "platform_admin",
}

export default function ScrAuth003Page() {
  const router = useRouter()
  const { login } = useRole()
  const [session, setSession] = useState<Session>(null)

  return (
    <ScreenPageChrome meta={meta}>
      <div className="mb-1 rounded-md border border-dashed border-foreground/30 bg-background p-3 text-[11px] text-muted-foreground">
        이 화면에서 목업 계정으로 로그인하면 실제로 해당 역할의 기본 화면(SCR-DASH-001 / SCR-PROC-001 /
        SCR-DASH-002 / SCR-COMP-001)으로 자동 이동합니다.
      </div>
      <DualDevicePreview
        renderScreen={(mode) => (
          <LoginFlow
            mode={mode}
            session={session}
            onLogin={(s) => {
              setSession(s)
              if (s) login({ name: s.name, role: ROLE_MAP[s.role] })
            }}
            onRouted={(route) => {
              const scrToSlug: Record<string, string> = {
                "SCR-DASH-001": ROLE_HOME_SLUG.company_admin,
                "SCR-PROC-001": ROLE_HOME_SLUG.field_staff,
                "SCR-DASH-002": ROLE_HOME_SLUG.customer,
                "SCR-COMP-001": ROLE_HOME_SLUG.platform_admin,
              }
              const slug = scrToSlug[route.scr]
              if (slug) {
                window.setTimeout(() => router.push(`/screens/${slug}`), 1200)
              }
            }}
          />
        )}
      />
    </ScreenPageChrome>
  )
}
