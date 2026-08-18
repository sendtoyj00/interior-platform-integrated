"use client"

import { useMemo, useState } from "react"
import {
  ROLES,
  MENU_ACCESS,
  API_SCOPE,
  AUDIT_LOGS,
  type RoleKey,
  type MenuAccess,
  type AuditLog,
} from "@/lib/blocks/admin/rbac-data"

/* ============================================================
   와이어프레임 공용 요소
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

/* 와이어프레임 토글 스위치 */
function WireToggle({
  checked,
  disabled,
  onChange,
  label,
}: {
  checked: boolean
  disabled?: boolean
  onChange?: () => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={[
        "inline-flex h-5 w-9 items-center rounded-full border border-neutral-400 p-0.5 transition-colors",
        disabled ? "cursor-not-allowed border-dashed border-neutral-300 bg-neutral-100" : "bg-white",
        checked && !disabled ? "bg-neutral-800 border-neutral-800" : "",
      ].join(" ")}
    >
      <span
        className={[
          "h-3.5 w-3.5 rounded-full transition-transform",
          checked ? "translate-x-4" : "translate-x-0",
          disabled ? "bg-neutral-400" : checked ? "bg-white" : "bg-neutral-500",
        ].join(" ")}
      />
    </button>
  )
}

/* 허용/차단 뱃지 (그레이스케일) */
function AllowBadge({ allowed }: { allowed: boolean }) {
  return (
    <span
      className={[
        "inline-block rounded border px-1.5 py-0.5 font-mono text-[11px] leading-none",
        allowed
          ? "border-neutral-800 bg-neutral-800 text-white"
          : "border-neutral-400 bg-white text-neutral-500",
      ].join(" ")}
    >
      {allowed ? "ALLOW" : "DENY"}
    </span>
  )
}

function MethodBadge({ method }: { method: string }) {
  return (
    <span className="inline-block rounded border border-dashed border-neutral-400 px-1.5 py-0.5 font-mono text-[11px] leading-none text-neutral-700">
      {method}
    </span>
  )
}

/* ============================================================
   메인 화면 (헤더 / 사이드바 / 바디 / 푸터)
   mode: 데스크톱 vs 모바일 레이아웃
   ============================================================ */

export function RbacScreen({ mode }: { mode: "desktop" | "mobile" }) {
  const isMobile = mode === "mobile"

  const [activeRole, setActiveRole] = useState<RoleKey>("company_admin")
  const [menuState, setMenuState] = useState<Record<RoleKey, MenuAccess[]>>(
    () => JSON.parse(JSON.stringify(MENU_ACCESS)),
  )
  const [logs, setLogs] = useState<AuditLog[]>(AUDIT_LOGS)
  const [dirty, setDirty] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [toast, setToast] = useState<{ msg: string; kind: "ok" | "err" } | null>(null)
  const [footerMsg, setFooterMsg] = useState("READY · 변경사항 없음")

  const roleDef = ROLES.find((r) => r.key === activeRole)!
  const locked = !!roleDef.locked
  const menus = menuState[activeRole]
  const apis = API_SCOPE[activeRole]

  const changedCount = useMemo(() => {
    const base = MENU_ACCESS[activeRole]
    return menus.reduce((acc, m, i) => (m.allowed !== base[i].allowed ? acc + 1 : acc), 0)
  }, [menus, activeRole])

  function toggleMenu(idx: number) {
    if (locked) return
    setMenuState((prev) => {
      const next = { ...prev, [activeRole]: prev[activeRole].map((m, i) => (i === idx ? { ...m, allowed: !m.allowed } : m)) }
      return next
    })
    setDirty(true)
    setFooterMsg("DRAFT · 저장되지 않은 변경사항이 있습니다")
  }

  function showToast(msg: string, kind: "ok" | "err") {
    setToast({ msg, kind })
    window.setTimeout(() => setToast(null), 2600)
  }

  function confirmSave() {
    // 목업: 저장 성공/실패 랜덤 없이 항상 성공 처리 (실패 예시는 별도 버튼 없음 → 성공 흐름)
    const summary = `${roleDef.label} · 메뉴 접근권한 ${changedCount}건 변경`
    setLogs((prev) => [
      { actor: "admin@platform.co", at: nowStr(), change: summary },
      ...prev,
    ])
    // 기준값 갱신
    MENU_ACCESS[activeRole] = JSON.parse(JSON.stringify(menuState[activeRole]))
    setDirty(false)
    setModalOpen(false)
    setFooterMsg("SAVED · 변경사항이 전체 사용자에게 적용되었습니다")
    showToast("권한이 저장되어 전체 사용자에게 적용되었습니다", "ok")
  }

  function simulateFail() {
    setModalOpen(false)
    setFooterMsg("ERROR · 권한 저장 실패")
    showToast("권한 변경에 실패했습니다. 다시 시도해주세요", "err")
  }

  const numBase = isMobile ? 0 : 0

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
              <Num n={12} />
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
            <Num n={11} />
            로그아웃
          </button>
        </div>
      </header>

      {/* ===== 헤더-바디 사이: 상단 상태 배지 ===== */}
      <div className="flex shrink-0 items-center justify-end gap-2 border-b border-neutral-200 bg-white px-4 py-1.5">
        {dirty && (
          <span className="animate-pulse border border-neutral-700 bg-neutral-900 px-2 py-0.5 font-mono text-[11px] text-white">
            ● 저장되지 않은 변경사항 {changedCount > 0 ? `(${changedCount})` : ""}
          </span>
        )}
      </div>

      <div className="flex min-h-0 flex-1">
        {/* ===== 사이드바 (데스크톱 고정 / 모바일 드로어) ===== */}
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
            <h1 className="text-sm font-bold text-neutral-800">역할별 접근권한 관리</h1>
            <p className="font-mono text-[11px] text-neutral-500">SCR-RBAC-001 · REQ-NFR-002</p>
          </div>

          {/* ① 역할 선택 탭 */}
          <section className="relative mb-5 rounded border border-neutral-300 bg-white p-3">
            <Num n={1} />
            <p className="mb-2 font-mono text-[11px] text-neutral-500">역할 선택</p>
            <div className={isMobile ? "grid grid-cols-2 gap-2" : "flex flex-wrap gap-2"}>
              {ROLES.map((r) => {
                const on = r.key === activeRole
                return (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => {
                      if (dirty) {
                        showToast("저장되지 않은 변경사항이 있습니다", "err")
                        return
                      }
                      setActiveRole(r.key)
                    }}
                    className={[
                      "border px-3 py-1.5 text-xs transition-colors",
                      on
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-400 bg-white text-neutral-700 hover:bg-neutral-100",
                    ].join(" ")}
                  >
                    {r.label}
                    {r.locked && <span className="ml-1 font-mono text-[10px] opacity-70">🔒LOCK</span>}
                  </button>
                )
              })}
            </div>
          </section>

          {/* ② 메뉴 접근 테이블 */}
          <section className="relative mb-5 rounded border border-neutral-300 bg-white p-3">
            <Num n={2} />
            <div className="mb-2 flex items-center justify-between">
              <p className="font-mono text-[11px] text-neutral-500">접근 가능 메뉴 · 토글로 허용 설정</p>
              {locked && (
                <span className="font-mono text-[10px] text-neutral-500">읽기 전용 (수정 불가)</span>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-300 font-mono text-[11px] text-neutral-500">
                    <th className="py-1.5 pr-2 font-normal">메뉴명</th>
                    <th className="py-1.5 pr-2 font-normal">화면ID</th>
                    <th className="py-1.5 pr-2 text-right font-normal">접근허용</th>
                  </tr>
                </thead>
                <tbody>
                  {menus.map((m, i) => (
                    <tr key={m.screenId + i} className="border-b border-neutral-200 last:border-0">
                      <td className="py-2 pr-2 text-neutral-800">{m.menu}</td>
                      <td className="py-2 pr-2 font-mono text-[11px] text-neutral-500">{m.screenId}</td>
                      <td className="py-2 pr-2 text-right">
                        <WireToggle
                          checked={m.allowed}
                          disabled={locked}
                          onChange={() => toggleMenu(i)}
                          label={`${m.menu} 접근허용`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ③ API 접근범위 (읽기 전용) */}
          <section className="relative mb-5 rounded border border-neutral-300 bg-white p-3">
            <Num n={3} />
            <p className="mb-2 font-mono text-[11px] text-neutral-500">API 접근범위 · 읽기 전용</p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-300 font-mono text-[11px] text-neutral-500">
                    <th className="py-1.5 pr-2 font-normal">API 경로</th>
                    <th className="py-1.5 pr-2 font-normal">Method</th>
                    <th className="py-1.5 pr-2 text-right font-normal">허용여부</th>
                  </tr>
                </thead>
                <tbody>
                  {apis.map((a, i) => (
                    <tr key={a.path + a.method + i} className="border-b border-neutral-200 last:border-0">
                      <td className="py-2 pr-2 font-mono text-[11px] text-neutral-700">{a.path}</td>
                      <td className="py-2 pr-2">
                        <MethodBadge method={a.method} />
                      </td>
                      <td className="py-2 pr-2 text-right">
                        <AllowBadge allowed={a.allowed} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ④ 저장 버튼 */}
          <section className="mb-5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={!dirty || locked}
              onClick={() => setModalOpen(true)}
              className={[
                "relative border px-4 py-2 pl-6 text-xs transition-colors",
                dirty && !locked
                  ? "border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-700"
                  : "cursor-not-allowed border-dashed border-neutral-300 bg-neutral-100 text-neutral-400",
              ].join(" ")}
            >
              <Num n={4} />
              변경사항 저장
            </button>
            {dirty && (
              <span className="font-mono text-[11px] text-neutral-500">{changedCount}건 변경 대기</span>
            )}
          </section>

          {/* ⑤ 저장 이력 (감사로그) */}
          <section className="relative mb-2 rounded border border-neutral-300 bg-white p-3">
            <Num n={5} />
            <p className="mb-2 font-mono text-[11px] text-neutral-500">저장 이력 · 감사로그 (REQ-NFR-004)</p>
            <ul className="flex flex-col">
              {logs.map((l, i) => (
                <li
                  key={i}
                  className="border-b border-neutral-200 py-2 text-xs last:border-0"
                >
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="font-mono text-[11px] text-neutral-500">{l.at}</span>
                    <span className="border border-neutral-300 bg-neutral-100 px-1.5 font-mono text-[10px] text-neutral-600">
                      {l.actor}
                    </span>
                  </div>
                  <p className="mt-0.5 text-neutral-800">{l.change}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* 안내 문구 (REQ-NFR-002) */}
          <p className="mt-4 border-l-2 border-neutral-400 bg-neutral-100 px-3 py-2 font-mono text-[11px] leading-relaxed text-neutral-600">
            ※ 본 화면은 프론트엔드 UI일 뿐이며, 실제 접근 제어는 백엔드 JWT 클레임 검증에서
            강제됩니다. (REQ-NFR-002)
          </p>
        </main>
      </div>

      {/* ===== 푸터 (상태 메시지 영역) ===== */}
      <footer className="flex shrink-0 items-center justify-between border-t border-neutral-300 bg-neutral-100 px-4 py-1.5">
        <span className="font-mono text-[11px] text-neutral-600">{footerMsg}</span>
        <span className="hidden font-mono text-[10px] text-neutral-400 sm:inline">
          v0.1 · WIREFRAME · GRAYSCALE
        </span>
      </footer>

      {/* ===== 모달 (확인) ===== */}
      {modalOpen && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-neutral-900/40 p-4">
          <div className="relative w-full max-w-sm border border-neutral-400 bg-white p-4 shadow-lg">
            <Num n={6} />
            <p className="mb-1 text-sm font-bold text-neutral-900">변경사항 저장 확인</p>
            <p className="mb-4 text-xs leading-relaxed text-neutral-600">
              이 변경사항은 즉시 전체 사용자에게 적용됩니다. 계속하시겠습니까?
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="relative border border-neutral-400 bg-white px-3 py-1.5 text-xs text-neutral-700 hover:bg-neutral-100"
              >
                <Num n={7} />
                취소
              </button>
              <button
                type="button"
                onClick={simulateFail}
                className="relative border border-dashed border-neutral-400 bg-white px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-100"
              >
                <Num n={9} />
                실패 시뮬레이션
              </button>
              <button
                type="button"
                onClick={confirmSave}
                className="relative border border-neutral-900 bg-neutral-900 px-3 py-1.5 text-xs text-white hover:bg-neutral-700"
              >
                <Num n={8} />
                확인·적용
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== 토스트 ===== */}
      {toast && (
        <div className="absolute bottom-10 left-1/2 z-50 -translate-x-1/2">
          <div
            className={[
              "relative flex items-center gap-2 border px-3 py-2 text-xs shadow-md",
              toast.kind === "ok"
                ? "border-neutral-800 bg-neutral-900 text-white"
                : "border-neutral-500 bg-white text-neutral-800",
            ].join(" ")}
          >
            <Num n={10} />
            <span className="font-mono text-[11px]">{toast.kind === "ok" ? "OK" : "ERR"}</span>
            <span>{toast.msg}</span>
          </div>
        </div>
      )}
    </div>
  )
}

function Sidebar() {
  const items = [
    { label: "대시보드", id: "SCR-DASH-001" },
    { label: "사용자 관리", id: "SCR-USER-001" },
    { label: "권한 관리", id: "SCR-RBAC-001", active: true },
    { label: "업체 심사", id: "SCR-VET-001" },
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
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}
