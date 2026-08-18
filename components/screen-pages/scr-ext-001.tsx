"use client"

import { ScreenPageChrome } from "@/components/frame/screen-page-chrome"
import { DualDevicePreview } from "@/components/frame/device-preview"
import { ClassifyScreen } from "@/components/blocks/platform/classify-screen"
import { getScreenBySlug } from "@/lib/screen-registry"

const meta = getScreenBySlug("scr-ext-001")!

export default function ScrExt001Page() {
  return (
    <ScreenPageChrome meta={meta}>
      <DualDevicePreview renderScreen={(mode) => <ClassifyScreen variant={mode} />} />
    </ScreenPageChrome>
  )
}
