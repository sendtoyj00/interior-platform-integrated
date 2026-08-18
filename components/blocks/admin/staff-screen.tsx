"use client"

import { useMemo, useState } from "react"
import {
  STAFF,
  PROJECTS,
  STAFF_STATUS_LABEL,
  type Staff,
  type StaffStatus,
} from "@/lib/blocks/admin/staff-data"

/* ============================================================
   와이어프레임 공용 요소 (다른 화면과 동일 패턴)
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

function StatusBadge({ status }: { status: StaffStatus }) {
  const style: Record<StaffStatus, string> = {
    invited: "border-neutral-400 bg-white text-neutral-600",
    active: "border-neutral-800 bg-neutral-800 text-white",
  }
  return (
    <span
      className={[
        "inline-block whitespace-nowrap rounded border px-1.5 py-0.5 font-mono text-[11px] leading-none",
        style[status],
      ].join(" ")}
    >
      {STAFF_STATUS_LABEL[status]}
    </span>
  )
}

const MENU = [
  { label: "대시보드", id: "SCR-DASH", on: false },
  { label: "현장담당자 관리", id: "SCR-STAFF-001", on: true },
  { label: "프로젝트 관리", id: "SCR-PRJ", on: false },
  { label: "견적/계약", id: "SCR-EST", on: false },
  { label: "업체 프로필", id: "SCR-PROF", on: false },
]

function Sidebar() {
  return (
    <nav className="flex h-full w-52 shrink-0 flex-col border-r border-neutral-300 bg-white">
      <p className="border-b border-neutral-200 px-3 py-2 font-mono text-[11px] text-neutral-400">
        업체관리자 메뉴
      </p>
      <ul className="flex flex-col">
        {MENU.map((m) => (
          <li key={m.id}>
            <div
              className={[
                "flex items-center justify-between border-b border-neutral-100 px-3 py-2 text-xs",
                m.on
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-600 hover:bg-neutral-100",
              ].join(" ")}
            >
              <span>{m.label}</span>
              <span
                className={[
                  "font-mono text-[9px]",
                  m.on ? "text-neutral-300" : "text-neutral-400",
                ].join(" ")}
              >
                {m.id}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/* ============================================================
   메인 화면 (헤더 / 사이드바 / 바디 / 푸터)
   ============================================================ */

export function StaffScreen({ mode }: { mode: "desktop" | "mobile" }) {
  const isMobile = mode === "mobile"

  const [staff, setStaff] = useState<Staff[]>(() =>
    JSON.parse(JSON.stringify(STAFF)),
  )

  // ② 초대 모달
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteError, setInviteError] = useState<string | null>(null)

  // ⑤ 프로젝트 배정 모달
  const [assignTargetId, setAssignTargetId] = useState<string | null>(null)
  const [assignSelection, setAssignSelection] = useState<string[]>([])

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [toast, setToast] = useState<{ msg: string; kind: "ok" | "err" } | null>(null)
  const [footerMsg, setFooterMsg] = useState("READY · 소속 직원 목록 표시 중")

  const assignTarget = staff.find((s) => s.id === assignTargetId) || null

  const counts = useMemo(
    () => ({
      total: staff.length,
      invited: staff.filter((s) => s.status === "invited").length,
      active: staff.filter((s) => s.status === "active").length,
    }),
    [staff],
  )

  function showToast(msg: string, kind: "ok" | "err") {
    setToast({ msg, kind })
    window.setTimeout(() => setToast(null), 3000)
  }

  /* ② 초대 발송 */
  function sendInvite() {
    const email = inviteEmail.trim().toLowerCase()
    if (email.length === 0) {
      setInviteError("이메일을 입력해주세요")
      return
    }
    // 간단 형식 검증
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setInviteError("올바른 이메일 형식이 아닙니다")
      return
    }
    // 예외: 이미 초대/등록된 이메일 재초대
    const dup = staff.some((s) => s.email.toLowerCase() === email)
    if (dup) {
      setInviteError("이미 초대된 이메일입니다")
      return
    }
    const newStaff: Staff = {
      id: `STF-${String(staff.length + 1).padStart(3, "0")}`,
      name: email.split("@")[0],
      email,
      status: "invited",
      assignedCount: 0,
      assignedProjectIds: [],
    }
    setStaff((prev) => [...prev, newStaff])
    setInviteOpen(false)
    setInviteEmail("")
    setInviteError(null)
    setFooterMsg(`SAVED · ${email} 초대 발송 · "초대중" 상태로 목록 추가`)
    showToast(`${email} 로 초대 이메일을 발송했습니다`, "ok")
  }

  /* ⑤ 배정 저장 */
  function saveAssign() {
    if (!assignTarget || assignSelection.length === 0) return
    setStaff((prev) =>
      prev.map((s) =>
        s.id === assignTarget.id
          ? {
              ...s,
              assignedProjectIds: [...assignSelection],
              assignedCount: assignSelection.length,
            }
          : s,
      ),
    )
    setFooterMsg(
      `SAVED · ${assignTarget.name} 프로젝트 ${assignSelection.length}건 배정 완료`,
    )
    showToast(
      `${assignTarget.name}님에게 프로젝트 ${assignSelection.length}건을 배정했습니다`,
      "ok",
    )
    setAssignTargetId(null)
    setAssignSelection([])
  }

  function openAssign(s: Staff) {
    setAssignTargetId(s.id)
    setAssignSelection([...s.assignedProjectIds])
    setFooterMsg(`ASSIGN · ${s.name} 프로젝트 배정 모달 열림`)
  }

  function toggleProject(id: string) {
    setAssignSelection((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    )
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
              <Num n={9} />
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
            업체관리자
          </span>
          <button
            type="button"
            className="relative border border-neutral-400 bg-white px-2 py-1 pl-5 text-xs text-neutral-700 hover:bg-neutral-100"
          >
            <Num n={8} />
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
          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
            <div>
              <h1 className="text-sm font-bold text-neutral-800">현장담당자 관리</h1>
              <p className="font-mono text-[11px] text-neutral-500">SCR-STAFF-001 · REQ-NFR-002</p>
            </div>
            {/* ① 직원 초대 버튼 (상단 우측) */}
            <button
              type="button"
              onClick={() => {
                setInviteOpen(true)
                setInviteEmail("")
                setInviteError(null)
                setFooterMsg("INVITE · 초대 이메일 입력 모달 열림")
              }}
              className="relative border border-neutral-900 bg-neutral-900 px-3 py-1.5 pl-6 text-xs text-white hover:bg-neutral-700"
            >
              <Num n={1} />+ 직원 초대
            </button>
          </div>

          {/* 요약 카운트 */}
          <section className="mb-4 flex flex-wrap gap-2">
            {[
              { label: "전체", v: counts.total },
              { label: "초대중", v: counts.invited },
              { label: "활성", v: counts.active },
            ].map((c) => (
              <div
                key={c.label}
                className="flex items-baseline gap-1.5 border border-neutral-300 bg-white px-3 py-1.5"
              >
                <span className="font-mono text-[11px] text-neutral-500">{c.label}</span>
                <span className="font-mono text-sm font-bold text-neutral-800">{c.v}</span>
              </div>
            ))}
          </section>

          {/* ③ 소속 직원 목록 테이블 */}
          <section className="relative rounded border border-neutral-300 bg-white p-3">
            <Num n={3} />
            <p className="mb-2 font-mono text-[11px] text-neutral-500">소속 직원 목록</p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-300 font-mono text-[11px] text-neutral-500">
                    <th className="py-1.5 pr-2 font-normal">이름</th>
                    {!isMobile && <th className="py-1.5 pr-2 font-normal">이메일</th>}
                    <th className="py-1.5 pr-2 font-normal">가입상태</th>
                    <th className="py-1.5 pr-2 text-center font-normal">배정 PRJ</th>
                    <th className="py-1.5 pr-2 text-right font-normal">배정</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-neutral-200 last:border-0 hover:bg-neutral-50"
                    >
                      <td className="py-2 pr-2">
                        <span className="text-neutral-800">{s.name}</span>
                        {isMobile && (
                          <span className="block max-w-[130px] truncate font-mono text-[10px] text-neutral-400">
                            {s.email}
                          </span>
                        )}
                      </td>
                      {!isMobile && (
                        <td className="py-2 pr-2 font-mono text-[11px] text-neutral-600">{s.email}</td>
                      )}
                      <td className="py-2 pr-2">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="py-2 pr-2 text-center font-mono text-[11px] text-neutral-700">
                        {s.assignedCount}
                      </td>
                      <td className="py-2 pr-2 text-right">
                        {/* ④ 프로젝트 배정 버튼 */}
                        <button
                          type="button"
                          onClick={() => openAssign(s)}
                          className="relative border border-neutral-400 bg-white px-2 py-1 pl-5 text-[11px] text-neutral-700 hover:bg-neutral-100"
                        >
                          <Num n={4} />
                          배정
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 안내 문구 */}
          <p className="mt-4 border-l-2 border-neutral-400 bg-neutral-100 px-3 py-2 font-mono text-[11px] leading-relaxed text-neutral-600">
            ※ 초대/배정은 프론트엔드 와이어프레임 동작입니다. 실제 초대 이메일 발송·계정 활성화·권한
            부여는 백엔드에서 처리됩니다. (REQ-NFR-002)
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

      {/* ===== ② 초대 이메일 입력 모달 ===== */}
      {inviteOpen && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-neutral-900/40 p-4">
          <div className="relative w-full max-w-sm border border-neutral-400 bg-white p-4 shadow-lg">
            <Num n={2} />
            <p className="mb-1 text-sm font-bold text-neutral-900">직원 초대</p>
            <p className="mb-3 text-xs leading-relaxed text-neutral-600">
              초대할 직원의 이메일을 입력하세요. 발송 시 목록에 &quot;초대중&quot; 상태로 추가됩니다.
            </p>
            <label className="mb-1 block font-mono text-[11px] text-neutral-500">
              이메일 <span className="text-neutral-700">*필수</span>
            </label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => {
                setInviteEmail(e.target.value)
                if (inviteError) setInviteError(null)
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                  sendInvite()
                }
              }}
              placeholder="staff@vendor.co"
              className={[
                "w-full border bg-white p-2 text-xs text-neutral-800 outline-none placeholder:text-neutral-400",
                inviteError ? "border-neutral-800" : "border-neutral-400 focus:border-neutral-700",
              ].join(" ")}
            />
            {/* 예외: 재초대/형식 오류 에러 메시지 */}
            {inviteError ? (
              <p className="mt-1 border border-neutral-800 bg-neutral-100 px-2 py-1 font-mono text-[11px] text-neutral-800">
                ! {inviteError}
              </p>
            ) : (
              <p className="mt-1 font-mono text-[10px] text-neutral-400">
                이미 등록된 이메일은 재초대할 수 없습니다
              </p>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setInviteOpen(false)
                  setInviteEmail("")
                  setInviteError(null)
                }}
                className="relative border border-neutral-400 bg-white px-3 py-1.5 pl-5 text-xs text-neutral-700 hover:bg-neutral-100"
              >
                <Num n={7} />
                취소
              </button>
              <button
                type="button"
                onClick={sendInvite}
                className="relative border border-neutral-900 bg-neutral-900 px-3 py-1.5 pl-5 text-xs text-white hover:bg-neutral-700"
              >
                <Num n={6} />
                초대 발송
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== ⑤ 프로젝트 배정 모달 ===== */}
      {assignTarget && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-neutral-900/40 p-4">
          <div className="relative flex max-h-[90%] w-full max-w-md flex-col border border-neutral-400 bg-white p-4 shadow-lg">
            <Num n={5} />
            <p className="mb-1 text-sm font-bold text-neutral-900">프로젝트 배정</p>
            <p className="mb-3 text-xs leading-relaxed text-neutral-600">
              <span className="font-medium text-neutral-800">{assignTarget.name}</span>
              님에게 배정할 프로젝트를 선택하세요.
            </p>

            <div className="mb-2 flex-1 overflow-auto border border-neutral-200">
              <ul>
                {PROJECTS.map((p) => {
                  const checked = assignSelection.includes(p.id)
                  return (
                    <li
                      key={p.id}
                      className="border-b border-neutral-100 last:border-0"
                    >
                      <label className="relative flex cursor-pointer items-start gap-2 px-3 py-2 hover:bg-neutral-50">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleProject(p.id)}
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-neutral-900"
                        />
                        <span className="min-w-0">
                          <span className="block text-xs text-neutral-800">{p.name}</span>
                          <span className="block font-mono text-[10px] text-neutral-400">
                            {p.id} · {p.site}
                          </span>
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </div>

            <p className="mb-3 text-right font-mono text-[10px] text-neutral-400">
              {assignSelection.length === 0
                ? "1개 이상 선택해야 배정 저장 가능"
                : `${assignSelection.length}개 선택됨`}
            </p>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setAssignTargetId(null)
                  setAssignSelection([])
                }}
                className="relative border border-neutral-400 bg-white px-3 py-1.5 pl-5 text-xs text-neutral-700 hover:bg-neutral-100"
              >
                <Num n={7} />
                취소
              </button>
              {/* 예외: 미선택 시 비활성화 유지 */}
              <button
                type="button"
                disabled={assignSelection.length === 0}
                onClick={saveAssign}
                className={[
                  "relative border px-3 py-1.5 pl-5 text-xs transition-colors",
                  assignSelection.length === 0
                    ? "cursor-not-allowed border-dashed border-neutral-300 bg-neutral-100 text-neutral-400"
                    : "border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-700",
                ].join(" ")}
              >
                <Num n={6} />
                배정 저장
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
            <span className="font-mono text-[11px]">{toast.kind === "ok" ? "OK" : "ERR"}</span>
            <span className="leading-snug">{toast.msg}</span>
          </div>
        </div>
      )}
    </div>
  )
}
