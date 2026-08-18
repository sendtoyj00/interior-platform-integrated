"use client"

import type React from "react"
import { WfNumber } from "./wf-badge"
import { formatKRW, type QuoteHistoryItem } from "@/lib/blocks/dealflow/mock-data"

function NumberedPanel({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <WfNumber n={n} className="w-full max-w-md">
      <div className="w-full rounded-md border-2 border-neutral-700 bg-white shadow-lg">{children}</div>
    </WfNumber>
  )
}

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-neutral-900/40 p-4">
      {children}
    </div>
  )
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-md rounded-md border-2 border-neutral-700 bg-white shadow-lg">
      {children}
    </div>
  )
}

/* 확인 모달 (승인) */
export function ConfirmModal({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <Overlay>
      <Panel>
        <div className="border-b border-dashed border-neutral-400 px-4 py-3">
          <h3 className="text-sm font-bold text-neutral-800">승인 확인</h3>
        </div>
        <div className="px-4 py-5">
          <p className="text-sm leading-relaxed text-neutral-700">
            견적을 승인하시겠습니까?
            <br />
            승인 후에는 계약이 진행됩니다.
          </p>
        </div>
        <div className="flex justify-end gap-2 border-t border-dashed border-neutral-400 px-4 py-3">
          <button
            onClick={onCancel}
            className="rounded border border-neutral-400 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="rounded border border-neutral-800 bg-neutral-800 px-3 py-1.5 text-sm text-white hover:bg-neutral-900"
          >
            확인
          </button>
        </div>
      </Panel>
    </Overlay>
  )
}

/* 거절 사유 입력 모달 */
export function RejectModal({
  reason,
  onChange,
  onCancel,
  onConfirm,
}: {
  reason: string
  onChange: (v: string) => void
  onCancel: () => void
  onConfirm: () => void
}) {
  const disabled = reason.trim().length === 0
  return (
    <Overlay>
      <NumberedPanel n={4}>
        <div className="border-b border-dashed border-neutral-400 px-4 py-3">
          <h3 className="text-sm font-bold text-neutral-800">거절 사유 입력</h3>
        </div>
        <div className="px-4 py-4">
          <label className="mb-1 block text-xs text-neutral-600">
            거절 사유 <span className="text-neutral-800">(필수)</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            placeholder="견적을 거절하는 사유를 입력하세요"
            className="w-full resize-none rounded border border-neutral-400 bg-neutral-50 px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-700 focus:outline-none"
          />
          {disabled && (
            <p className="mt-1 text-xs text-neutral-500">* 사유 미입력 시 거절 확정이 불가합니다.</p>
          )}
        </div>
        <div className="flex justify-end gap-2 border-t border-dashed border-neutral-400 px-4 py-3">
          <button
            onClick={onCancel}
            className="rounded border border-neutral-400 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={disabled}
            className="rounded border border-neutral-800 bg-neutral-800 px-3 py-1.5 text-sm text-white enabled:hover:bg-neutral-900 disabled:cursor-not-allowed disabled:border-neutral-300 disabled:bg-neutral-200 disabled:text-neutral-400"
          >
            거절 확정
          </button>
        </div>
      </NumberedPanel>
    </Overlay>
  )
}

/* 수정이력 상세 팝업 */
export function HistoryDetailModal({
  item,
  onClose,
}: {
  item: QuoteHistoryItem
  onClose: () => void
}) {
  return (
    <Overlay>
      <div className="w-full max-w-lg rounded-md border-2 border-neutral-700 bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-dashed border-neutral-400 px-4 py-3">
          <h3 className="text-sm font-bold text-neutral-800">
            견적 상세 · {item.version} <span className="font-normal text-neutral-500">({item.updatedAt})</span>
          </h3>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="rounded border border-neutral-400 px-2 text-sm text-neutral-600 hover:bg-neutral-100"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[60vh] overflow-auto px-4 py-4">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-400 text-neutral-600">
                <th className="py-1.5 pr-2 font-medium">항목</th>
                <th className="py-1.5 pr-2 font-medium">수량</th>
                <th className="py-1.5 text-right font-medium">금액</th>
              </tr>
            </thead>
            <tbody>
              {item.items.map((li) => (
                <tr key={li.id} className="border-b border-dashed border-neutral-300 text-neutral-800">
                  <td className="py-1.5 pr-2">{li.name}</td>
                  <td className="py-1.5 pr-2">{li.qty}</td>
                  <td className="py-1.5 text-right">{formatKRW(li.qty * li.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold text-neutral-900">
                <td className="py-2" colSpan={2}>
                  합계
                </td>
                <td className="py-2 text-right">{formatKRW(item.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </Overlay>
  )
}

/* 토스트 */
export function Toast({ message }: { message: string }) {
  return (
    <div className="pointer-events-none absolute bottom-14 left-1/2 z-40 -translate-x-1/2">
      <WfNumber n={6}>
        <div className="rounded border border-neutral-700 bg-neutral-800 px-4 py-2 text-xs text-white shadow-lg">
          {message}
        </div>
      </WfNumber>
    </div>
  )
}
