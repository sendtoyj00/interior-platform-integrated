"use client"

import { ScreenPageChrome } from "@/components/frame/screen-page-chrome"
import { DualDevicePreview } from "@/components/frame/device-preview"
import { RbacScreen } from "@/components/blocks/admin/rbac-screen"
import { getScreenBySlug } from "@/lib/screen-registry"

const meta = getScreenBySlug("scr-auth-005")!

export default function ScrAuth005Page() {
  return (
    <ScreenPageChrome meta={meta}>
      <DualDevicePreview renderScreen={(mode) => <RbacScreen mode={mode} />} />
    </ScreenPageChrome>
  )
}
