"use client"

import { useState } from "react"
import { ScreenPageChrome } from "@/components/frame/screen-page-chrome"
import { DualDevicePreview } from "@/components/frame/device-preview"
import { NotificationApp } from "@/components/blocks/ops/notification-app"
import { getScreenBySlug } from "@/lib/screen-registry"

const meta = getScreenBySlug("scr-noti-001")!

export default function ScrNoti001Page() {
  const [empty, setEmpty] = useState(false)

  return (
    <ScreenPageChrome
      meta={meta}
      controls={
        <label className="flex cursor-pointer items-center gap-2 text-xs text-foreground">
          <input
            type="checkbox"
            checked={empty}
            onChange={(e) => setEmpty(e.target.checked)}
            className="h-3.5 w-3.5 accent-foreground"
          />
          빈 상태(Empty State) 보기 — 발송 이력 없음
        </label>
      }
    >
      <DualDevicePreview renderScreen={(device) => <NotificationApp device={device} emptyState={empty} />} />
    </ScreenPageChrome>
  )
}
