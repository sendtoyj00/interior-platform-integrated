"use client"

import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react"
import {
  INITIAL_PHOTOS,
  PROCESSES,
  processName,
  todayString,
  type Photo,
} from "@/lib/blocks/ops/mock"
import { Num } from "./num"

type Mode = "A" | "B"
type Device = "desktop" | "mobile"

type Toast = {
  id: number
  kind: "error" | "info"
  message: string
}

let toastSeq = 0
let photoSeq = 0

export function PhotoApp({ device, mode }: { device: Device; mode: Mode }) {
  const isMobile = device === "mobile"

  const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [status, setStatus] = useState("대기 중 — 작업을 시작하세요.")

  // Upload form state
  const [processId, setProcessId] = useState("")
  const [date, setDate] = useState(todayString())
  const [memo, setMemo] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const [staged, setStaged] = useState<string[]>([])
  const [processError, setProcessError] = useState(false)
  const [progress, setProgress] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Gallery state
  const [visibleCount, setVisibleCount] = useState(6)
  const [modalIndex, setModalIndex] = useState<number | null>(null)

  const pushToast = (kind: Toast["kind"], message: string) => {
    const id = ++toastSeq
    setToasts((t) => [...t, { id, kind, message }])
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, 3200)
  }

  const sortedPhotos = useMemo(
    () =>
      [...photos].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [photos],
  )

  // group by process for gallery, keeping time order inside groups
  const grouped = useMemo(() => {
    const map = new Map<string, Photo[]>()
    for (const p of sortedPhotos.slice(0, visibleCount)) {
      const arr = map.get(p.processId) ?? []
      arr.push(p)
      map.set(p.processId, arr)
    }
    return Array.from(map.entries())
  }, [sortedPhotos, visibleCount])

  const flatVisible = sortedPhotos.slice(0, visibleCount)

  const handleFiles = (files: FileList | File[]) => {
    const list = Array.from(files)
    if (list.length === 0) return
    const bad = list.filter((f) => !f.type.startsWith("image/"))
    const good = list.filter((f) => f.type.startsWith("image/"))
    if (bad.length > 0) {
      pushToast("error", "이미지 파일만 업로드할 수 있습니다.")
    }
    if (good.length > 0) {
      setStaged((s) => [...s, ...good.map((f) => f.name)])
    }
  }

  // simulate file selection without needing real files inside the frame
  const stageMock = (kind: "image" | "other") => {
    if (kind === "other") {
      pushToast("error", "이미지 이외 파일은 업로드할 수 없습니다. (report.pdf)")
      setStatus("오류 — 지원하지 않는 파일 형식")
      return
    }
    const name = `field_photo_${String(staged.length + 1).padStart(2, "0")}.jpg`
    setStaged((s) => [...s, name])
    setStatus(`파일 준비됨 — ${name}`)
  }

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer?.files?.length) handleFiles(e.dataTransfer.files)
  }

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files)
    e.target.value = ""
  }

  const doUpload = () => {
    if (!processId) {
      setProcessError(true)
      pushToast("error", "공정 단계를 먼저 선택해주세요.")
      setStatus("업로드 중단 — 공정 단계 미선택")
      return
    }
    if (staged.length === 0) {
      pushToast("info", "업로드할 사진을 먼저 추가해주세요.")
      return
    }
    setProcessError(false)
    setProgress(0)
    setStatus("업로드 중… 0%")
    const staggerCount = staged.length
    const tick = () => {
      setProgress((prev) => {
        const cur = prev ?? 0
        const next = Math.min(100, cur + 12)
        setStatus(`업로드 중… ${next}%`)
        if (next >= 100) {
          const newPhotos: Photo[] = staged.map(() => ({
            id: `up-${++photoSeq}`,
            processId,
            date,
            memo,
          }))
          setPhotos((p) => [...newPhotos, ...p])
          setStaged([])
          setMemo("")
          setStatus(`업로드 완료 — ${staggerCount}장이 목록 최상단에 반영됨`)
          pushToast("info", `${staggerCount}장 업로드 완료`)
          setTimeout(() => setProgress(null), 500)
          return 100
        }
        setTimeout(tick, 130)
        return next
      })
    }
    setTimeout(tick, 130)
  }

  const openModal = (photo: Photo) => {
    const idx = flatVisible.findIndex((p) => p.id === photo.id)
    setModalIndex(idx)
  }
  const stepModal = (dir: -1 | 1) => {
    setModalIndex((i) => {
      if (i === null) return i
      const next = i + dir
      if (next < 0 || next >= flatVisible.length) return i
      return next
    })
  }

  // ---- shared bits ----
  const roleLabel = mode === "A" ? "현장담당자" : "고객"
  const menuItems =
    mode === "A"
      ? ["대시보드", "공정 관리", "사진 업로드", "일정", "자재 발주"]
      : ["프로젝트 현황", "시공 사진", "일정 보기", "문의하기"]
  const activeMenu = mode === "A" ? "사진 업로드" : "시공 사진"

  const box =
    "relative border border-foreground/40 bg-background"
  const label = "text-foreground"
  const muted = "text-muted-foreground"

  return (
    <div className="relative flex flex-col border border-foreground bg-background text-foreground">
      {/* ===== HEADER ===== */}
      <header className="flex items-center justify-between gap-4 border-b border-foreground bg-secondary px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 items-center justify-center border border-foreground px-3 text-sm font-bold tracking-tight">
            [ LOGO ] 인테리어 플랫폼
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="border border-dashed border-foreground/50 px-2 py-1 text-xs">
            역할: <strong>{roleLabel}</strong>
          </span>
          <div className="relative">
            <Num n={9} />
            <button className="border border-foreground px-3 py-1 text-xs hover:bg-muted">
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className={isMobile ? "flex flex-col" : "flex"}>
        {/* ===== SIDEBAR ===== */}
        <aside
          className={
            isMobile
              ? "border-b border-foreground bg-muted/40 p-3"
              : "w-56 shrink-0 border-r border-foreground bg-muted/40 p-3"
          }
        >
          <div className="mb-2 text-[11px] uppercase tracking-wide text-muted-foreground">
            {roleLabel} 메뉴
          </div>
          <div className="relative">
            <Num n={10} />
            <nav
              className={
                isMobile ? "flex flex-wrap gap-2" : "flex flex-col gap-1"
              }
            >
              {menuItems.map((m) => (
                <button
                  key={m}
                  className={[
                    "border px-3 py-2 text-left text-xs",
                    m === activeMenu
                      ? "border-foreground bg-foreground text-background"
                      : "border-foreground/40 hover:bg-muted",
                  ].join(" ")}
                >
                  {m}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* ===== BODY ===== */}
        <main className="min-w-0 flex-1 p-4">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div>
              <h1 className="text-base font-bold">시공 사진 관리</h1>
              <p className="text-xs text-muted-foreground">
                {mode === "A"
                  ? "모드 A · 현장담당자 업로드"
                  : "모드 B · 고객 갤러리 (읽기전용)"}
              </p>
            </div>
            <span className="border border-dashed border-foreground/40 px-2 py-1 text-[10px] text-muted-foreground">
              {device === "desktop" ? "Desktop 1920px" : "Mobile 360px"}
            </span>
          </div>

          {mode === "A" ? (
            <UploadMode
              isMobile={isMobile}
              box={box}
              label={label}
              muted={muted}
              processId={processId}
              setProcessId={(v) => {
                setProcessId(v)
                if (v) setProcessError(false)
              }}
              processError={processError}
              date={date}
              setDate={setDate}
              memo={memo}
              setMemo={setMemo}
              dragOver={dragOver}
              setDragOver={setDragOver}
              staged={staged}
              removeStaged={(i) =>
                setStaged((s) => s.filter((_, idx) => idx !== i))
              }
              onDrop={onDrop}
              fileInputRef={fileInputRef}
              onInputChange={onInputChange}
              stageMock={stageMock}
              progress={progress}
              doUpload={doUpload}
              recent={sortedPhotos.slice(0, 4)}
            />
          ) : (
            <GalleryMode
              isMobile={isMobile}
              grouped={grouped}
              openModal={openModal}
              canLoadMore={visibleCount < sortedPhotos.length}
              loadMore={() =>
                setVisibleCount((c) => Math.min(c + 6, sortedPhotos.length))
              }
              total={sortedPhotos.length}
              shown={flatVisible.length}
            />
          )}
        </main>
      </div>

      {/* ===== FOOTER (status area) ===== */}
      <footer className="flex items-center gap-2 border-t border-foreground bg-secondary px-4 py-2">
        <span className="border border-foreground px-2 py-0.5 text-[10px] font-bold">
          STATUS
        </span>
        <span className="text-xs text-muted-foreground" role="status" aria-live="polite">
          {status}
        </span>
      </footer>

      {/* ===== TOASTS ===== */}
      <div className="pointer-events-none absolute right-3 top-14 z-30 flex w-64 flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={[
              "relative border bg-background px-3 py-2 text-xs shadow-sm",
              t.kind === "error"
                ? "border-foreground"
                : "border-foreground/50",
            ].join(" ")}
          >
            <Num n={12} />
            <span className="font-bold">
              {t.kind === "error" ? "⚠ 오류" : "✓ 알림"}
            </span>
            <p className="mt-0.5 text-muted-foreground">{t.message}</p>
          </div>
        ))}
      </div>

      {/* ===== MODAL ===== */}
      {modalIndex !== null && flatVisible[modalIndex] && (
        <PhotoModal
          photo={flatVisible[modalIndex]}
          index={modalIndex}
          total={flatVisible.length}
          onClose={() => setModalIndex(null)}
          onPrev={() => stepModal(-1)}
          onNext={() => stepModal(1)}
        />
      )}
    </div>
  )
}

/* -------------------- MODE A: UPLOAD -------------------- */
function UploadMode(props: {
  isMobile: boolean
  box: string
  label: string
  muted: string
  processId: string
  setProcessId: (v: string) => void
  processError: boolean
  date: string
  setDate: (v: string) => void
  memo: string
  setMemo: (v: string) => void
  dragOver: boolean
  setDragOver: (v: boolean) => void
  staged: string[]
  removeStaged: (i: number) => void
  onDrop: (e: DragEvent<HTMLDivElement>) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void
  stageMock: (kind: "image" | "other") => void
  progress: number | null
  doUpload: () => void
  recent: Photo[]
}) {
  const {
    isMobile,
    box,
    muted,
    processId,
    setProcessId,
    processError,
    date,
    setDate,
    memo,
    setMemo,
    dragOver,
    setDragOver,
    staged,
    removeStaged,
    onDrop,
    fileInputRef,
    onInputChange,
    stageMock,
    progress,
    doUpload,
    recent,
  } = props

  return (
    <div className={isMobile ? "flex flex-col gap-4" : "grid grid-cols-2 gap-4"}>
      <section className="flex flex-col gap-4">
        {/* ① process select */}
        <div>
          <FieldLabel n={1} text="공정 단계 선택" required />
          <div className="relative">
            <Num n={1} />
            <select
              value={processId}
              onChange={(e) => setProcessId(e.target.value)}
              className={[
                "w-full appearance-none border bg-background px-3 py-2 text-sm",
                processError ? "border-foreground ring-2 ring-foreground" : "border-foreground/60",
              ].join(" ")}
            >
              <option value="">— 공정 단계를 선택하세요 —</option>
              {PROCESSES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          {processError && (
            <p className="mt-1 text-xs font-bold text-foreground">
              ⚠ 공정 단계를 먼저 선택해주세요.
            </p>
          )}
        </div>

        {/* ② dropzone */}
        <div>
          <FieldLabel n={2} text="사진 업로드 (드래그앤드롭 · 다중)" required />
          <div className="relative">
            <Num n={2} />
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={[
                "flex min-h-32 flex-col items-center justify-center gap-2 border-2 border-dashed p-4 text-center",
                dragOver ? "border-foreground bg-muted" : "border-foreground/50 bg-muted/30",
              ].join(" ")}
            >
              <p className="text-sm font-medium">여기로 파일을 끌어다 놓으세요</p>
              <p className={`text-xs ${muted}`}>또는 아래 버튼으로 선택 (JPG/PNG)</p>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-foreground px-3 py-1 text-xs hover:bg-muted"
                >
                  파일 선택
                </button>
                <button
                  onClick={() => stageMock("image")}
                  className="border border-foreground/60 px-3 py-1 text-xs hover:bg-muted"
                >
                  + 이미지 추가(모의)
                </button>
                <button
                  onClick={() => stageMock("other")}
                  className="border border-foreground/60 px-3 py-1 text-xs hover:bg-muted"
                >
                  + 비이미지(모의)
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={onInputChange}
                className="hidden"
              />
            </div>
          </div>

          {/* staged thumbnails */}
          {staged.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {staged.map((name, i) => (
                <div
                  key={`${name}-${i}`}
                  className="relative flex h-16 w-16 flex-col items-center justify-center border border-foreground/50 bg-muted text-[9px]"
                >
                  <span className="text-muted-foreground">IMG</span>
                  <span className="w-full truncate px-1 text-center text-muted-foreground">
                    {name}
                  </span>
                  <button
                    onClick={() => removeStaged(i)}
                    className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center border border-foreground bg-background text-[10px]"
                    aria-label="제거"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        {/* ③ datetime */}
        <div>
          <FieldLabel n={3} text="촬영일시 (선택 · 기본 오늘)" />
          <div className="relative">
            <Num n={3} />
            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="YYYY-MM-DD HH:mm"
              className="w-full border border-foreground/60 bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* ④ memo */}
        <div>
          <FieldLabel n={4} text="메모 (선택)" />
          <div className="relative">
            <Num n={4} />
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={3}
              placeholder="현장 메모를 입력하세요"
              className="w-full resize-none border border-foreground/60 bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* progress */}
        {progress !== null && (
          <div>
            <div className="mb-1 flex justify-between text-xs text-muted-foreground">
              <span>업로드 진행률</span>
              <span>{progress}%</span>
            </div>
            <div className="h-3 w-full border border-foreground/60 bg-muted">
              <div
                className="h-full bg-foreground transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* ⑤ upload button */}
        <div className="relative self-start">
          <Num n={5} />
          <button
            onClick={doUpload}
            disabled={progress !== null && progress < 100}
            className="border border-foreground bg-foreground px-5 py-2 text-sm font-bold text-background hover:opacity-90 disabled:opacity-50"
          >
            {progress !== null && progress < 100 ? "업로드 중…" : "업로드"}
          </button>
        </div>

        {/* recent uploaded preview */}
        <div className={box + " p-3"}>
          <div className="mb-2 text-[11px] uppercase tracking-wide text-muted-foreground">
            최근 업로드 (최상단 반영)
          </div>
          <ul className="flex flex-col gap-1 text-xs">
            {recent.map((p) => (
              <li key={p.id} className="flex justify-between gap-2 border-b border-foreground/20 pb-1">
                <span className="truncate">{processName(p.processId)}</span>
                <span className="shrink-0 text-muted-foreground">{p.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}

/* -------------------- MODE B: GALLERY -------------------- */
function GalleryMode(props: {
  isMobile: boolean
  grouped: [string, Photo[]][]
  openModal: (p: Photo) => void
  canLoadMore: boolean
  loadMore: () => void
  total: number
  shown: number
}) {
  const { isMobile, grouped, openModal, canLoadMore, loadMore, total, shown } =
    props

  return (
    <div className="relative">
      <Num n={6} />
      <div className="border border-foreground/40 p-3">
        <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>공정 단계별 · 시간순 정렬</span>
          <span>
            {shown} / {total} 장
          </span>
        </div>

        <div className="flex flex-col gap-5">
          {grouped.map(([pid, list]) => (
            <div key={pid}>
              {/* group header */}
              <div className="mb-2 flex items-center gap-2 border-b border-foreground pb-1">
                <span className="text-sm font-bold">{processName(pid)}</span>
                <span className="text-[10px] text-muted-foreground">
                  {list.length}장
                </span>
              </div>
              <div
                className={
                  isMobile
                    ? "grid grid-cols-2 gap-2"
                    : "grid grid-cols-4 gap-3"
                }
              >
                {list.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => openModal(p)}
                    className="group flex flex-col border border-foreground/50 bg-muted/40 text-left hover:border-foreground"
                  >
                    <div className="flex aspect-[4/3] items-center justify-center border-b border-foreground/40 bg-muted text-xs text-muted-foreground">
                      <span className="rotate-0">IMG · {p.id}</span>
                    </div>
                    <div className="p-1.5">
                      <p className="truncate text-[11px] text-muted-foreground">
                        {p.date}
                      </p>
                      {p.memo && (
                        <p className="truncate text-[11px]">{p.memo}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ⑪ load more / paging */}
        <div className="mt-4 flex justify-center">
          {canLoadMore ? (
            <div className="relative">
              <Num n={11} />
              <button
                onClick={loadMore}
                className="border border-foreground px-5 py-2 text-xs hover:bg-muted"
              >
                더 보기 (무한스크롤/페이징)
              </button>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              모든 사진을 불러왔습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

/* -------------------- MODAL -------------------- */
function PhotoModal(props: {
  photo: Photo
  index: number
  total: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const { photo, index, total, onClose, onPrev, onNext } = props
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-foreground/40 p-4">
      <div className="relative w-full max-w-lg border border-foreground bg-background">
        <Num n={7} />
        <div className="flex items-center justify-between border-b border-foreground px-3 py-2">
          <span className="text-sm font-bold">사진 확대 보기</span>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center border border-foreground text-sm hover:bg-muted"
            aria-label="닫기"
          >
            ×
          </button>
        </div>
        <div className="flex items-center gap-2 p-3">
          <button
            onClick={onPrev}
            disabled={index === 0}
            className="flex h-10 w-8 shrink-0 items-center justify-center border border-foreground text-lg hover:bg-muted disabled:opacity-30"
            aria-label="이전 사진"
          >
            ‹
          </button>
          <div className="flex aspect-[4/3] flex-1 items-center justify-center border border-foreground/40 bg-muted text-sm text-muted-foreground">
            IMG · {photo.id}
          </div>
          <button
            onClick={onNext}
            disabled={index === total - 1}
            className="flex h-10 w-8 shrink-0 items-center justify-center border border-foreground text-lg hover:bg-muted disabled:opacity-30"
            aria-label="다음 사진"
          >
            ›
          </button>
        </div>
        <dl className="grid grid-cols-[80px_1fr] gap-x-3 gap-y-1 border-t border-foreground/40 px-3 py-3 text-xs">
          <dt className="text-muted-foreground">공정단계</dt>
          <dd className="font-medium">{processName(photo.processId)}</dd>
          <dt className="text-muted-foreground">촬영일시</dt>
          <dd className="font-medium">{photo.date}</dd>
          <dt className="text-muted-foreground">메모</dt>
          <dd className="font-medium">{photo.memo || "—"}</dd>
        </dl>
        <div className="border-t border-foreground/40 px-3 py-2 text-center text-[11px] text-muted-foreground">
          {index + 1} / {total}
        </div>
      </div>
    </div>
  )
}

/* -------------------- shared field label -------------------- */
function FieldLabel({
  n,
  text,
  required,
}: {
  n: number
  text: string
  required?: boolean
}) {
  return (
    <label className="mb-1 block text-xs font-medium">
      <span className="mr-1 font-mono text-muted-foreground">{n}.</span>
      {text}
      {required && <span className="ml-1 text-foreground">*</span>}
    </label>
  )
}
