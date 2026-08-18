"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ScreenPageChrome } from "@/components/frame/screen-page-chrome"
import { DualDevicePreview } from "@/components/frame/device-preview"
import { DashboardScreen } from "@/components/blocks/platform/dashboard-screen"
import { getScreenBySlug } from "@/lib/screen-registry"

const meta = getScreenBySlug("scr-dash-001")!

export default function ScrDash001Page() {
  const router = useRouter()
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
              진행중 프로젝트 있음
            </button>
            <button
              type="button"
              onClick={() => setEmpty(true)}
              className={`border-l border-foreground/40 px-3 py-1 ${empty ? "bg-foreground text-background" : "bg-background text-foreground"}`}
            >
              신규 업체 (빈 상태)
            </button>
          </div>
          <span className="text-[11px] text-muted-foreground">
            차트 구간 클릭 → 리스트 필터 · 리스트 행 클릭 → 공정관리로 실제 이동 · 빈 상태 버튼 → 문의관리로 실제 이동
          </span>
        </div>
      }
    >
      <DualDevicePreview
        renderScreen={(mode) => (
          <DashboardScreen
            variant={mode}
            isEmpty={empty}
            onNavigateToProcess={() => router.push("/screens/scr-proc-001")}
            onNavigateToInquiries={() => router.push("/screens/scr-inq-002")}
          />
        )}
      />
    </ScreenPageChrome>
  )
}
