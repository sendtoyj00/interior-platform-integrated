"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowRight } from "lucide-react"
import type { ScreenMeta } from "@/lib/screen-registry"
import { getScreenByScrId } from "@/lib/screen-registry"
import { ROLE_LABEL, CATEGORY_LABEL } from "@/lib/roles"

export function ScreenPageChrome({
  meta,
  controls,
  children,
}: {
  meta: ScreenMeta
  controls?: ReactNode
  children: ReactNode
}) {
  const relatedResolved = meta.related
    .map((scrId) => getScreenByScrId(scrId))
    .filter((s): s is ScreenMeta => Boolean(s))

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-foreground">
          <span>메뉴 경로: {meta.screenPath}</span>
          <span className="border border-foreground/50 bg-background px-1.5 py-0.5 font-bold text-foreground">화면 명칭: {meta.title}</span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="rounded border border-foreground bg-foreground px-2 py-0.5 font-mono text-[11px] font-bold text-background">
            {meta.scrId}
          </span>
          <span className="rounded border border-foreground/30 px-2 py-0.5 text-[11px] text-muted-foreground">
            {CATEGORY_LABEL[meta.category]}
          </span>
          <span className="rounded border border-dashed border-foreground/30 px-2 py-0.5 text-[11px] text-muted-foreground">
            {meta.reqId}
          </span>
          {meta.roles.map((r) => (
            <span
              key={r}
              className="rounded border border-foreground/20 bg-muted px-2 py-0.5 text-[11px] text-foreground"
            >
              {ROLE_LABEL[r]}
            </span>
          ))}
        </div>
        <h1 className="mt-2 text-lg font-bold text-foreground text-balance">{meta.title}</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground text-pretty">{meta.summary}</p>
      </div>

      {controls && (
        <div className="rounded-md border border-dashed border-foreground/30 bg-background p-3">{controls}</div>
      )}

      {children}

      {relatedResolved.length > 0 && (
        <div className="rounded-md border border-foreground/15 bg-background p-4">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            관련 화면 바로가기 (이동 화면 제안)
          </p>
          <div className="flex flex-wrap gap-2">
            {relatedResolved.map((s) => (
              <Link
                key={s.slug}
                href={`/screens/${s.slug}`}
                className="flex items-center gap-1.5 rounded border border-foreground/30 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
              >
                {s.scrId} · {s.title}
                <ArrowRight className="h-3 w-3" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
