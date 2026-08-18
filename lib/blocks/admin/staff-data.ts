export type StaffStatus = "invited" | "active"

export const STAFF_STATUS_LABEL: Record<StaffStatus, string> = {
  invited: "초대중",
  active: "활성",
}

export type Staff = {
  id: string
  name: string
  email: string
  status: StaffStatus
  assignedCount: number
  assignedProjectIds: string[]
}

export type Project = {
  id: string
  name: string
  site: string
}

/* 배정 가능한 프로젝트 목록 (더미) */
export const PROJECTS: Project[] = [
  { id: "PRJ-101", name: "역삼동 상가 리모델링", site: "서울 강남구 역삼동" },
  { id: "PRJ-102", name: "판교 아파트 34평 올수리", site: "경기 성남시 분당구" },
  { id: "PRJ-103", name: "송도 오피스 인테리어", site: "인천 연수구 송도동" },
  { id: "PRJ-104", name: "해운대 카페 시공", site: "부산 해운대구" },
  { id: "PRJ-105", name: "일산 단독주택 확장", site: "경기 고양시 일산동구" },
  { id: "PRJ-106", name: "성수동 쇼룸 구축", site: "서울 성동구 성수동" },
]

/* 소속 직원 목록 (더미) */
export const STAFF: Staff[] = [
  {
    id: "STF-001",
    name: "김현장",
    email: "hyunjang.kim@vendor.co",
    status: "active",
    assignedCount: 2,
    assignedProjectIds: ["PRJ-101", "PRJ-103"],
  },
  {
    id: "STF-002",
    name: "이시공",
    email: "sigong.lee@vendor.co",
    status: "active",
    assignedCount: 1,
    assignedProjectIds: ["PRJ-102"],
  },
  {
    id: "STF-003",
    name: "박담당",
    email: "damdang.park@vendor.co",
    status: "invited",
    assignedCount: 0,
    assignedProjectIds: [],
  },
]
