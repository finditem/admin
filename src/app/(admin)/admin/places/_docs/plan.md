# places 작업 계획

## 성수 콘텐츠 관리 화면 구현 (2026-10-25)

기획 문서(prd.md, backend-api-assumptions.md, data-dictionary.md, screen-spec.md, erd.md)는 완료되어 PR #43에 병합 대기 중. 아래는 실제 구현 체크리스트.

- [x] API 타입 정의 (`src/api/fetch/admin/types/PlaceType.ts`) — `PlaceUpsertRequest`, `PlaceManagementResult`, `WeeklySchedule`, `TimeRange`, `OperationPeriod` (2026-10-25 완료, mock용 `PlaceSummaryForAdmin` 등도 함께 정의)
- [x] 장소 등록 API 훅 (`usePostPlace`) — `POST /admin/places`, multipart(`request` JSON + `thumbnail` 바이너리) (2026-10-27 완료, FormData 조립은 폼 컴포넌트에서)
- [x] 장소 단일 조회 API 훅 (`useGetPlaceDetail`) — `GET /admin/places/{placeId}` (2026-10-27 완료)
- [x] 장소 수정 API 훅 (`usePutPlace`) — `PUT /admin/places/{placeId}` (2026-10-27 완료)
- [x] 장소 삭제 API 훅 (`useDeletePlace`) — `DELETE /admin/places/{placeId}` (2026-10-27 완료)
- [x] 장소 복구 API 훅 (`usePatchRestorePlace`) — `PATCH /admin/places/{placeId}/restore` (2026-10-27 완료)
- [x] mock 장소 목록 데이터 작성 (`src/mock/data/places.data.ts`) — `backend-api-assumptions.md`의 `GET /admin/places` 응답 구조에 맞춤 (2026-10-27 완료, 공개 API에서 실제 노출 중인 성수 콘텐츠 5건으로 작성. nameEn/createdAt만 임의값. 백엔드 실제 API 완성되면 교체)
- [x] `page.tsx` + 장소 목록 화면 (`AdminPlaceListView`) — 타입 필터, 이름 검색, 목록, "장소 등록" 버튼, 빈 상태 (2026-10-27 완료, 사이드바 메뉴에도 "성수 콘텐츠" 항목 추가. 수정/삭제 링크는 걸어뒀지만 대상 화면·모달은 다음 항목에서 만듦)
- [ ] 등록/수정 폼 (`AdminPlaceForm`) — 이름/영문이름/주소/영문주소/좌표/역/영문역명/거리/요일별 일정/팝업 운영기간/썸네일, screen-spec.md의 검증 메시지 그대로 적용
- [ ] 요일별 영업시간 입력 컴포넌트 (`WeeklyScheduleInput`) — 7일 고정, 요일당 BUSINESS 1개 이상 + BREAK_TIME 추가 가능
- [ ] 삭제 확인 모달
- [ ] 복구용 임시 입력창 (placeId 직접 입력 → restore API 호출, 전용 화면 없음)
- [ ] 에러 코드별 메시지 매핑(`PLACE4xx`/`PLACE409`) + 그 외 공통 폴백 메시지
- [ ] Jest 단위 테스트
- [ ] Playwright e2e (등록→목록 노출→수정→삭제→복구 전체 흐름, `page.route`로 API 목업)
- [ ] `pnpm test` + `pnpm build` 통과 확인

## 열린 이슈 (백엔드 작업 대기)

- [ ] 백엔드가 `GET /admin/places`(목록 조회) 제공하면 mock 데이터를 실제 API 호출로 교체
- [ ] 백엔드가 `GET /admin/places/deleted`(삭제 장소 조회) 제공하면 복구용 임시 입력창을 실제 목록 화면으로 교체
- [ ] 백엔드의 트랜잭션/오류 코드 정책이 확정되면 에러 처리 로직을 그에 맞춰 조정
