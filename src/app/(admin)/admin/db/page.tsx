import Link from "next/link";
import { redirect } from "next/navigation";
import { DetailHeader } from "@/components";
import { cn } from "@/utils";
import { hasValidToken } from "@/utils/hasValidToken/hasValidToken";
import AdminNotice from "../_components/AdminNotice/AdminNotice";
import { DbSqlPanel, DbTableList, DbTableView } from "./_components";
import { DbTable } from "./_types/DbQueryType";
import { getDbTables } from "./_utils/getDbTables/getDbTables";
import { hasMetabaseConfig } from "./_utils/requestMetabase/requestMetabase";
import { verifyAdminSession } from "./_utils/verifyAdminSession/verifyAdminSession";

interface PageProps {
  searchParams: Promise<{
    mode?: string;
    table?: string;
    page?: string;
    column?: string;
    keyword?: string;
  }>;
}

const MODE_TABS = [
  { value: "table", label: "테이블", href: "/admin/db" },
  { value: "sql", label: "SQL", href: "/admin/db?mode=sql" },
] as const;

// 스크롤해도 탭 줄이 헤더(56px) 바로 아래에 붙어 있게 한다.
const TABS_STICKY_TOP = "top-[calc(56px+var(--safe-area-top))]";

const toPositiveInt = (value?: string) => {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : undefined;
};

const page = async ({ searchParams }: PageProps) => {
  const hasToken = await hasValidToken();
  if (!hasToken) redirect("/login");

  // DB 내용을 보여주기 전에 관리자 계정인지 백엔드에 직접 확인한다.
  if (!(await verifyAdminSession())) {
    redirect("/login?reason=session-expired&callbackUrl=%2Fadmin%2Fdb");
  }

  const params = await searchParams;
  const mode = params.mode === "sql" ? "sql" : "table";

  let content;
  if (!hasMetabaseConfig()) {
    content = (
      <AdminNotice
        title="Metabase 연결 설정이 필요해요"
        description="서버 환경 변수 METABASE_URL, METABASE_API_KEY, METABASE_DATABASE_ID를 등록하면 DB를 조회할 수 있어요."
      />
    );
  } else {
    // 테이블 탭은 목록에, SQL 탭은 자동완성에 테이블 구조를 쓴다.
    let tables: DbTable[] | null = null;
    try {
      tables = await getDbTables();
    } catch (error) {
      console.error("[db] Metabase 테이블 목록 조회 실패", error);
    }

    if (!tables) {
      content = (
        <AdminNotice
          title="테이블 목록을 불러오지 못했어요"
          description="Metabase가 켜져 있는지, API 키와 DB id가 맞는지 확인해 주세요."
        />
      );
    } else if (mode === "sql") {
      content = <DbSqlPanel tables={tables} />;
    } else {
      const tableId = toPositiveInt(params.table);
      const currentTable = tables.find((table) => table.id === tableId);
      const fieldId = toPositiveInt(params.column);
      const keyword = params.keyword?.trim();

      content = (
        <div className="flex flex-col gap-6 pc:flex-row">
          <DbTableList tables={tables} currentTableId={currentTable?.id} />
          <div className="min-w-0 flex-1">
            {currentTable ? (
              <DbTableView
                table={currentTable}
                page={toPositiveInt(params.page) ?? 1}
                filter={fieldId && keyword ? { fieldId, keyword } : undefined}
              />
            ) : (
              <p className="py-10 text-center text-body2-regular text-layout-body-default">
                왼쪽 목록에서 조회할 테이블을 선택해 주세요.
              </p>
            )}
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-dvh">
      <DetailHeader title="DB 조회" />
      <h1 className="sr-only">DB 조회</h1>

      <div className="flex flex-col gap-4 px-5 pb-12">
        <nav
          aria-label="조회 방식"
          className={cn(
            "sticky z-20 -mx-5 flex h-[60px] items-center gap-2 bg-white px-5",
            TABS_STICKY_TOP
          )}
        >
          {MODE_TABS.map((tab) => {
            const isActive = tab.value === mode;

            return (
              <Link
                key={tab.value}
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap rounded-full px-4 py-[6px] text-body2-medium transition-colors duration-150",
                  isActive
                    ? "text-white bg-fill-neutralInversed-normal-enteredSelected"
                    : "text-neutralInversed-normal-default bg-fill-neutralInversed-normal-default hover:text-black hover:bg-fill-neutralInversed-normal-hover"
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        {content}
      </div>
    </div>
  );
};

export default page;
