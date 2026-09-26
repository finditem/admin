"use server";

import { DbSqlActionState } from "../../_types/DbQueryType";
import {
  getMetabaseDatabaseId,
  hasMetabaseConfig,
  requestMetabase,
} from "../requestMetabase/requestMetabase";
import { MetabaseDatasetResponse, toDbQueryResult } from "../toDbQueryResult/toDbQueryResult";
import { verifyAdminSession } from "../verifyAdminSession/verifyAdminSession";

/**
 * SQL 화면에서 입력한 쿼리를 Metabase로 실행합니다.
 *
 * @remarks
 * - 서버 액션은 화면 밖에서도 호출할 수 있으므로 실행할 때마다 관리자 계정인지 다시 확인합니다.
 * - DB 계정이 읽기 전용이라 변경 쿼리는 DB가 거절하고, 30초가 넘는 쿼리는 DB가 끊습니다. Metabase는 결과를 2,000행까지만 돌려줍니다.
 */
export const runDbSqlAction = async (
  _prevState: DbSqlActionState,
  formData: FormData
): Promise<DbSqlActionState> => {
  const sql = String(formData.get("sql") ?? "").trim();
  if (!sql) return { status: "error", message: "실행할 SQL을 입력해 주세요." };

  if (!hasMetabaseConfig()) {
    return { status: "error", message: "Metabase 연결 설정이 없어요." };
  }

  if (!(await verifyAdminSession())) {
    return {
      status: "error",
      message: "관리자 로그인이 만료됐어요. 새로고침한 뒤 다시 실행해 주세요.",
    };
  }

  try {
    const response = await requestMetabase<MetabaseDatasetResponse>("/dataset", {
      database: getMetabaseDatabaseId(),
      type: "native",
      native: { query: sql },
    });
    return { status: "success", result: toDbQueryResult(response) };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : String(error) };
  }
};
