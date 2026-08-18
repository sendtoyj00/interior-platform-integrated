import type React from "react"
import { cn } from "@/lib/utils"

const CIRCLED = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"] as const

export function circled(n: number): string {
  return CIRCLED[n - 1] ?? `(${n})`
}

/**
 * Wraps an interactive element and pins a small circled number to its top-left.
 */
export function WfNumber({
  n,
  children,
  className,
}: {
  n: number
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("relative", className)}>
      <span
        aria-hidden="true"
        className="absolute -left-2 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-neutral-500 bg-white text-[11px] leading-none text-neutral-700 shadow-sm"
      >
        {circled(n)}
      </span>
      {children}
    </div>
  )
}
