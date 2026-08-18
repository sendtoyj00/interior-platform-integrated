"use client"

import { ScreenPageChrome } from "@/components/frame/screen-page-chrome"
import { DualDevicePreview } from "@/components/frame/device-preview"
import { CustomerSignupFlow } from "@/components/blocks/auth/customer-signup-flow"
import { getScreenBySlug } from "@/lib/screen-registry"

const meta = getScreenBySlug("scr-auth-002")!

export default function ScrAuth002Page() {
  return (
    <ScreenPageChrome meta={meta}>
      <DualDevicePreview renderScreen={(mode) => <CustomerSignupFlow mode={mode} />} />
    </ScreenPageChrome>
  )
}
