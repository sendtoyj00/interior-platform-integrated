"use client"

import { useState } from "react"
import { ScreenPageChrome } from "@/components/frame/screen-page-chrome"
import { DualDevicePreview } from "@/components/frame/device-preview"
import { PhotoApp } from "@/components/blocks/ops/photo-app"
import { getScreenBySlug } from "@/lib/screen-registry"

const meta = getScreenBySlug("scr-proc-002")!

export default function ScrProc002Page() {
  const [mode, setMode] = useState<"A" | "B">("A")

  return (
    <ScreenPageChrome
      meta={meta}
      controls={
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-foreground">모드 전환</span>
          <div className="flex overflow-hidden rounded border border-foreground/40 text-xs">
            <button
              type="button"
              onClick={() => setMode("A")}
              className={`px-3 py-1 ${mode === "A" ? "bg-foreground text-background" : "bg-background text-foreground"}`}
            >
              모드 A · 현장담당자 업로드
            </button>
            <button
              type="button"
              onClick={() => setMode("B")}
              className={`border-l border-foreground/40 px-3 py-1 ${mode === "B" ? "bg-foreground text-background" : "bg-background text-foreground"}`}
            >
              모드 B · 고객 갤러리
            </button>
          </div>
        </div>
      }
    >
      <DualDevicePreview renderScreen={(device) => <PhotoApp device={device} mode={mode} />} />
    </ScreenPageChrome>
  )
}
