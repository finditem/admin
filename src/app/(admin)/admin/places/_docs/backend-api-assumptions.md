# 장소 관리 백엔드 API 가정 명세서

2026-10-23 · @sungryeong

## 문서 목적

이 문서는 관리자용 장소 관리 기능을 만들면서 백엔드가 아직 확정하지 않은 3가지(목록 조회, 삭제 장소 조회, 트랜잭션/오류 코드)에 대해 프론트엔드 쪽에서 합리적으로 가정한 API 스펙을 적어둔 것이다. 기존 `/admin/reports`, `/admin/users/deleted` API 패턴을 그대로 따랐다.

지금은 이 가정을 기준으로 mock 데이터를 만들어 화면을 완성하고, 실제 백엔드가 확정되면 이 문서와 기획서를 함께 수정한다.

문서 안에 `Claude 결정`이라고 표시한 것은 백엔드가 아직 확정하지 않아 제가 새로 정한 가정이고, 표시가 없는 부분은 이 코드베이스의 기존 API 패턴이나 이미 확인된 문서를 그대로 따른 것이다.

## GET /admin/places (등록된 장소 목록 조회)

**인증**: ROLE_ADMIN

**요청 (Query Parameter)**

| 필드 | 타입 | 필수 | 규칙 |
| --- | --- | --- | --- |
| type | Enum | 선택 | CAFE, RESTAURANT, POPUP 중 하나, 미지정 시 전체 |
| keyword | String | 선택 | 이름 검색어 |
| size | Integer | 선택 | 기본 20, 최대 50 |
| cursor | String | 선택 | 이전 응답의 nextCursor |

`Claude 결정`: type/keyword/size/cursor 파라미터 구성과 기본값(20/50)은 새로 정했다.

**성공 응답**

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| content | Array\<PlaceSummaryForAdmin\> | 장소 목록 |
| hasNext | Boolean | 다음 페이지 존재 여부 |
| nextCursor | String | 다음 페이지 기준값, 마지막 페이지는 null |

PlaceSummaryForAdmin의 필드 구성(placeId, name, nameEn, type, address, thumbnailUrl, stationDistanceMeters, createdAt)은 `Claude 결정`이다. 정렬 기준(createdAt DESC, placeId DESC)은 공개 `/places` API의 정렬 기준과 같다.

**오류**: PLACE400-INVALID_REQUEST(type/size 유효성), PLACE401-UNAUTHORIZED, PLACE403-ADMIN_ONLY

오류 코드는 백엔드 문서에서 이미 확인된 것을 그대로 사용하여 Claude가 새로 만든 코드는 없다.

참고: 기존 `/admin/reports`, `/admin/users/deleted`의 커서 페이지네이션 구조를 그대로 따랐다.

## GET /admin/places/deleted (삭제된 장소 조회)

**인증**: ROLE_ADMIN

**요청 (Query Parameter)**

| 필드 | 타입 | 필수 | 규칙 |
| --- | --- | --- | --- |
| keyword | String | 선택 | 이름 검색어 |
| size | Integer | 선택 | 기본 20, 최대 50 |
| cursor | String | 선택 | 이전 응답의 nextCursor |

`Claude 결정`: keyword/size/cursor 파라미터 구성은 GET /admin/places와 동일하게 새로 정했다.

**성공 응답**: GET /admin/places와 같은 content/hasNext/nextCursor 구조다. PlaceSummaryForAdmin에 deletedAt 필드를 추가하고 deletedAt DESC로 정렬하는 것은 `Claude 결정`이다.

**오류**: PLACE401-UNAUTHORIZED, PLACE403-ADMIN_ONLY

오류 코드도 이미 확인된 PLACE401/403을 그대로 사용했다.

참고: 기존 `/admin/users/deleted`와 같은 구조다. 이 목록에서 placeId를 확인해 `PATCH /admin/places/{placeId}/restore`로 복구한다.

## 등록/수정 트랜잭션 및 오류 코드 정책 (가정)

이 섹션 전체가 `Claude 결정`이다 — 백엔드도 아직 정하지 않은 사항이라 합리적으로 가정했다.

장소 저장과 썸네일 저장을 하나의 단위로 본다. 둘 중 하나라도 실패하면 전송을 롤백하고 아무것도 저장하지 않는다.

예기치 못한 저장 실패는 공통 응답 형식 그대로 `COMMON500` 코드로 반환된다고 가정한다. 프론트는 이미 알고 있는 `PLACE4xx`/`PLACE409` 코드는 전용 메시지로, 그 외(`COMMON500` 포함)는 기획서에서 정한 공통 폴백 메시지로 처리한다 — 이 부분은 기획서의 결정과 동일하게 유지된다.

실제 백엔드 정책이 이와 다르면(예: 부분 저장을 허용하거나 다른 오류 코드를 쓰는 경우), 이 문서와 기획서의 완료 기준을 함께 수정한다.
