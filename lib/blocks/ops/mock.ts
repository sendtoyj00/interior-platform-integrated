export type Process = {
  id: string
  name: string
}

export type Photo = {
  id: string
  processId: string
  date: string // YYYY-MM-DD HH:mm
  memo: string
}

export const PROCESSES: Process[] = [
  { id: "p1", name: "01. 철거" },
  { id: "p2", name: "02. 설비/배관" },
  { id: "p3", name: "03. 전기공사" },
  { id: "p4", name: "04. 목공" },
  { id: "p5", name: "05. 타일" },
  { id: "p6", name: "06. 도장/도배" },
  { id: "p7", name: "07. 마루" },
  { id: "p8", name: "08. 준공청소" },
]

export const processName = (id: string) =>
  PROCESSES.find((p) => p.id === id)?.name ?? "미분류"

export const INITIAL_PHOTOS: Photo[] = [
  { id: "img-01", processId: "p1", date: "2026-07-02 09:12", memo: "기존 벽체 철거 전 상태" },
  { id: "img-02", processId: "p1", date: "2026-07-02 14:40", memo: "철거 완료 후 현장 정리" },
  { id: "img-03", processId: "p2", date: "2026-07-05 10:05", memo: "온수 배관 이설 작업" },
  { id: "img-04", processId: "p2", date: "2026-07-05 16:20", memo: "" },
  { id: "img-05", processId: "p3", date: "2026-07-08 11:30", memo: "분전반 위치 확정" },
  { id: "img-06", processId: "p3", date: "2026-07-09 09:50", memo: "콘센트 배선 매립" },
  { id: "img-07", processId: "p4", date: "2026-07-12 13:15", memo: "천장 목공 골조" },
  { id: "img-08", processId: "p4", date: "2026-07-13 15:00", memo: "가벽 시공" },
  { id: "img-09", processId: "p5", date: "2026-07-16 10:40", memo: "주방 벽타일 시공" },
  { id: "img-10", processId: "p5", date: "2026-07-17 12:10", memo: "욕실 바닥 타일" },
  { id: "img-11", processId: "p6", date: "2026-07-20 09:00", memo: "천장 도장 1차" },
  { id: "img-12", processId: "p6", date: "2026-07-21 17:25", memo: "도배 마감 확인" },
]

export const todayString = () => {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}
