"use client";

import { useActionState, useRef, useState } from "react";
import CodeMirror, { EditorView, Prec, keymap } from "@uiw/react-codemirror";
import { MySQL, sql as sqlLanguage } from "@codemirror/lang-sql";
import AdminNotice from "../../../_components/AdminNotice/AdminNotice";
import { DbSqlActionState, DbTable } from "../../_types/DbQueryType";
import { runDbSqlAction } from "../../_utils/runDbSqlAction/runDbSqlAction";
import DbResultTable from "../DbResultTable/DbResultTable";

const INITIAL_STATE: DbSqlActionState = { status: "idle" };

interface DbSqlPanelProps {
  /** 자동완성에 쓸 테이블과 컬럼 목록 */
  tables: DbTable[];
}

/** SQL을 직접 입력해 실행하는 화면입니다. 읽기 전용 계정이라 조회(SELECT)만 실행됩니다. */
const DbSqlPanel = ({ tables }: DbSqlPanelProps) => {
  // React 19는 액션 제출 뒤 비제어 입력을 비우므로, 실행한 SQL이 남도록 값을 직접 들고 있는다.
  const [sql, setSql] = useState("");
  const [state, formAction, isPending] = useActionState(runDbSqlAction, INITIAL_STATE);
  const formRef = useRef<HTMLFormElement>(null);

  const extensions = [
    // 운영 DB가 MySQL이라 MySQL 문법으로 색을 입히고, 테이블·컬럼 이름을 자동완성한다.
    sqlLanguage({
      dialect: MySQL,
      schema: Object.fromEntries(
        tables.map((table) => [table.name, table.fields.map((field) => field.name)])
      ),
    }),
    // 편집기 기본 단축키보다 먼저 받아야 Enter가 줄바꿈으로 먹히지 않는다.
    Prec.highest(
      keymap.of([
        {
          key: "Mod-Enter",
          run: () => {
            // 실행 버튼이 막혀 있어도 requestSubmit은 제출되므로, 실행 중에는 직접 막는다.
            if (!isPending) formRef.current?.requestSubmit();
            return true;
          },
        },
      ])
    ),
    // 편집 영역은 contenteditable이라 접근 가능한 이름을 직접 붙인다.
    EditorView.contentAttributes.of({ "aria-label": "실행할 SQL" }),
  ];

  return (
    <section aria-labelledby="db-sql-title" className="flex min-w-0 flex-col gap-4">
      <h2 id="db-sql-title" className="text-body1-semibold text-layout-header-default">
        SQL 조회
      </h2>

      <form ref={formRef} action={formAction} className="flex flex-col gap-2">
        {/* 편집기는 폼 필드가 아니므로 입력값을 숨은 필드로 함께 보낸다. */}
        <input type="hidden" name="sql" value={sql} />
        <CodeMirror
          value={sql}
          onChange={setSql}
          extensions={extensions}
          placeholder="SELECT * FROM notice ORDER BY id DESC LIMIT 20"
          minHeight="180px"
          maxHeight="50dvh"
          className="overflow-hidden rounded-[10px] border border-divider-default text-body2-regular"
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-caption1-regular text-layout-body-default">
            ⌘+Enter(Windows는 Ctrl+Enter)로 실행해요. 조회만 가능하고, 30초가 넘는 쿼리는 중단돼요.
            결과는 최대 2,000행까지 보여줘요.
          </p>
          <button
            type="submit"
            disabled={isPending}
            className="h-10 rounded-[10px] px-4 text-body2-medium text-white bg-fill-neutralInversed-normal-enteredSelected disabled:opacity-50"
          >
            {isPending ? "실행 중" : "실행"}
          </button>
        </div>
      </form>

      {state.status === "error" && (
        <AdminNotice title="SQL을 실행하지 못했어요" description={state.message} />
      )}
      {state.status === "success" && (
        <>
          <p className="text-body2-regular text-layout-body-default">
            {state.result.rows.length.toLocaleString()}행
          </p>
          <DbResultTable result={state.result} caption="SQL 조회 결과" fileName="sql_result" />
        </>
      )}
    </section>
  );
};

export default DbSqlPanel;
