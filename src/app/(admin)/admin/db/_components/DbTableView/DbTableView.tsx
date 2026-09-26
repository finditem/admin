import Link from "next/link";
import AdminNotice from "../../../_components/AdminNotice/AdminNotice";
import { DbTable, DbTableFilter, DbTablePage } from "../../_types/DbQueryType";
import { DB_PAGE_SIZE } from "../../_utils/buildTableQuery/buildTableQuery";
import { queryDbTable } from "../../_utils/queryDbTable/queryDbTable";
import DbResultTable from "../DbResultTable/DbResultTable";

interface DbTableViewProps {
  table: DbTable;
  page: number;
  filter?: DbTableFilter;
}

const PAGE_LINK_STYLE =
  "rounded-[8px] border border-divider-default px-3 py-[6px] text-body2-regular text-neutral-strong-default hover:bg-flatGray-25";

/**
 * 선택한 테이블의 데이터를 50행씩 보여주는 서버 컴포넌트입니다.
 *
 * @remarks
 * - 필터와 페이지는 `?table=&page=&column=&keyword=` 쿼리로 주고받아, 조회한 화면을 주소로 공유할 수 있습니다.
 */
const DbTableView = async ({ table, page, filter }: DbTableViewProps) => {
  const buildHref = (targetPage: number) => {
    const params = new URLSearchParams({ table: String(table.id), page: String(targetPage) });
    if (filter?.keyword) {
      params.set("column", String(filter.fieldId));
      params.set("keyword", filter.keyword);
    }
    return `/admin/db?${params}`;
  };

  let tablePage: DbTablePage | null = null;
  let errorMessage = "";
  try {
    tablePage = await queryDbTable(table, { page, filter });
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : String(error);
  }

  const totalPages = tablePage ? Math.max(1, Math.ceil(tablePage.totalCount / DB_PAGE_SIZE)) : 1;

  return (
    <section aria-labelledby="db-table-title" className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-wrap items-baseline gap-2">
        <h2 id="db-table-title" className="text-body1-semibold text-layout-header-default">
          {table.name}
        </h2>
        {tablePage && (
          <p className="text-body2-regular text-layout-body-default">
            {tablePage.totalCount.toLocaleString()}행
          </p>
        )}
      </div>

      {/* 필터를 바꾸면 첫 페이지부터 다시 본다. */}
      <form action="/admin/db" className="flex flex-wrap items-center gap-2">
        <input type="hidden" name="table" value={table.id} />
        <select
          name="column"
          defaultValue={filter?.fieldId}
          aria-label="필터 컬럼"
          className="h-10 rounded-[10px] border border-divider-default px-3 text-body2-regular bg-fill-neutral-subtle-default"
        >
          {table.fields.map((field) => (
            <option key={field.id} value={field.id}>
              {field.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="keyword"
          defaultValue={filter?.keyword}
          placeholder="값 입력 (문자는 부분 일치)"
          aria-label="필터 값"
          className="h-10 min-w-0 flex-1 rounded-[10px] border border-divider-default px-3 text-body2-regular outline-none bg-fill-neutral-subtle-default placeholder:text-neutral-normal-placeholder"
        />
        <button
          type="submit"
          className="h-10 rounded-[10px] px-4 text-body2-medium text-white bg-fill-neutralInversed-normal-enteredSelected"
        >
          조회
        </button>
        {filter?.keyword && (
          <Link href={`/admin/db?table=${table.id}`} className={PAGE_LINK_STYLE}>
            필터 해제
          </Link>
        )}
      </form>

      {errorMessage ? (
        <AdminNotice title="데이터를 불러오지 못했어요" description={errorMessage} />
      ) : (
        tablePage && (
          <>
            <DbResultTable
              result={tablePage}
              caption={`${table.name} 테이블 데이터`}
              fileName={`${table.name}_${page}페이지`}
            />

            <nav aria-label="페이지 이동" className="flex items-center justify-center gap-3">
              {page > 1 && (
                <Link href={buildHref(page - 1)} className={PAGE_LINK_STYLE}>
                  이전
                </Link>
              )}
              <p className="text-body2-regular text-layout-body-default">
                {page} / {totalPages}
              </p>
              {page < totalPages && (
                <Link href={buildHref(page + 1)} className={PAGE_LINK_STYLE}>
                  다음
                </Link>
              )}
            </nav>
          </>
        )
      )}
    </section>
  );
};

export default DbTableView;
