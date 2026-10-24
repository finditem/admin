"use server";

import { DbSqlActionState } from "../../_types/DbQueryType";
import {
  getMetabaseDatabaseId,
  hasMetabaseConfig,
  requestMetabase,
} from "../requestMetabase/requestMetabase";
import { verifyAdminSession } from "@/utils/verifyAdminSession/verifyAdminSession";
import { MetabaseDatasetResponse, toDbQueryResult } from "../toDbQueryResult/toDbQueryResult";

/**
 * SQL 화면에서 입력한 쿼리를 Metabase로 실행합니다.
 *
 * @remarks
 * - 서버 액션은 화면 밖에서도 호출할 수 있으므로 실행할 때마다 관리자 계정인지 다시 확인합니다.
 * - DB 계정이 읽기 전용이라 변경 쿼리는 DB가 거절하고, 30초가 넘는 쿼리는 DB가 끊습니다. Metabase는 결과를 2,000행까지만 돌려줍니다.
 * - Metabase에는 API 키 하나로 기록되므로, 누가 어떤 쿼리를 실행했는지 실행 직전에 서버 로그로 남깁니다.
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

  const session = await verifyAdminSession();
  if (session.status !== "admin") {
    return {
      status: "error",
      message: "관리자 로그인이 만료됐어요. 새로고침한 뒤 다시 실행해 주세요.",
    };
  }

  // 운영 빌드는 console.log를 지우고 warn과 error만 남기므로 감사 기록은 warn으로 남긴다.
  console.warn(
    "[db-audit]",
    JSON.stringify({ userId: session.userId, sql, executedAt: new Date().toISOString() })
  );

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
