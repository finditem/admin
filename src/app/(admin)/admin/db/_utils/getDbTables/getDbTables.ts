import "server-only";
import { unstable_cache } from "next/cache";
import { DbTable } from "../../_types/DbQueryType";
import { getMetabaseDatabaseId, requestMetabase } from "../requestMetabase/requestMetabase";

interface MetabaseMetadataResponse {
  tables: {
    id: number;
    name: string;
    fields: {
      id: number;
      name: string;
      base_type: string;
      semantic_type: string | null;
      visibility_type: string;
    }[];
  }[];
}

const requestDbTables = async (): Promise<DbTable[]> => {
  const { tables } = await requestMetabase<MetabaseMetadataResponse>(
    `/database/${getMetabaseDatabaseId()}/metadata`
  );

  return tables
    .map((table) => ({
      id: table.id,
      name: table.name,
      fields: table.fields
        .filter((field) => field.visibility_type !== "sensitive")
        .map((field) => ({
          id: field.id,
          name: field.name,
          baseType: field.base_type,
          isPrimaryKey: field.semantic_type === "type/PK",
        })),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Metabase가 동기화한 테이블과 컬럼 목록을 이름순으로 가져옵니다.
 *
 * @remarks
 * - Metabase에서 숨김 처리한 테이블은 응답에 오지 않고, 민감 정보로 지정한 컬럼은 여기서 뺍니다.
 * - 테이블 구조는 자주 바뀌지 않으므로 10분 동안 캐시해 Metabase 호출을 줄입니다.
 */
export const getDbTables = unstable_cache(requestDbTables, ["admin-db-tables-v1"], {
  revalidate: 600,
});
