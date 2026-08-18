"use client"

import { useState } from "react"
import { ScreenPageChrome } from "@/components/frame/screen-page-chrome"
import { DualDevicePreview } from "@/components/frame/device-preview"
import { PaymentHistoryApp } from "@/components/blocks/ops/payment-history-app"
import { getScreenBySlug } from "@/lib/screen-registry"

const meta = getScreenBySlug("scr-pay-002")!

export default function ScrPay002Page() {
  const [embed, setEmbed] = useState<"customer" | "company">("customer")
  const [empty, setEmpty] = useState(false)

  return (
    <ScreenPageChrome
      meta={meta}
      controls={
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-foreground">임베드 컨텍스트</span>
            <div className="flex overflow-hidden rounded border border-foreground/40 text-xs">
              <button
                type="button"
                onClick={() => setEmbed("customer")}
                className={`px-3 py-1 ${embed === "customer" ? "bg-foreground text-background" : "bg-background text-foreground"}`}
              >
                고객 마이페이지
              </button>
              <button
                type="button"
                onClick={() => setEmbed("company")}
                className={`border-l border-foreground/40 px-3 py-1 ${embed === "company" ? "bg-foreground text-background" : "bg-background text-foreground"}`}
              >
                업체 대시보드
              </button>
            </div>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-xs text-foreground">
            <input
              type="checkbox"
              checked={empty}
              onChange={(e) => setEmpty(e.target.checked)}
              className="h-3.5 w-3.5 accent-foreground"
            />
            빈 상태(Empty State) 보기
          </label>
        </div>
      }
    >
      <DualDevicePreview renderScreen={(device) => <PaymentHistoryApp device={device} embed={embed} empty={empty} />} />
    </ScreenPageChrome>
  )
}
