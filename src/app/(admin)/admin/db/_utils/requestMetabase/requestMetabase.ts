import "server-only";

/** Metabase 조회에 필요한 서버 env가 모두 있는지 확인합니다. API 키가 브라우저로 내려가지 않도록 `NEXT_PUBLIC_`을 붙이지 않습니다. */
export const hasMetabaseConfig = () =>
  Boolean(
    process.env.METABASE_URL && process.env.METABASE_API_KEY && process.env.METABASE_DATABASE_ID
  );

export const getMetabaseDatabaseId = () => Number(process.env.METABASE_DATABASE_ID);

/** Metabase가 쿼리 실패를 알려 주는 응답의 일부입니다. */
interface MetabaseErrorBody {
  status?: string;
  error?: string;
  message?: string;
}

/**
 * Metabase REST API를 API 키로 호출합니다.
 *
 * @remarks
 * - 쿼리 오류는 HTTP 400이나 `status: "failed"`로 오므로 둘 다 Metabase가 준 메시지를 담아 던집니다.
 * - DB 내용은 매번 새로 봐야 하므로 캐시하지 않습니다.
 */
export const requestMetabase = async <T>(path: string, body?: unknown): Promise<T> => {
  const baseUrl = process.env.METABASE_URL?.replace(/\/$/, "");
  const response = await fetch(`${baseUrl}/api${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.METABASE_API_KEY ?? "",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

  const data = (await response.json().catch(() => ({}))) as T & MetabaseErrorBody;

  if (!response.ok || data.status === "failed") {
    throw new Error(data.error || data.message || `Metabase 요청 실패 (HTTP ${response.status})`);
  }

  return data;
};
