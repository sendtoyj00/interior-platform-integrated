"use client"

import { useMemo, useState } from "react"
import {
  VENDORS,
  STATUS_LABEL,
  type Vendor,
  type VendorStatus,
} from "@/lib/blocks/admin/vetting-data"

/* ============================================================
   와이어프레임 공용 요소 (RBAC 화면과 동일 패턴)
   - 모든 상호작용 요소 좌상단에 ①②③... 번호 표시
   ============================================================ */

const CIRCLED = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩", "⑪", "⑫"]

function Num({ n }: { n: number }) {
  return (
    <span
      aria-hidden
      className="absolute left-0.5 top-0.5 z-10 select-none font-mono text-[11px] leading-none text-neutral-500"
    >
      {CIRCLED[n - 1]}
    </span>
  )
}

/* 상태 뱃지 (그레이스케일) */
function StatusBadge({ status }: { status: VendorStatus }) {
  const style: Record<VendorStatus, string> = {
    pending: "border-neutral-400 bg-white text-neutral-600",
    approved: "border-neutral-800 bg-neutral-800 text-white",
    rejected: "border-neutral-500 bg-neutral-200 text-neutral-700 line-through decoration-neutral-500",
  }
  return (
    <span
      className={[
        "inline-block whitespace-nowrap rounded border px-1.5 py-0.5 font-mono text-[11px] leading-none",
        style[status],
      ].join(" ")}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}

const FILTERS: { key: VendorStatus; label: string }[] = [
  { key: "pending", label: "승인대기" },
  { key: "approved", label: "승인완료" },
  { key: "rejected", label: "반려" },
]

/* ============================================================
   메인 화면 (헤더 / 사이드바 / 바디 / 푸터)
   ============================================================ */

export function VettingScreen({ mode }: { mode: "desktop" | "mobile" }) {
  const isMobile = mode === "mobile"

  const [vendors, setVendors] = useState<Vendor[]>(() =>
    JSON.parse(JSON.stringify(VENDORS)),
  )
  const [filter, setFilter] = useState<VendorStatus>("pending")
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const [confirmApprove, setConfirmApprove] = useState(false)
  const [rejectModal, setRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [toast, setToast] = useState<{ msg: string; kind: "ok" | "err" } | null>(null)
  const [footerMsg, setFooterMsg] = useState("READY · 승인대기 목록 표시 중")

  const list = useMemo(
    () => vendors.filter((v) => v.status === filter),
    [vendors, filter],
  )
  const selected = vendors.find((v) => v.id === selectedId) || null
  const counts = useMemo(
    () => ({
      pending: vendors.filter((v) => v.status === "pending").length,
      approved: vendors.filter((v) => v.status === "approved").length,
      rejected: vendors.filter((v) => v.status === "rejected").length,
    }),
    [vendors],
  )

  function showToast(msg: string, kind: "ok" | "err") {
    setToast({ msg, kind })
    window.setTimeout(() => setToast(null), 3000)
  }

  function openDetail(id: string) {
    setSelectedId(id)
    setFooterMsg(`DETAIL · ${id} 상세 패널 열림`)
  }

  function closeDetail() {
    setSelectedId(null)
    setConfirmApprove(false)
    setRejectModal(false)
    setRejectReason("")
  }

  function doApprove() {
    if (!selected) return
    setVendors((prev) =>
      prev.map((v) =>
        v.id === selected.id
          ? {
              ...v,
              status: "approved",
              processedAt: nowStr(),
              processedBy: "admin@platform.co",
            }
          : v,
      ),
    )
    setConfirmApprove(false)
    setFooterMsg(`SAVED · ${selected.name} 승인완료 · 계정 활성화 · 알림 발송(SCR-NOTI-001)`)
    showToast(`${selected.name} 승인 완료 · 업체관리자에게 알림 발송(SCR-NOTI-001)`, "ok")
    // 승인 후 목록 유지: 상세는 계속 열어두되 처리완료 상태로 표시
  }

  function doReject() {
    if (!selected || rejectReason.trim().length === 0) return
    setVendors((prev) =>
      prev.map((v) =>
        v.id === selected.id
          ? {
              ...v,
              status: "rejected",
              processedAt: nowStr(),
              processedBy: "admin@platform.co",
              rejectReason: rejectReason.trim(),
            }
          : v,
      ),
    )
    setRejectModal(false)
    setRejectReason("")
    setFooterMsg(`SAVED · ${selected.name} 반려 처리 · 사유 영구 보관`)
    showToast(`${selected.name} 반려 처리 완료 · 사유가 이력에 보관되었습니다`, "err")
  }

  return (
    <div className="flex h-full flex-col bg-neutral-50 font-sans text-neutral-900">
      {/* ===== 헤더 ===== */}
      <header className="flex shrink-0 items-center justify-between border-b border-neutral-300 bg-white px-4 py-2.5">
        <div className="flex items-center gap-3">
          {isMobile && (
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="메뉴 열기"
              className="relative flex h-7 w-7 items-center justify-center border border-neutral-400"
            >
              <Num n={11} />
              <span className="flex flex-col gap-0.5">
                <span className="block h-px w-4 bg-neutral-700" />
                <span className="block h-px w-4 bg-neutral-700" />
                <span className="block h-px w-4 bg-neutral-700" />
              </span>
            </button>
          )}
          <div className="flex h-7 items-center border border-dashed border-neutral-400 px-2 font-mono text-xs text-neutral-600">
            [LOGO] 인테리어 플랫폼
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden font-mono text-[11px] text-neutral-500 sm:inline">ROLE</span>
          <span className="border border-neutral-400 bg-neutral-100 px-2 py-1 font-mono text-[11px] text-neutral-700">
            플랫폼관리자
          </span>
          <button
            type="button"
            className="relative border border-neutral-400 bg-white px-2 py-1 pl-5 text-xs text-neutral-700 hover:bg-neutral-100"
          >
            <Num n={10} />
            로그아웃
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* ===== 사이드바 ===== */}
        {!isMobile && <Sidebar />}
        {isMobile && drawerOpen && (
          <div className="absolute inset-0 z-30 flex">
            <div className="w-52 shrink-0 bg-white">
              <div className="flex items-center justify-between border-b border-neutral-300 px-3 py-2">
                <span className="font-mono text-[11px] text-neutral-500">MENU</span>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="border border-neutral-400 px-1.5 text-xs text-neutral-600"
                  aria-label="메뉴 닫기"
                >
                  ✕
                </button>
              </div>
              <Sidebar />
            </div>
            <button
              type="button"
              aria-label="닫기"
              onClick={() => setDrawerOpen(false)}
              className="flex-1 bg-neutral-900/30"
            />
          </div>
        )}

        {/* ===== 바디 ===== */}
        <main className="min-w-0 flex-1 overflow-auto p-4">
          <div className="mb-3">
            <h1 className="text-sm font-bold text-neutral-800">업체 가입 승인 관리</h1>
            <p className="font-mono text-[11px] text-neutral-500">SCR-VET-001 · REQ-NFR-002</p>
          </div>

          {/* ① 상태 필터 탭 */}
          <section className="relative mb-4 rounded border border-neutral-300 bg-white p-3">
            <Num n={1} />
            <p className="mb-2 font-mono text-[11px] text-neutral-500">상태 필터</p>
            <div className={isMobile ? "grid grid-cols-3 gap-2" : "flex flex-wrap gap-2"}>
              {FILTERS.map((f) => {
                const on = f.key === filter
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => {
                      setFilter(f.key)
                      setFooterMsg(`FILTER · ${f.label} 목록 표시 중`)
                    }}
                    className={[
                      "border px-3 py-1.5 text-xs transition-colors",
                      on
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-400 bg-white text-neutral-700 hover:bg-neutral-100",
                    ].join(" ")}
                  >
                    {f.label}
                    <span className="ml-1.5 font-mono text-[10px] opacity-70">
                      {counts[f.key]}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* 바디 본문: 목록 + 상세 패널 (데스크톱은 좌우, 모바일은 상세를 오버레이 드로어로) */}
          <div className={isMobile ? "block" : "flex gap-4"}>
            {/* ② 업체 목록 테이블 */}
            <section
              className={[
                "relative rounded border border-neutral-300 bg-white p-3",
                isMobile ? "" : selected ? "w-1/2 shrink-0" : "flex-1",
              ].join(" ")}
            >
              <Num n={2} />
              <p className="mb-2 font-mono text-[11px] text-neutral-500">
                업체 목록 · 행 클릭 시 상세 열림
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-300 font-mono text-[11px] text-neutral-500">
                      <th className="py-1.5 pr-2 font-normal">상호명</th>
                      {!selected && !isMobile && (
                        <th className="py-1.5 pr-2 font-normal">사업자등록번호</th>
                      )}
                      {!selected && !isMobile && (
                        <th className="py-1.5 pr-2 font-normal">담당자연락처</th>
                      )}
                      <th className="py-1.5 pr-2 font-normal">가입신청일</th>
                      <th className="py-1.5 pr-2 text-right font-normal">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center font-mono text-[11px] text-neutral-400">
                          해당 상태의 업체가 없습니다
                        </td>
                      </tr>
                    )}
                    {list.map((v) => {
                      const active = v.id === selectedId
                      return (
                        <tr
                          key={v.id}
                          onClick={() => openDetail(v.id)}
                          className={[
                            "cursor-pointer border-b border-neutral-200 last:border-0 hover:bg-neutral-100",
                            active ? "bg-neutral-100" : "",
                          ].join(" ")}
                        >
                          <td className="py-2 pr-2">
                            <span className="text-neutral-800">{v.name}</span>
                            <span className="block font-mono text-[10px] text-neutral-400">{v.id}</span>
                          </td>
                          {!selected && !isMobile && (
                            <td className="py-2 pr-2 font-mono text-[11px] text-neutral-600">{v.bizNo}</td>
                          )}
                          {!selected && !isMobile && (
                            <td className="py-2 pr-2 font-mono text-[11px] text-neutral-600">{v.contact}</td>
                          )}
                          <td className="py-2 pr-2 font-mono text-[11px] text-neutral-500">{v.appliedAt}</td>
                          <td className="py-2 pr-2 text-right">
                            <StatusBadge status={v.status} />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ③ 상세 패널 — 데스크톱: 우측 슬라이드 / 모바일: 하단 오버레이 */}
            {selected && (
              <DetailPanel
                mode={mode}
                vendor={selected}
                onClose={closeDetail}
                onApproveClick={() => setConfirmApprove(true)}
                onRejectClick={() => {
                  setRejectReason("")
                  setRejectModal(true)
                }}
              />
            )}
          </div>

          {/* 안내 문구 */}
          <p className="mt-4 border-l-2 border-neutral-400 bg-neutral-100 px-3 py-2 font-mono text-[11px] leading-relaxed text-neutral-600">
            ※ 승인 시 해당 업체 관리자에게 알림이 발송됩니다(SCR-NOTI-001 트리거). 반려 사유는 수정
            불가하며 이력으로 영구 보관됩니다. 실제 계정 활성화/알림은 백엔드에서 처리됩니다.
          </p>
        </main>
      </div>

      {/* ===== 푸터 ===== */}
      <footer className="flex shrink-0 items-center justify-between border-t border-neutral-300 bg-neutral-100 px-4 py-1.5">
        <span className="font-mono text-[11px] text-neutral-600">{footerMsg}</span>
        <span className="hidden font-mono text-[10px] text-neutral-400 sm:inline">
          v0.1 · WIREFRAME · GRAYSCALE
        </span>
      </footer>

      {/* ===== 승인 확인 모달 ===== */}
      {confirmApprove && selected && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-neutral-900/40 p-4">
          <div className="relative w-full max-w-sm border border-neutral-400 bg-white p-4 shadow-lg">
            <Num n={7} />
            <p className="mb-1 text-sm font-bold text-neutral-900">가입 승인 확인</p>
            <p className="mb-4 text-xs leading-relaxed text-neutral-600">
              <span className="font-medium text-neutral-800">{selected.name}</span>의 가입을
              승인합니다. 승인 시 계정이 즉시 활성화되고 업체 관리자에게 알림이 발송됩니다.
              계속하시겠습니까?
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmApprove(false)}
                className="relative border border-neutral-400 bg-white px-3 py-1.5 pl-5 text-xs text-neutral-700 hover:bg-neutral-100"
              >
                <Num n={8} />
                취소
              </button>
              <button
                type="button"
                onClick={doApprove}
                className="relative border border-neutral-900 bg-neutral-900 px-3 py-1.5 pl-5 text-xs text-white hover:bg-neutral-700"
              >
                <Num n={9} />
                승인 확정
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== ⑥ 반려 사유 입력 모달 ===== */}
      {rejectModal && selected && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-neutral-900/40 p-4">
          <div className="relative w-full max-w-sm border border-neutral-400 bg-white p-4 shadow-lg">
            <Num n={6} />
            <p className="mb-1 text-sm font-bold text-neutral-900">반려 사유 입력</p>
            <p className="mb-3 text-xs leading-relaxed text-neutral-600">
              <span className="font-medium text-neutral-800">{selected.name}</span>의 가입을
              반려합니다. 사유는 이력으로 영구 보관되며 수정할 수 없습니다.
            </p>
            <label className="mb-1 block font-mono text-[11px] text-neutral-500">
              반려 사유 <span className="text-neutral-700">*필수</span>
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              placeholder="반려 사유를 입력하세요 (필수)"
              className="mb-1 w-full resize-none border border-neutral-400 bg-white p-2 text-xs text-neutral-800 outline-none placeholder:text-neutral-400 focus:border-neutral-700"
            />
            <p className="mb-3 text-right font-mono text-[10px] text-neutral-400">
              {rejectReason.trim().length === 0
                ? "사유 미입력 시 반려 확정 불가"
                : `${rejectReason.trim().length}자 입력됨`}
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setRejectModal(false)
                  setRejectReason("")
                }}
                className="relative border border-neutral-400 bg-white px-3 py-1.5 pl-5 text-xs text-neutral-700 hover:bg-neutral-100"
              >
                <Num n={8} />
                취소
              </button>
              <button
                type="button"
                disabled={rejectReason.trim().length === 0}
                onClick={doReject}
                className={[
                  "relative border px-3 py-1.5 pl-5 text-xs transition-colors",
                  rejectReason.trim().length === 0
                    ? "cursor-not-allowed border-dashed border-neutral-300 bg-neutral-100 text-neutral-400"
                    : "border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-700",
                ].join(" ")}
              >
                <Num n={9} />
                반려 확정
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== 토스트 ===== */}
      {toast && (
        <div className="absolute bottom-10 left-1/2 z-50 w-[90%] max-w-sm -translate-x-1/2">
          <div
            className={[
              "relative flex items-center gap-2 border px-3 py-2 text-xs shadow-md",
              toast.kind === "ok"
                ? "border-neutral-800 bg-neutral-900 text-white"
                : "border-neutral-500 bg-white text-neutral-800",
            ].join(" ")}
          >
            <span className="font-mono text-[11px]">{toast.kind === "ok" ? "OK" : "REJ"}</span>
            <span className="leading-snug">{toast.msg}</span>
          </div>
        </div>
      )}
    </div>
  )
}

/* ============================================================
   ③ 상세 패널
   ============================================================ */
function DetailPanel({
  mode,
  vendor,
  onClose,
  onApproveClick,
  onRejectClick,
}: {
  mode: "desktop" | "mobile"
  vendor: Vendor
  onClose: () => void
  onApproveClick: () => void
  onRejectClick: () => void
}) {
  const isMobile = mode === "mobile"
  const processed = vendor.status !== "pending"

  const panelInner = (
    <section className="relative flex h-full flex-col rounded border border-neutral-400 bg-white">
      <Num n={3} />
      <div className="flex items-center justify-between border-b border-neutral-300 px-3 py-2">
        <div>
          <p className="text-sm font-bold text-neutral-900">{vendor.name}</p>
          <p className="font-mono text-[10px] text-neutral-400">{vendor.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={vendor.status} />
          <button
            type="button"
            onClick={onClose}
            aria-label="상세 닫기"
            className="border border-neutral-400 px-1.5 py-0.5 text-xs text-neutral-600 hover:bg-neutral-100"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3">
        {/* 로고 미리보기 */}
        <p className="mb-1 font-mono text-[11px] text-neutral-500">로고 미리보기</p>
        <div className="mb-3 flex h-24 w-24 flex-col items-center justify-center border border-dashed border-neutral-400 bg-neutral-50 text-center">
          <span className="font-mono text-[10px] text-neutral-400">[IMG]</span>
          <span className="mt-1 max-w-[80px] truncate px-1 font-mono text-[9px] text-neutral-500">
            {vendor.logoLabel}
          </span>
        </div>

        {/* 사업자정보 전체 */}
        <p className="mb-1 font-mono text-[11px] text-neutral-500">사업자정보</p>
        <dl className="mb-3 grid grid-cols-[92px_1fr] gap-x-2 gap-y-1.5 text-xs">
          <InfoRow label="대표자명" value={vendor.ceo} />
          <InfoRow label="사업자번호" value={vendor.bizNo} mono />
          <InfoRow label="업태/종목" value={vendor.bizType} />
          <InfoRow label="담당자" value={`${vendor.managerName} (${vendor.contact})`} />
          <InfoRow label="이메일" value={vendor.email} mono />
          <InfoRow label="사업장주소" value={vendor.address} />
          <InfoRow label="가입신청일" value={vendor.appliedAt} mono />
        </dl>

        {/* 소개글 미리보기 */}
        <p className="mb-1 font-mono text-[11px] text-neutral-500">소개글 미리보기</p>
        <p className="mb-3 border border-neutral-200 bg-neutral-50 p-2 text-xs leading-relaxed text-neutral-700">
          {vendor.intro}
        </p>

        {/* 처리 이력 (반려 사유 등) */}
        {processed && (
          <div className="border-l-2 border-neutral-500 bg-neutral-100 px-2 py-1.5">
            <p className="font-mono text-[11px] text-neutral-600">
              처리완료 · {STATUS_LABEL[vendor.status]}
            </p>
            <p className="font-mono text-[10px] text-neutral-500">
              {vendor.processedAt} · {vendor.processedBy}
            </p>
            {vendor.status === "rejected" && vendor.rejectReason && (
              <p className="mt-1 text-xs leading-relaxed text-neutral-700">
                <span className="font-medium">반려 사유(수정불가): </span>
                {vendor.rejectReason}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ④⑤ 승인/반려 버튼 — 미처리 건에만 노출, 처리완료 시 텍스트만 */}
      <div className="border-t border-neutral-300 p-3">
        {processed ? (
          <div className="flex items-center justify-center border border-dashed border-neutral-300 bg-neutral-50 py-2 font-mono text-[11px] text-neutral-500">
            처리완료 — 추가 조치 불가
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onRejectClick}
              className="relative flex-1 border border-neutral-500 bg-white px-3 py-2 pl-6 text-xs text-neutral-800 hover:bg-neutral-100"
            >
              <Num n={5} />
              반려
            </button>
            <button
              type="button"
              onClick={onApproveClick}
              className="relative flex-1 border border-neutral-900 bg-neutral-900 px-3 py-2 pl-6 text-xs text-white hover:bg-neutral-700"
            >
              <Num n={4} />
              승인
            </button>
          </div>
        )}
      </div>
    </section>
  )

  if (isMobile) {
    // 모바일: 하단에서 올라오는 오버레이 패널
    return (
      <div className="absolute inset-0 z-30 flex flex-col justify-end">
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="flex-1 bg-neutral-900/30"
        />
        <div className="h-[78%] animate-in slide-in-from-bottom">{panelInner}</div>
      </div>
    )
  }

  // 데스크톱: 우측 슬라이드 패널
  return <div className="w-1/2 shrink-0 animate-in slide-in-from-right">{panelInner}</div>
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <>
      <dt className="font-mono text-[11px] text-neutral-500">{label}</dt>
      <dd className={mono ? "font-mono text-[11px] text-neutral-800" : "text-neutral-800"}>{value}</dd>
    </>
  )
}

function Sidebar() {
  const items = [
    { label: "대시보드", id: "SCR-DASH-001" },
    { label: "사용자 관리", id: "SCR-USER-001" },
    { label: "권한 관리", id: "SCR-RBAC-001" },
    { label: "업체 심사", id: "SCR-VET-001", active: true },
    { label: "정산 관리", id: "SCR-PAY-001" },
    { label: "시스템 설정", id: "SCR-SYS-001" },
  ]
  return (
    <nav className="w-52 shrink-0 border-r border-neutral-300 bg-white p-2">
      <p className="px-2 py-1.5 font-mono text-[11px] text-neutral-500">플랫폼관리자 메뉴</p>
      <ul className="flex flex-col">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className={[
                "flex items-center justify-between border-l-2 px-2 py-1.5 text-xs",
                it.active
                  ? "border-neutral-900 bg-neutral-100 font-medium text-neutral-900"
                  : "border-transparent text-neutral-600 hover:bg-neutral-50",
              ].join(" ")}
            >
              <span>{it.label}</span>
              <span className="font-mono text-[10px] text-neutral-400">{it.id.replace("SCR-", "")}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function nowStr() {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}
