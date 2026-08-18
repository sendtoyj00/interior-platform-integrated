"use client"

import { ScreenPageChrome } from "@/components/frame/screen-page-chrome"
import { DesktopPreview, MobilePreview } from "@/components/frame/device-preview"
import { QuoteEditor } from "@/components/blocks/inquiry/quote-editor"
import { getScreenBySlug } from "@/lib/screen-registry"

const meta = getScreenBySlug("scr-quote-001")!

export default function ScrQuote001Page() {
  return (
    <ScreenPageChrome meta={meta}>
      <div className="flex flex-col items-start gap-8 xl:flex-row xl:flex-wrap">
        <section>
          <FrameLabel title="DESKTOP" spec="1920 × 1080" />
          <DesktopPreview>
            <QuoteEditor />
          </DesktopPreview>
        </section>
        <section>
          <FrameLabel title="MOBILE" spec="360 × 800" />
          <MobilePreview>
            <QuoteEditor />
          </MobilePreview>
        </section>
      </div>
    </ScreenPageChrome>
  )
}

function FrameLabel({ title, spec }: { title: string; spec: string }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span className="rounded border border-foreground bg-foreground px-2 py-0.5 text-[11px] font-bold text-background">
        {title}
      </span>
      <span className="font-mono text-[11px] text-muted-foreground">{spec}</span>
    </div>
  )
}
