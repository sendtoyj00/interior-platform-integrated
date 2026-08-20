# 인테리어 견적·시공관리 플랫폼 — 화면 설계서 통합 프리뷰

https://interior-platform-integrated.vercel.app/

## 실행 방법

```bash
npm install
npm run dev
# http://localhost:3000
```

프로덕션 빌드:

```bash
npm run build
npm run start
```

## 통합 내용

### 1) 메뉴 통합
- `components/shell/app-sidebar.tsx` — 카테고리(인증/계정관리, 업체관리, 고객문의관리, 견적관리,
  계약관리, 시공관리, 결제관리, 알림관리, 대시보드, 확장검토) 기준으로 전체 20개 화면을 탐색할 수 있는
  단일 사이드바.
- `/screens` — 검색/역할 필터가 있는 전체 화면 목록 페이지.
- `lib/screen-registry.ts` — 20개 화면의 메타데이터(대상 역할, 관련 요구사항 ID, 화면 경로, 이동
  화면 제안 등)를 관리하는 단일 소스.

### 2) 디자인 통합
- `components/frame/device-preview.tsx` — 6개 프로젝트마다 제각각이던 프레임 컴포넌트를 데스크톱
  (1920px, 브라우저 크롬) / 모바일(360px, 기기 노치) 톤앤매너로 통일한 공용 컴포넌트.
- 공용 `app/globals.css`(그레이스케일 shadcn 테마), 공용 `components/ui/button.tsx`, `lib/utils.ts`.
- `components/frame/screen-page-chrome.tsx` — SCR ID/카테고리/대상 역할/요구사항 ID 배지, 관련 화면
  바로가기 패널을 모든 화면에 동일하게 적용.

### 3) 기능 흐름 통합
- 로그인(SCR-AUTH-003) 성공 시 역할별 기본 화면으로 **실제 라우팅** 이동
  (업체관리자→SCR-DASH-001 / 현장담당자→SCR-PROC-001 / 고객→SCR-DASH-002 / 플랫폼관리자→SCR-COMP-001)
- 문의 처리 관리(SCR-INQ-002)에서 "견적서 작성하기" 선택 시 SCR-QUOTE-001로 **실제 이동**
- 업체 대시보드(SCR-DASH-001) 리스트 행 클릭 → SCR-PROC-001 **실제 이동**,
  빈 상태 "문의 확인하러 가기" → SCR-INQ-002 **실제 이동**
- 그 외 문서상 "이동 화면(제안)" 전체는 각 화면 하단 "관련 화면 바로가기" 패널 및 `/flow`
  화면 흐름도 페이지에서 실제 링크로 연결

## 폴더 구조

```
app/
  layout.tsx            루트 레이아웃 (AppShell 적용)
  page.tsx               홈 (역할별 빠른시작 + 카테고리 요약)
  screens/page.tsx        전체 화면 목록
  screens/[slug]/page.tsx  화면별 상세 (동적 라우트)
  flow/page.tsx           화면 흐름도
components/
  shell/                 헤더/사이드바/푸터/전역 셸/역할 컨텍스트
  frame/                 공용 디바이스 프리뷰, 화면 페이지 공통 크롬
  screen-pages/           20개 화면별 어댑터 (원본 컴포넌트 + 토글 상태 + 라우팅 연결)
  blocks/                원본 6개 프로젝트에서 가져온 화면 구현체 (도메인별 네임스페이스)
    auth/       SCR-AUTH-001~004 (1-4)
    admin/      SCR-AUTH-005, SCR-COMP-001~002 (5-7)
    inquiry/    SCR-INQ-001~002, SCR-QUOTE-001 (8-10)
    dealflow/   SCR-QUOTE-002, SCR-CONT-001, SCR-PROC-001 (11-13)
    ops/        SCR-PROC-002, SCR-PAY-001~002, SCR-NOTI-001 (14-17)
    platform/   SCR-DASH-001~002, SCR-EXT-001 (18-20)
lib/
  screen-registry.ts     20개 화면 메타데이터 단일 소스
  roles.ts               역할/카테고리 라벨 정의
  blocks/                각 화면의 목업 데이터 (도메인별 네임스페이스)
```

## 참고
- 실제 API 연동 없이 목업 데이터로 인터랙션만 구현되어 있습니다.
- 접근권한(RBAC)의 최종 강제는 백엔드 JWT 클레임 검증에서 이루어지며, 사이드바의 "현재 역할 화면만
  보기" 필터는 화면 설계 확인용 UI입니다.
