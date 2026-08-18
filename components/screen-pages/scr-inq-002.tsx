"use client"

import { ScreenPageChrome } from "@/components/frame/screen-page-chrome"
import { DualDevicePreview } from "@/components/frame/device-preview"
import { InquiryManage } from "@/components/blocks/inquiry/inquiry-manage"
import { getScreenBySlug } from "@/lib/screen-registry"

const meta = getScreenBySlug("scr-inq-002")!

export default function ScrInq002Page() {
  return (
    <ScreenPageChrome meta={meta}>
      <div className="mb-1 rounded-md border border-dashed border-foreground/30 bg-background p-3 text-[11px] text-muted-foreground">
        상세 패널에서 상태를 &quot;견적발송&quot;으로 변경하며 &quot;견적서 작성하기&quot;를 선택하면 실제로
        SCR-QUOTE-001 견적서 작성 화면으로 이동합니다.
      </div>
      <DualDevicePreview renderScreen={(mode) => <InquiryManage mode={mode} />} />
    </ScreenPageChrome>
  )
}
