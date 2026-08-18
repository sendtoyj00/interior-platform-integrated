export function AppFooter() {
  return (
    <footer className="border-t border-foreground/15 bg-background px-4 py-3 text-[11px] text-muted-foreground">
      <p>
        ※ 본 프리뷰는 화면 설계서(20개 SCR)를 하나의 프로젝트로 통합한 그레이스케일 와이어프레임입니다. 실제
        API 연동 없이 목업 데이터/더미 상태로 인터랙션만 구현되어 있습니다. (REQ-NFR-006 반응형, REQ-NFR-002
        접근제어는 백엔드 JWT 클레임 검증에서 최종 강제됩니다.)
      </p>
    </footer>
  )
}
