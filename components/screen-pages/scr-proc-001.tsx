"use client"

import { ScreenPageChrome } from "@/components/frame/screen-page-chrome"
import { DualDevicePreview } from "@/components/frame/device-preview"
import { ProcessScreen } from "@/components/blocks/dealflow/process-screen"
import { getScreenBySlug } from "@/lib/screen-registry"

const meta = getScreenBySlug("scr-proc-001")!

export default function ScrProc001Page() {
  return (
    <ScreenPageChrome meta={meta}>
      <DualDevicePreview renderScreen={(mode) => <ProcessScreen variant={mode} />} />
    </ScreenPageChrome>
  )
}
