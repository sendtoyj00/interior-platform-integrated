"use client"

import { ScreenPageChrome } from "@/components/frame/screen-page-chrome"
import { DualDevicePreview } from "@/components/frame/device-preview"
import { PaymentApp } from "@/components/blocks/ops/payment-app"
import { getScreenBySlug } from "@/lib/screen-registry"

const meta = getScreenBySlug("scr-pay-001")!

export default function ScrPay001Page() {
  return (
    <ScreenPageChrome meta={meta}>
      <DualDevicePreview renderScreen={(device) => <PaymentApp device={device} />} />
    </ScreenPageChrome>
  )
}
