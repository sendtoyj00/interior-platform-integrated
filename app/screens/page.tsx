"use client"

import Link from "next/link"
import { useState } from "react"
import { SCREENS } from "@/lib/screen-registry"
import { CATEGORY_LABEL, CATEGORY_ORDER, ROLE_LABEL, ROLE_ORDER, type RoleKey } from "@/lib/roles"

export default function ScreensIndexPage() {
  const [roleFilter, setRoleFilter] = useState<RoleKey | "all">("all")
  const [query, setQuery] = useState("")

  const filtered = SCREENS.filter((s) => {
    if (roleFilter !== "all" && !s.roles.includes(roleFilter)) return false
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      return (
        s.scrId.toLowerCase().includes(q) ||
        s.title.toLowerCase().includes(q) ||
        s.reqId.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="font-mono text-[11px] text-muted-foreground">메인 &gt; 전체 화면 목록</p>
        <h1 className="mt-1 text-lg font-bold text-foreground">전체 화면 목록 (20개)</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          요구사항 정의서 v1.1 7장 관련 화면(SCR-*) 커버리지 점검표와 일치하는 전체 20개 화면입니다.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-md border border-foreground/15 bg-background p-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SCR ID · 화면명 · 요구사항 ID 검색"
          className="w-full max-w-xs rounded border border-foreground/30 bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
        />
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setRoleFilter("all")}
            className={`rounded border px-2.5 py-1 text-[11px] ${
              roleFilter === "all" ? "border-foreground bg-foreground text-background" : "border-foreground/30 text-foreground"
            }`}
          >
            전체
          </button>
          {ROLE_ORDER.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`rounded border px-2.5 py-1 text-[11px] ${
                roleFilter === r ? "border-foreground bg-foreground text-background" : "border-foreground/30 text-foreground"
              }`}
            >
              {ROLE_LABEL[r]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {CATEGORY_ORDER.map((cat) => {
          const items = filtered.filter((s) => s.category === cat)
          if (items.length === 0) return null
          return (
            <section key={cat}>
              <h2 className="mb-2 text-sm font-bold text-foreground">
                {CATEGORY_LABEL[cat]}
                <span className="ml-2 text-xs font-normal text-muted-foreground">{items.length}개</span>
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/screens/${s.slug}`}
                    className="group flex flex-col gap-1 rounded-md border border-foreground/15 bg-background p-4 transition-colors hover:border-foreground"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-muted-foreground">{s.scrId}</span>
                      <span className="rounded border border-foreground/20 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        {s.reqId}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-foreground group-hover:underline">{s.title}</p>
                    <p className="line-clamp-2 text-[11px] text-muted-foreground">{s.summary}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {s.roles.map((r) => (
                        <span key={r} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-foreground">
                          {ROLE_LABEL[r]}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
        {filtered.length === 0 && (
          <p className="rounded-md border border-dashed border-foreground/30 p-6 text-center text-sm text-muted-foreground">
            조건에 맞는 화면이 없습니다.
          </p>
        )}
      </div>
    </div>
  )
}
