# admin 작업 계획

## 사이드바 바로가기와 섹션 접기

- [x] `ADMIN_NAV_SECTIONS`에 바로가기 섹션 추가 (찾아줘! 서비스, GitHub, 일정관리, 외부 API 모니터링)
- [x] `AdminMenuSection`에서 `external` 항목을 새 탭으로 열고 스크린리더에 새 탭 안내 추가
- [x] 접힌 섹션 id 목록을 localStorage에 저장하고 읽는 `_hooks/useCollapsedNavSections` 훅 추가
- [x] `AdminMenuSection`의 섹션 제목을 접기/펼치기 버튼으로 바꾸고 접힌 섹션의 목록 숨김
- [x] `AdminMenuSection` 테스트에 접기/펼치기와 localStorage 기억 케이스 추가
- [x] 새로고침 직후 접힌 섹션이 잠깐 보이는 문제: 본문보다 먼저 도는 `AdminNavCollapsedScript`로 레이아웃에 접힘 속성을 달고 CSS로 미리 숨김

접기 상태는 사이드바와 PC 미만 `/admin` 메인이 같은 `AdminMenuSection`을 쓰므로 두 화면에 함께 적용된다. 서버 렌더에서는 localStorage를 읽을 수 없어 모두 펼친 상태로 그린다. 처음에는 하이드레이션 뒤에 접히게 두었더니 새로고침마다 접힌 섹션이 잠깐 보였다. 그래서 레이아웃에 인라인 스크립트를 넣어 화면을 그리기 전에 접힘 상태를 속성으로 달고, 섹션 id별 CSS가 목록을 숨기게 했다.
