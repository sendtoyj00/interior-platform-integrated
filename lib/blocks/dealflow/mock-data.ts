export type QuoteStatus = "pending" | "approved" | "rejected"

export type Role = "customer" | "admin"

export interface QuoteLineItem {
  id: string
  name: string
  spec: string
  qty: number
  unitPrice: number
}

export interface QuoteHistoryItem {
  version: string
  updatedAt: string
  updatedBy: string
  summary: string
  items: QuoteLineItem[]
  total: number
}

export const quoteLineItems: QuoteLineItem[] = [
  { id: "L1", name: "거실 바닥 마루 시공", spec: "강마루 / 12평", qty: 12, unitPrice: 85000 },
  { id: "L2", name: "주방 상·하부장 교체", spec: "PET 도어 / 2.4m", qty: 1, unitPrice: 1850000 },
  { id: "L3", name: "도배 (전체)", spec: "실크 벽지 / 24평", qty: 24, unitPrice: 42000 },
  { id: "L4", name: "욕실 리모델링", spec: "타일+위생도기 / 1개소", qty: 1, unitPrice: 2350000 },
  { id: "L5", name: "전등·스위치 교체", spec: "LED 일괄", qty: 1, unitPrice: 380000 },
]

export const quoteTotal = quoteLineItems.reduce((sum, i) => sum + i.qty * i.unitPrice, 0)

export const quoteHistory: QuoteHistoryItem[] = [
  {
    version: "v1.0",
    updatedAt: "2026-08-10 14:22",
    updatedBy: "김실장 (업체)",
    summary: "최초 견적서 발행",
    items: quoteLineItems.slice(0, 4),
    total: quoteLineItems.slice(0, 4).reduce((s, i) => s + i.qty * i.unitPrice, 0),
  },
  {
    version: "v1.1",
    updatedAt: "2026-08-12 09:40",
    updatedBy: "김실장 (업체)",
    summary: "도배 단가 조정 (45,000 → 42,000)",
    items: quoteLineItems.slice(0, 4),
    total: quoteLineItems.slice(0, 4).reduce((s, i) => s + i.qty * i.unitPrice, 0) - 72000,
  },
  {
    version: "v1.2",
    updatedAt: "2026-08-14 16:05",
    updatedBy: "김실장 (업체)",
    summary: "전등·스위치 교체 항목 추가",
    items: quoteLineItems,
    total: quoteTotal,
  },
]

export function formatKRW(value: number): string {
  return value.toLocaleString("ko-KR") + "원"
}

/* ===== 계약서 생성/관리 화면용 목업 ===== */

export type ContractStatus = "waiting" | "signed" | "completed"

export const CONTRACT_STATUS_LABEL: Record<ContractStatus, string> = {
  waiting: "계약대기",
  signed: "체결",
  completed: "완료",
}

export interface ContractHistoryItem {
  id: string
  changedBy: string
  changedAt: string
  from: ContractStatus | null
  to: ContractStatus
}

export const initialContractHistory: ContractHistoryItem[] = [
  {
    id: "CH1",
    changedBy: "시스템 (견적 승인)",
    changedAt: "2026-08-14 16:20",
    from: null,
    to: "waiting",
  },
]

export const contractMeta = {
  contractNo: "CONT-20260814-007",
  quoteNo: "EST-20260814-012",
  projectName: "우리집 인테리어",
  customerName: "박고객",
  vendorName: "리빙플러스 인테리어",
  createdAt: "2026-08-14 16:20",
}

/* ===== 현장 공정 관리 화면용 목업 ===== */

export type ProcessStatus = "todo" | "doing" | "done"

export const PROCESS_STATUS_LABEL: Record<ProcessStatus, string> = {
  todo: "예정",
  doing: "진행중",
  done: "완료",
}

export interface ProcessStep {
  id: string
  name: string
  progress: number // 0~100
  dueDate: string // YYYY-MM-DD
  status: ProcessStatus
  delayed: boolean
  delayReason?: string
  delayDuration?: string
}

export const projectStartDate = "2026-08-15"

// ① 공정 템플릿 적용 시 사용할 표준 공정 목록
export const processTemplate: { id: string; name: string; defaultDue: string }[] = [
  { id: "T1", name: "철거", defaultDue: "2026-08-18" },
  { id: "T2", name: "설비 (전기/배관)", defaultDue: "2026-08-23" },
  { id: "T3", name: "목공", defaultDue: "2026-08-28" },
  { id: "T4", name: "타일", defaultDue: "2026-09-02" },
  { id: "T5", name: "도배/바닥", defaultDue: "2026-09-08" },
  { id: "T6", name: "마감/청소", defaultDue: "2026-09-12" },
]

export const initialProcessSteps: ProcessStep[] = [
  {
    id: "P1",
    name: "철거",
    progress: 100,
    dueDate: "2026-08-18",
    status: "done",
    delayed: false,
  },
  {
    id: "P2",
    name: "설비 (전기/배관)",
    progress: 60,
    dueDate: "2026-08-23",
    status: "doing",
    delayed: false,
  },
  {
    id: "P3",
    name: "목공",
    progress: 0,
    dueDate: "2026-08-28",
    status: "todo",
    delayed: false,
  },
]

export function progressToStatus(progress: number): ProcessStatus {
  if (progress >= 100) return "done"
  if (progress > 0) return "doing"
  return "todo"
}
