export type MilestoneStatus = "pending" | "done"

export type Milestone = {
  id: string
  name: string
  amount: number
  dueDate: string // YYYY-MM-DD, "" if none
  status: MilestoneStatus
  confirmedDate: string // YYYY-MM-DD, "" if pending
  memo: string
}

export const INITIAL_MILESTONES: Milestone[] = [
  {
    id: "m1",
    name: "계약금",
    amount: 5_000_000,
    dueDate: "2026-07-01",
    status: "done",
    confirmedDate: "2026-07-01",
    memo: "계약 당일 현금 입금 확인",
  },
  {
    id: "m2",
    name: "중도금 1차",
    amount: 12_000_000,
    dueDate: "2026-07-15",
    status: "done",
    confirmedDate: "2026-07-16",
    memo: "",
  },
  {
    id: "m3",
    name: "중도금 2차",
    amount: 12_000_000,
    dueDate: "2026-08-05",
    status: "pending",
    confirmedDate: "",
    memo: "",
  },
  {
    id: "m4",
    name: "잔금",
    amount: 6_000_000,
    dueDate: "2026-08-25",
    status: "pending",
    confirmedDate: "",
    memo: "",
  },
]

export const won = (n: number) => n.toLocaleString("ko-KR") + "원"

export const todayDate = () => {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}
