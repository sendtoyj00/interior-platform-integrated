"use client"

import { ScreenPageChrome } from "@/components/frame/screen-page-chrome"
import { DualDevicePreview } from "@/components/frame/device-preview"
import { StaffScreen } from "@/components/blocks/admin/staff-screen"
import { getScreenBySlug } from "@/lib/screen-registry"

const meta = getScreenBySlug("scr-comp-002")!

export default function ScrComp002Page() {
  return (
    <ScreenPageChrome meta={meta}>
      <DualDevicePreview renderScreen={(mode) => <StaffScreen mode={mode} />} />
    </ScreenPageChrome>
  )
}
