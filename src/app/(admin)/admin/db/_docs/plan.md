# db 작업 계획

다른 팀이 운영 DB에 무엇이 있는지 어드민 안에서 직접 확인하도록, Metabase REST API를 거쳐 조회하는 화면을 만든다.

## 방식을 이렇게 정한 이유

- 어드민 서버가 DB에 직접 붙지 않는다. DB 비밀번호와 배스천 SSH 키는 Metabase에만 두고, 어드민은 Metabase API 키 하나만 서버 환경 변수로 가진다.
- Metabase 화면을 iframe으로 넣는 방식은 쓸 수 없다. Metabase가 `X-Frame-Options: DENY`를 보내고, 이를 푸는 interactive embedding은 유료 요금제에서만 된다.
- 조회는 모두 서버에서 실행한다. 페이지 요청과 SQL 실행 모두 `/users/me`로 관리자 계정인지 백엔드에 확인한 뒤에만 Metabase를 호출한다. 미들웨어는 토큰을 서명 검증 없이 디코드만 하므로 그것만으로는 DB 조회를 열어 주지 않는다.
- DB 계정은 읽기 전용(`fmi_reader`)이고 Metabase 연결에 `max_execution_time=30000`이 걸려 있어 무거운 쿼리는 30초에 끊긴다.

## 환경 변수 (서버 전용)

- `METABASE_URL`: Metabase 주소. 로컬은 `http://localhost:3100`.
- `METABASE_API_KEY`: Metabase 관리자 설정의 API 키.
- `METABASE_DATABASE_ID`: Metabase에 등록된 DB id. 로컬의 FMI 운영 DB는 2.

## 작업 항목

- [x] Metabase API 호출 공통 함수(`requestMetabase`)와 설정 확인 함수 추가
- [x] 관리자 계정 서버 검증 함수(`verifyAdminSession`) 추가
- [x] 테이블 목록 조회(`getDbTables`) 추가
- [x] 테이블 데이터 조회(`queryDbTable`): 페이지 나누기, 컬럼 필터, 전체 건수
- [x] SQL 실행 서버 액션(`runDbSqlAction`) 추가
- [x] 결과 표 컴포넌트(`DbResultTable`) 추가
- [x] 테이블 목록 컴포넌트(`DbTableList`), 테이블 검색 포함
- [x] 테이블 데이터 화면(`DbTableView`): 필터 폼, 결과 표, 페이지 이동
- [x] SQL 화면(`DbSqlPanel`)
- [x] `/admin/db` 페이지와 레이아웃, 테이블/SQL 탭
- [x] 사이드바 메뉴에 "DB 조회" 추가
- [x] `.env.example`에 환경 변수 설명 추가
- [x] 변환 로직 단위 테스트
- [ ] 로컬에서 화면 동작 확인 (API 키 발급 후)
- [x] 서비스 통계의 안내 상자(`AnalyticsNotice`)를 `/admin/_components/AdminNotice`로 올려 DB 조회와 함께 쓰도록 변경
- [x] SQL 입력창에 SQL 문법 색상 넣기 (CodeMirror)
- [x] 테이블/SQL 탭과 테이블 목록을 스크롤해도 고정되게 변경, 목록 스크롤바 숨김
- [x] 테이블 목록 접기/펼치기 버튼 추가
- [x] SQL 입력창에서 ⌘+Enter(Ctrl+Enter)로 실행
- [x] SQL 입력창에 테이블·컬럼 이름 자동완성
- [x] 조회 결과 CSV 다운로드
- [x] 값을 눌러 전체 값 보기(모달), 결과 표 머리글에 컬럼 타입 표시
- [x] 테이블 목록 조회를 10분 캐시해 Metabase 호출 줄이기 (Vercel에서 터널로 Metabase를 부를 때 무료 한도 대비)
- [ ] Vercel 배포 환경에서 터널 주소로 Metabase 연결 확인
