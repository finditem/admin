import { DbQueryResult } from "../../_types/DbQueryType";

/** Metabase `/api/dataset` 응답에서 쓰는 부분입니다. */
export interface MetabaseDatasetResponse {
  data: {
    cols: { name: string; base_type: string }[];
    rows: unknown[][];
  };
}

/** Metabase 조회 응답을 화면용 컬럼 이름과 행으로 바꿉니다. */
export const toDbQueryResult = ({ data }: MetabaseDatasetResponse): DbQueryResult => ({
  columns: data.cols.map((col) => col.name),
  columnTypes: data.cols.map((col) => col.base_type),
  rows: data.rows,
});
