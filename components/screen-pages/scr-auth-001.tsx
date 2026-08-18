"use client"

import { ScreenPageChrome } from "@/components/frame/screen-page-chrome"
import { DualDevicePreview } from "@/components/frame/device-preview"
import { SignupFlow } from "@/components/blocks/auth/signup-flow"
import { getScreenBySlug } from "@/lib/screen-registry"

const meta = getScreenBySlug("scr-auth-001")!

export default function ScrAuth001Page() {
  return (
    <ScreenPageChrome meta={meta}>
      <DualDevicePreview renderScreen={(mode) => <SignupFlow mode={mode} />} />
    </ScreenPageChrome>
  )
}
