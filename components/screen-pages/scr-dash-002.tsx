"use client"

import { useState } from "react"
import { ScreenPageChrome } from "@/components/frame/screen-page-chrome"
import { DualDevicePreview } from "@/components/frame/device-preview"
import { MyPageScreen } from "@/components/blocks/platform/mypage-screen"
import { getScreenBySlug } from "@/lib/screen-registry"

const meta = getScreenBySlug("scr-dash-002")!

export default function ScrDash002Page() {
  const [empty, setEmpty] = useState(false)

  return (
    <ScreenPageChrome
      meta={meta}
      controls={
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium text-foreground">데모 상태</span>
          <div className="flex overflow-hidden rounded border border-foreground/40 text-xs">
            <button
              type="button"
              onClick={() => setEmpty(false)}
              className={`px-3 py-1 ${!empty ? "bg-foreground text-background" : "bg-background text-foreground"}`}
            >
              견적 이후 진행 중
            </button>
            <button
              type="button"
              onClick={() => setEmpty(true)}
              className={`border-l border-foreground/40 px-3 py-1 ${empty ? "bg-foreground text-background" : "bg-background text-foreground"}`}
            >
              문의만 등록(빈 상태)
            </button>
          </div>
          <span className="text-[11px] text-muted-foreground">
            견적/계약/공정/결제/사진 탭 — SCR-QUOTE-002·SCR-CONT-001·SCR-PROC-001·SCR-PAY-002·SCR-PROC-002 내용을 임베드
          </span>
        </div>
      }
    >
      <DualDevicePreview renderScreen={(mode) => <MyPageScreen variant={mode} isEmpty={empty} />} />
    </ScreenPageChrome>
  )
}
