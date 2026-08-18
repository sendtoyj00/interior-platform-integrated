// 목업 데이터 (실제 API 연동 없음)

export type StageKey = "contract" | "demolition" | "framing" | "finishing" | "handover"

export type Stage = {
  key: StageKey
  label: string
  count: number
  /** 회색 톤 그라데이션 채움값 (0=밝음 ~ 1=어두움) */
  tone: string
}

export const STAGES: Stage[] = [
  { key: "contract", label: "계약·실측", count: 4, tone: "var(--chart-1)" },
  { key: "demolition", label: "철거·설비", count: 3, tone: "var(--chart-2)" },
  { key: "framing", label: "목공·전기", count: 6, tone: "var(--chart-3)" },
  { key: "finishing", label: "마감·도장", count: 2, tone: "var(--chart-4)" },
  { key: "handover", label: "준공·검수", count: 1, tone: "var(--chart-5)" },
]

export type Project = {
  id: string
  name: string
  customer: string
  stage: StageKey
  progress: number
  updatedAt: string
}

export const PROJECTS: Project[] = [
  { id: "PRJ-2041", name: "역삼 오피스 리모델링", customer: "김도현", stage: "framing", progress: 62, updatedAt: "2026-08-17" },
  { id: "PRJ-2038", name: "판교 카페 인테리어", customer: "이수민", stage: "finishing", progress: 88, updatedAt: "2026-08-18" },
  { id: "PRJ-2035", name: "마포 아파트 34평", customer: "박준영", stage: "contract", progress: 12, updatedAt: "2026-08-15" },
  { id: "PRJ-2031", name: "성수 쇼룸 신축", customer: "최은지", stage: "demolition", progress: 34, updatedAt: "2026-08-16" },
  { id: "PRJ-2028", name: "잠실 주택 단독", customer: "정하늘", stage: "framing", progress: 55, updatedAt: "2026-08-14" },
  { id: "PRJ-2024", name: "분당 상가 확장", customer: "한지우", stage: "handover", progress: 97, updatedAt: "2026-08-18" },
  { id: "PRJ-2019", name: "용산 사무실 파티션", customer: "오세훈", stage: "contract", progress: 8, updatedAt: "2026-08-13" },
]

export const SUMMARY = {
  ongoing: PROJECTS.length,
  inquiries: 5,
  pendingQuotes: 3,
  paidThisMonth: 48250000,
}

export const NAV = [
  { key: "dashboard", label: "대시보드" },
  { key: "process", label: "공정 관리" },
  { key: "quotes", label: "견적 관리" },
  { key: "inquiries", label: "문의 관리" },
  { key: "billing", label: "결제·정산" },
  { key: "settings", label: "설정" },
]

export function stageLabel(key: StageKey) {
  return STAGES.find((s) => s.key === key)?.label ?? key
}

/* ── 고객 마이페이지 (프로젝트 통합 조회) 목업 ────────────────────── */

export type TabKey = "quote" | "contract" | "process" | "payment" | "photo"

export const CUSTOMER_TABS: { key: TabKey; label: string; scr: string }[] = [
  { key: "quote", label: "견적", scr: "SCR-QUOTE-002" },
  { key: "contract", label: "계약", scr: "SCR-CONT-001" },
  { key: "process", label: "공정", scr: "SCR-PROC-001" },
  { key: "payment", label: "결제", scr: "SCR-PAY-002" },
  { key: "photo", label: "사진", scr: "SCR-PROC-002" },
]

export const CUSTOMER_PROJECT = {
  vendor: "무드하우스 인테리어",
  projectName: "역삼 오피스 리모델링",
  currentStage: "목공·전기",
  progress: 62,
}

export const QUOTE_SUMMARY = {
  quoteNo: "Q-2026-0417",
  issuedAt: "2026-07-28",
  validUntil: "2026-08-27",
  total: 42800000,
  items: [
    { name: "철거·폐기물", amount: 3200000 },
    { name: "목공·가벽", amount: 11800000 },
    { name: "전기·조명", amount: 7400000 },
    { name: "마감·도장", amount: 9600000 },
    { name: "기타·관리비", amount: 10800000 },
  ],
}

export const CONTRACT_SUMMARY = {
  status: "체결" as "계약대기" | "체결" | "완료",
  contractNo: "C-2026-0221",
  signedAt: "2026-08-01",
  amount: 42800000,
  period: "2026-08-05 ~ 2026-09-20",
  downPayment: "계약금 30% 입금 완료",
}

export const PROCESS_TIMELINE: { key: StageKey; label: string; date: string; state: "done" | "active" | "todo" }[] = [
  { key: "contract", label: "계약·실측", date: "2026-08-05", state: "done" },
  { key: "demolition", label: "철거·설비", date: "2026-08-11", state: "done" },
  { key: "framing", label: "목공·전기", date: "2026-08-17", state: "active" },
  { key: "finishing", label: "마감·도장", date: "예정 2026-09-05", state: "todo" },
  { key: "handover", label: "준공·검수", date: "예정 2026-09-20", state: "todo" },
]

export const PAYMENT_HISTORY: { label: string; date: string; amount: number; state: "완료" | "예정" }[] = [
  { label: "계약금 (30%)", date: "2026-08-01", amount: 12840000, state: "완료" },
  { label: "중도금 (40%)", date: "2026-08-18", amount: 17120000, state: "완료" },
  { label: "잔금 (30%)", date: "예정 2026-09-20", amount: 12840000, state: "예정" },
]

export const PHOTO_GALLERY: { id: string; stage: string; date: string; tone: number }[] = [
  { id: "IMG-01", stage: "철거 현장", date: "08-11", tone: 0.15 },
  { id: "IMG-02", stage: "설비 배관", date: "08-13", tone: 0.3 },
  { id: "IMG-03", stage: "목공 가벽", date: "08-15", tone: 0.45 },
  { id: "IMG-04", stage: "전기 배선", date: "08-16", tone: 0.25 },
  { id: "IMG-05", stage: "조명 설치", date: "08-17", tone: 0.55 },
  { id: "IMG-06", stage: "현장 정리", date: "08-17", tone: 0.4 },
]

export function krw(n: number) {
  return n.toLocaleString("ko-KR") + "원"
}

/* ── 문의 자동분류 결과 확인 (규칙/통계 기반, AI/LLM 아님) 목업 ────── */

export type Confidence = "상" | "중" | "하"

// 사용 가능한 태그 목록
export const SPACE_TAGS = ["아파트", "주택", "상가", "사무실", "카페"]
export const BUDGET_TAGS = ["3천 이하", "3천~7천", "7천~1.5억", "1.5억 이상"]

// 키워드 → 태그 매핑 규칙 (초기값)
export type ClassifyRule = { id: string; keyword: string; tag: string; type: "공간유형" | "예산대" }
export const CLASSIFY_RULES: ClassifyRule[] = [
  { id: "R1", keyword: "아파트, 34평, 방3", tag: "아파트", type: "공간유형" },
  { id: "R2", keyword: "상가, 매장, 점포", tag: "상가", type: "공간유형" },
  { id: "R3", keyword: "사무실, 오피스, 사옥", tag: "사무실", type: "공간유형" },
  { id: "R4", keyword: "카페, 커피, 베이커리", tag: "카페", type: "공간유형" },
  { id: "R5", keyword: "5천, 6천, 7천만", tag: "3천~7천", type: "예산대" },
  { id: "R6", keyword: "1억, 1.2억, 8천", tag: "7천~1.5억", type: "예산대" },
]

export type Inquiry = {
  id: string
  customer: string
  summary: string
  spaceTag: string | null // null = 미분류
  budgetTag: string | null
  confidence: Confidence
  spaceRules: string[] // 공간유형 태그 매칭 규칙 id
  budgetRules: string[] // 예산대 태그 매칭 규칙 id
  corrected?: boolean
}

export const INQUIRIES: Inquiry[] = [
  {
    id: "INQ-1042",
    customer: "김서연",
    summary: "34평 아파트 전체 리모델링 문의, 예산 6천만원 정도 생각중",
    spaceTag: "아파트",
    budgetTag: "3천~7천",
    confidence: "상",
    spaceRules: ["R1"],
    budgetRules: ["R5"],
  },
  {
    id: "INQ-1041",
    customer: "박준호",
    summary: "강남 상가 매장 인테리어, 예산은 아직 미정입니다",
    spaceTag: "상가",
    budgetTag: null,
    confidence: "중",
    spaceRules: ["R2"],
    budgetRules: [],
  },
  {
    id: "INQ-1040",
    customer: "이하나",
    summary: "작은 카페 오픈 준비중, 8천만원 예산으로 커피 매장 꾸미고 싶어요",
    spaceTag: "카페",
    budgetTag: "7천~1.5억",
    confidence: "상",
    spaceRules: ["R4"],
    budgetRules: ["R6"],
  },
  {
    id: "INQ-1039",
    customer: "정우성",
    summary: "사옥 3층 사무공간 부분 개선 검토",
    spaceTag: "사무실",
    budgetTag: null,
    confidence: "하",
    spaceRules: ["R3"],
    budgetRules: [],
  },
  {
    id: "INQ-1038",
    customer: "최민지",
    summary: "인테리어 관련해서 상담 가능할까요? 자세한건 통화로",
    spaceTag: null,
    budgetTag: null,
    confidence: "하",
    spaceRules: [],
    budgetRules: [],
  },
]

export function ruleById(id: string) {
  return CLASSIFY_RULES.find((x) => x.id === id)
}
