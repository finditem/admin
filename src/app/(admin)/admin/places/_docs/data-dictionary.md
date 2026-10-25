# 성수 콘텐츠 데이터 정의서

2026-10-24

Swagger 응답/요청 모델을 역추론한 구조다. PK/FK 네이밍, 정규화 방식, 타임스탬프 컬럼 등은 실제 백엔드 구현과 다를 수 있다. 전체 구조 그림은 [ERD](./erd.md)를 참고한다.

## PLACE (장소)

| 필드 | 타입 | nullable | 설명 |
| --- | --- | --- | --- |
| placeId | bigint | 아니요 | PK |
| type | enum | 아니요 | CAFE / RESTAURANT / POPUP, 등록 후 변경 불가 |
| name | string | 아니요 | 최대 50자 |
| nameEn | string | 예 | 미등록 시 null |
| address | string | 아니요 | 최대 255자 |
| addressEn | string | 예 | 미등록 시 null |
| latitude | double | 아니요 | -90 이상 90 이하 |
| longitude | double | 아니요 | -180 이상 180 이하 |
| station | string | 아니요 | 최대 100자 |
| stationEn | string | 예 | 미등록 시 null |
| stationDistanceMeters | int | 아니요 | 역까지 거리(m), 0 이상 |
| thumbnailUrl | string | 아니요 | 목록/상세 썸네일 |
| operationStartDate | date | 예 | type=POPUP일 때만 사용 |
| operationEndDate | date | 예 | type=POPUP일 때만 사용 |

## WEEKLY_SCHEDULE (요일별 영업 일정)

장소 1건당 정확히 7행(요일별 1개씩)을 가진다.

| 필드 | 타입 | nullable | 설명 |
| --- | --- | --- | --- |
| placeId | bigint | 아니요 | FK → PLACE |
| dayOfWeek | enum | 아니요 | MONDAY ~ SUNDAY |
| isClosed | boolean | 아니요 | 해당 요일 정기 휴무 여부 |

## TIME_RANGE (영업/브레이크 시간대)

요일별 일정 1건이 영업·브레이크 구간을 N개 가진다. 요일당 BUSINESS 구간이 1개 이상 필요하다.

| 필드 | 타입 | nullable | 설명 |
| --- | --- | --- | --- |
| weeklyScheduleId | bigint | 아니요 | FK → WEEKLY_SCHEDULE (추정) |
| type | enum | 아니요 | BUSINESS / BREAK_TIME |
| startTime | time | 아니요 | HH:mm |
| endTime | time | 아니요 | HH:mm |

## PLACE_FAVORITE (찜)

사용자-장소 다대다 관계다.

| 필드 | 타입 | nullable | 설명 |
| --- | --- | --- | --- |
| userId | bigint | 아니요 | FK → USER |
| placeId | bigint | 아니요 | FK → PLACE |
| favoriteUpdatedAt | datetime | 아니요 | 찜 목록 커서 페이지네이션 기준 |

## 조회 시점 계산 값 (별도 컬럼 아님)

아래 값은 PLACE·WEEKLY_SCHEDULE·PLACE_FAVORITE를 현재 시각/로그인 유저 기준으로 조합해 응답 시점에 계산하는 것으로 추정된다.

- `operationStatus`: OPEN / BREAK_TIME / UPCOMING / CLOSED
- `isFavorite`: 로그인 사용자의 찜 여부
- `todayBusinessHours`: 조회일의 영업시간

지도 마커(`PlaceMarker`)도 PLACE의 위경도/타입/썸네일만 뽑은 투영일 뿐 별도 테이블은 아닐 가능성이 높다.
