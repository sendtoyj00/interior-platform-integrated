"use client"

import { ScreenPageChrome } from "@/components/frame/screen-page-chrome"
import { DualDevicePreview } from "@/components/frame/device-preview"
import { InquiryScreen } from "@/components/blocks/inquiry/inquiry-screen"
import { getScreenBySlug } from "@/lib/screen-registry"

const meta = getScreenBySlug("scr-inq-001")!

export default function ScrInq001Page() {
  return (
    <ScreenPageChrome meta={meta}>
      <DualDevicePreview renderScreen={(mode) => <InquiryScreen mode={mode} />} />
    </ScreenPageChrome>
  )
}
