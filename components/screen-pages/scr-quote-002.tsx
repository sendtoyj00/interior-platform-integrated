"use client"

import { useState } from "react"
import { ScreenPageChrome } from "@/components/frame/screen-page-chrome"
import { DualDevicePreview } from "@/components/frame/device-preview"
import { QuoteApprovalScreen } from "@/components/blocks/dealflow/quote-approval-screen"
import { getScreenBySlug } from "@/lib/screen-registry"
import type { Role } from "@/lib/blocks/dealflow/mock-data"

const meta = getScreenBySlug("scr-quote-002")!

export default function ScrQuote002Page() {
  const [role, setRole] = useState<Role>("customer")

  return (
    <ScreenPageChrome
      meta={meta}
      controls={
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-foreground">보기 모드</span>
          <div className="flex overflow-hidden rounded border border-foreground/40 text-xs">
            {(["customer", "admin"] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`px-3 py-1 first:border-none border-l border-foreground/40 ${
                  role === r ? "bg-foreground text-background" : "bg-background text-foreground"
                }`}
              >
                {r === "customer" ? "고객 (승인/거절)" : "업체 관리자 (읽기전용)"}
              </button>
            ))}
          </div>
        </div>
      }
    >
      <DualDevicePreview renderScreen={(mode) => <QuoteApprovalScreen variant={mode} role={role} />} />
    </ScreenPageChrome>
  )
}
