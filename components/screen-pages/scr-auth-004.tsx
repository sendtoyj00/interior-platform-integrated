"use client"

import { useState } from "react"
import { ScreenPageChrome } from "@/components/frame/screen-page-chrome"
import { DualDevicePreview } from "@/components/frame/device-preview"
import { PasswordResetFlow } from "@/components/blocks/auth/password-reset-flow"
import { getScreenBySlug } from "@/lib/screen-registry"
import { useRole } from "@/components/shell/role-context"
import { ROLE_LABEL } from "@/lib/roles"

const meta = getScreenBySlug("scr-auth-004")!

export default function ScrAuth004Page() {
  const { session } = useRole()
  const [loggedIn, setLoggedIn] = useState(Boolean(session))

  return (
    <ScreenPageChrome
      meta={meta}
      controls={
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-foreground">진입 경로 시뮬레이션</span>
          <div className="flex overflow-hidden rounded border border-foreground/40 text-xs">
            <button
              type="button"
              onClick={() => setLoggedIn(false)}
              className={`px-3 py-1 ${!loggedIn ? "bg-foreground text-background" : "bg-background text-foreground"}`}
            >
              비로그인 · 비밀번호 찾기
            </button>
            <button
              type="button"
              onClick={() => setLoggedIn(true)}
              className={`border-l border-foreground/40 px-3 py-1 ${loggedIn ? "bg-foreground text-background" : "bg-background text-foreground"}`}
            >
              로그인 상태 · 비밀번호 변경
            </button>
          </div>
          {session && (
            <span className="text-[11px] text-muted-foreground">
              (현재 세션: {session.name} · {ROLE_LABEL[session.role]})
            </span>
          )}
        </div>
      }
    >
      <DualDevicePreview
        renderScreen={(mode) => (
          <PasswordResetFlow mode={mode} loggedIn={loggedIn} userName={session?.name ?? "홍길동"} />
        )}
      />
    </ScreenPageChrome>
  )
}
