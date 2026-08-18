"use client"

import { ScreenPageChrome } from "@/components/frame/screen-page-chrome"
import { DualDevicePreview } from "@/components/frame/device-preview"
import { ContractScreen } from "@/components/blocks/dealflow/contract-screen"
import { getScreenBySlug } from "@/lib/screen-registry"

const meta = getScreenBySlug("scr-cont-001")!

export default function ScrCont001Page() {
  return (
    <ScreenPageChrome meta={meta}>
      <DualDevicePreview renderScreen={(mode) => <ContractScreen variant={mode} />} />
    </ScreenPageChrome>
  )
}
