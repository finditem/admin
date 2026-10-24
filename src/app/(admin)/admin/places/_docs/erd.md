# 성수 콘텐츠 데이터 구조 (ERD)

2026-10-24

Swagger 응답/요청 모델로 역추론한 구조다. 실제 DB 테이블명과 PK/FK 전략은 백엔드 코드 확인이 필요하다. 필드별 상세는 [데이터 정의서](./data-dictionary.md)를 참고한다.

```mermaid
erDiagram
    PLACE ||--o{ WEEKLY_SCHEDULE : "요일별 1개씩 (7)"
    WEEKLY_SCHEDULE ||--o{ TIME_RANGE : "영업/브레이크 구간"
    PLACE ||--o{ PLACE_FAVORITE : "찜한 유저"
    USER ||--o{ PLACE_FAVORITE : "찜"

    PLACE {
        bigint placeId PK
        string type "CAFE/RESTAURANT/POPUP"
        string name
        string nameEn
        string address
        string addressEn
        double latitude
        double longitude
        string station
        string stationEn
        int stationDistanceMeters
        string thumbnailUrl
        date operationStartDate
        date operationEndDate
    }
    WEEKLY_SCHEDULE {
        bigint placeId FK
        string dayOfWeek "MON..SUN"
        boolean isClosed
    }
    TIME_RANGE {
        string type "BUSINESS/BREAK_TIME"
        time startTime
        time endTime
    }
    PLACE_FAVORITE {
        bigint userId FK
        bigint placeId FK
        datetime favoriteUpdatedAt
    }
    USER {
        bigint userId PK
    }
```

장소 1건은 요일별 스케줄 7개를 갖고, 각 스케줄이 영업/브레이크 시간대를 N개 가진다. 찜은 유저-장소 다대다 관계다.
