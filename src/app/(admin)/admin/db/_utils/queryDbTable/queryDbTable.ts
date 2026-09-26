import "server-only";
import { DbTable, DbTableFilter, DbTablePage } from "../../_types/DbQueryType";
import { buildTableQuery } from "../buildTableQuery/buildTableQuery";
import { getMetabaseDatabaseId, requestMetabase } from "../requestMetabase/requestMetabase";
import { MetabaseDatasetResponse, toDbQueryResult } from "../toDbQueryResult/toDbQueryResult";

/** 테이블 데이터 한 페이지와 조건에 맞는 전체 건수를 함께 가져옵니다. */
export const queryDbTable = async (
  table: DbTable,
  options: { page: number; filter?: DbTableFilter }
): Promise<DbTablePage> => {
  const { rowsQuery, countQuery } = buildTableQuery(table, options);
  const database = getMetabaseDatabaseId();

  const [rowsResponse, countResponse] = await Promise.all([
    requestMetabase<MetabaseDatasetResponse>("/dataset", {
      database,
      type: "query",
      query: rowsQuery,
    }),
    requestMetabase<MetabaseDatasetResponse>("/dataset", {
      database,
      type: "query",
      query: countQuery,
    }),
  ]);

  return {
    ...toDbQueryResult(rowsResponse),
    totalCount: Number(countResponse.data.rows[0]?.[0] ?? 0),
  };
};
