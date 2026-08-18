"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { CATEGORY_LABEL, CATEGORY_ORDER, ROLE_LABEL, type RoleKey } from "@/lib/roles"
import { SCREENS } from "@/lib/screen-registry"
import { useRole } from "./role-context"
import { cn } from "@/lib/utils"

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { viewRole } = useRole()
  const [onlyMine, setOnlyMine] = useState(false)

  return (
    <nav aria-label="전체 화면 메뉴" className="flex h-full flex-col text-sm">
      <div className="border-b border-foreground/15 px-4 py-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Screen Design Doc</p>
        <p className="mt-0.5 text-sm font-bold text-foreground text-balance">인테리어 견적·시공관리 플랫폼</p>
        <p className="mt-1 text-[11px] text-muted-foreground">화면 설계서 통합 프리뷰 · 전체 20개 화면</p>
      </div>

      <label className="flex cursor-pointer items-center gap-2 border-b border-foreground/15 px-4 py-2.5 text-[11px] text-muted-foreground">
        <input
          type="checkbox"
          checked={onlyMine}
          onChange={(e) => setOnlyMine(e.target.checked)}
          className="h-3.5 w-3.5 accent-foreground"
        />
        현재 역할({ROLE_LABEL[viewRole]})의 화면만 보기
      </label>

      <div className="flex-1 overflow-y-auto px-2 py-3">
        {CATEGORY_ORDER.map((cat) => {
          const items = SCREENS.filter((s) => s.category === cat).filter(
            (s) => !onlyMine || s.roles.includes(viewRole),
          )
          if (items.length === 0) return null
          return (
            <div key={cat} className="mb-3">
              <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                {CATEGORY_LABEL[cat]}
              </p>
              <ul className="flex flex-col gap-0.5">
                {items.map((s) => {
                  const href = `/screens/${s.slug}`
                  const active = pathname === href
                  const accessible = s.roles.includes(viewRole)
                  return (
                    <li key={s.slug}>
                      <Link
                        href={href}
                        onClick={onNavigate}
                        className={cn(
                          "flex items-start gap-2 rounded px-2 py-1.5 leading-tight transition-colors",
                          active
                            ? "bg-foreground text-background"
                            : "text-foreground hover:bg-muted",
                          !accessible && !active && "opacity-45",
                        )}
                      >
                        <span
                          className={cn(
                            "mt-0.5 shrink-0 font-mono text-[10px]",
                            active ? "text-background/70" : "text-muted-foreground",
                          )}
                        >
                          {s.scrId.replace("SCR-", "")}
                        </span>
                        <span className="text-xs font-medium">{s.title}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>

      <div className="border-t border-foreground/15 px-4 py-3">
        <Link
          href="/flow"
          onClick={onNavigate}
          className="block rounded border border-foreground/30 px-3 py-2 text-center text-[11px] font-semibold text-foreground hover:bg-muted"
        >
          화면 흐름도 보기 →
        </Link>
      </div>
    </nav>
  )
}
