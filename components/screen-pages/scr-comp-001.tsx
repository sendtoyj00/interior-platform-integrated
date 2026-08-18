"use client"

import { ScreenPageChrome } from "@/components/frame/screen-page-chrome"
import { DualDevicePreview } from "@/components/frame/device-preview"
import { VettingScreen } from "@/components/blocks/admin/vetting-screen"
import { getScreenBySlug } from "@/lib/screen-registry"

const meta = getScreenBySlug("scr-comp-001")!

export default function ScrComp001Page() {
  return (
    <ScreenPageChrome meta={meta}>
      <DualDevicePreview renderScreen={(mode) => <VettingScreen mode={mode} />} />
    </ScreenPageChrome>
  )
}
