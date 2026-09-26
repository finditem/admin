/** Metabase가 동기화한 테이블의 컬럼입니다. */
export interface DbField {
  id: number;
  name: string;
  /** Metabase 타입 이름. 예: `type/Text`, `type/BigInteger` */
  baseType: string;
  isPrimaryKey: boolean;
}

/** Metabase가 동기화한 테이블입니다. */
export interface DbTable {
  id: number;
  name: string;
  fields: DbField[];
}

/** 조회 결과를 화면에 그리기 위한 형태입니다. */
export interface DbQueryResult {
  columns: string[];
  /** `columns`와 같은 순서의 Metabase 타입 이름. 예: `type/Text` */
  columnTypes: string[];
  rows: unknown[][];
}

/** 테이블 데이터 한 페이지와 전체 건수입니다. */
export interface DbTablePage extends DbQueryResult {
  totalCount: number;
}

/** 테이블 데이터 필터. 컬럼 하나에 값 하나를 건다. */
export interface DbTableFilter {
  fieldId: number;
  keyword: string;
}

/** SQL 실행 서버 액션의 결과입니다. */
export type DbSqlActionState =
  | { status: "idle" }
  | { status: "success"; result: DbQueryResult }
  | { status: "error"; message: string };
