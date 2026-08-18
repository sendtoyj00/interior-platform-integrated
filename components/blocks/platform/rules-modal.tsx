"use client"

import { useState } from "react"
import { NumBadge } from "./num-badge"
import type { ClassifyRule } from "@/lib/blocks/platform/mock-data"

export function RulesModal({
  rules,
  onAdd,
  onDelete,
  onClose,
}: {
  rules: ClassifyRule[]
  onAdd: (r: { keyword: string; tag: string; type: "공간유형" | "예산대" }) => void
  onDelete: (id: string) => void
  onClose: () => void
}) {
  const [keyword, setKeyword] = useState("")
  const [tag, setTag] = useState("")
  const [type, setType] = useState<"공간유형" | "예산대">("공간유형")

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="분류 규칙 관리"
        className="relative flex max-h-full w-full max-w-lg flex-col rounded-md border border-foreground bg-card shadow-lg"
      >
        <div className="flex items-center justify-between border-b border-foreground/20 px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">분류 규칙 관리</h3>
            <p className="text-[11px] text-muted-foreground">키워드 → 태그 매핑 (규칙 기반, AI 아님)</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-foreground"
            aria-label="닫기"
          >
            ✕ 닫기
          </button>
        </div>

        <div className="overflow-auto p-4">
          {/* 규칙 테이블 */}
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr className="border-b border-foreground/30 text-left text-muted-foreground">
                <th className="py-1.5 pr-2 font-medium">키워드</th>
                <th className="py-1.5 pr-2 font-medium">태그</th>
                <th className="py-1.5 pr-2 font-medium">구분</th>
                <th className="py-1.5 font-medium">삭제</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((r) => (
                <tr key={r.id} className="border-b border-foreground/10">
                  <td className="py-1.5 pr-2 text-foreground">{r.keyword}</td>
                  <td className="py-1.5 pr-2 text-foreground">{r.tag}</td>
                  <td className="py-1.5 pr-2 text-muted-foreground">{r.type}</td>
                  <td className="py-1.5">
                    <div className="relative inline-block">
                      <NumBadge n={13} />
                      <button
                        type="button"
                        onClick={() => onDelete(r.id)}
                        className="rounded border border-foreground/40 bg-background px-2 py-0.5 text-[10px] text-foreground hover:bg-muted"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 규칙 추가 폼 */}
          <div className="mt-4 rounded-md border border-dashed border-foreground/40 p-3">
            <div className="mb-2 text-[11px] font-semibold text-foreground">규칙 추가</div>
            <div className="flex flex-wrap items-end gap-2">
              <div className="relative">
                <NumBadge n={14} />
                <label className="mb-0.5 block text-[10px] text-muted-foreground">키워드</label>
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="예: 원룸, 오피스텔"
                  className="w-40 rounded border border-foreground/40 bg-background px-2 py-1 text-[11px] text-foreground outline-none focus:border-foreground"
                />
              </div>
              <div className="relative">
                <NumBadge n={15} />
                <label className="mb-0.5 block text-[10px] text-muted-foreground">태그</label>
                <input
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="예: 오피스텔"
                  className="w-28 rounded border border-foreground/40 bg-background px-2 py-1 text-[11px] text-foreground outline-none focus:border-foreground"
                />
              </div>
              <div className="relative">
                <NumBadge n={16} />
                <label className="mb-0.5 block text-[10px] text-muted-foreground">구분</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as "공간유형" | "예산대")}
                  className="rounded border border-foreground/40 bg-background px-2 py-1 text-[11px] text-foreground outline-none focus:border-foreground"
                >
                  <option value="공간유형">공간유형</option>
                  <option value="예산대">예산대</option>
                </select>
              </div>
              <div className="relative">
                <NumBadge n={17} />
                <button
                  type="button"
                  onClick={() => {
                    if (!keyword.trim() || !tag.trim()) return
                    onAdd({ keyword: keyword.trim(), tag: tag.trim(), type })
                    setKeyword("")
                    setTag("")
                  }}
                  className="rounded border border-foreground bg-foreground px-3 py-1 text-[11px] text-background hover:bg-foreground/85"
                >
                  추가
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
